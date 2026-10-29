import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { useQuery, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { platformQuery } from "./platform-query";

export type Profile = Tables<'profiles'> & { avatarUrl: string | null; bannerUrl: string | null };
function useCloudState() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const { data: platform } = useSuspenseQuery(platformQuery);
  const pending = useRef(new Set<string>());
  const [optimisticJoins, setOptimisticJoins] = useState<string[]>([]);
  const [optimisticSaved, setOptimisticSaved] = useState<Record<string, boolean>>({});
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => { setUser(data.user); setAuthReady(true); });
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (!['SIGNED_IN', 'SIGNED_OUT', 'USER_UPDATED'].includes(event)) return;
      setUser(session?.user ?? null);
      setOptimisticJoins([]); setOptimisticSaved({});
      void router.invalidate();
      if (event !== 'SIGNED_OUT') void queryClient.invalidateQueries();
      else queryClient.removeQueries({ queryKey: ['account'] });
    });
    return () => data.subscription.unsubscribe();
  }, [queryClient, router]);
  const account = useQuery({
    queryKey: ['account', user?.id], enabled: !!user,
    queryFn: async () => {
      if (!user) return null;
      const [profile, xp, joins, saved, posts] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase.from('member_xp').select('xp').eq('user_id', user.id).single(),
        supabase.from('community_memberships').select('community_id').eq('user_id', user.id),
        supabase.from('saved_tools').select('tool_id').eq('user_id', user.id),
        supabase.from('posts').select('content').eq('author_id', user.id),
      ]);
      for (const r of [profile, xp, joins, saved, posts]) if (r.error) throw r.error;
      const signed = async (path: string | null) => {
        if (!path) return null;
        const result = await supabase.storage.from('profile-images').createSignedUrl(path, 3600);
        if (result.error) throw result.error;
        return result.data.signedUrl;
      };
      if (!profile.data) return null;
      const [avatarUrl, bannerUrl] = await Promise.all([signed(profile.data.avatar_path), signed(profile.data.banner_path)]);
      return { profile: { ...profile.data, avatarUrl, bannerUrl } as Profile, xp: xp.data?.xp ?? 0,
        joined: joins.data?.map(j => j.community_id) ?? [], saved: saved.data?.map(s => s.tool_id) ?? [], posts: posts.data ?? [] };
    }, staleTime: 60000, refetchInterval: 300000,
  });
  const joined = [...new Set([...(account.data?.joined ?? []), ...optimisticJoins])];
  const saved = new Set(account.data?.saved ?? []);
  Object.entries(optimisticSaved).forEach(([id, value]) => value ? saved.add(id) : saved.delete(id));
  const stats = { ...platform.stats, members: platform.stats.members + (optimisticJoins.length > 0 && (account.data?.joined.length ?? 0) === 0 ? 1 : 0), communityMembers: { ...platform.stats.communityMembers } };
  for (const id of optimisticJoins) stats.communityMembers[id] = (stats.communityMembers[id] ?? 0) + 1;
  const refresh = async () => { await Promise.all([queryClient.invalidateQueries({ queryKey: ['account'] }), queryClient.invalidateQueries({ queryKey: ['platform'] })]); };
  const join = async (id: string) => {
    if (!user) throw new Error('SIGN_IN');
    if (joined.includes(id) || pending.current.has(id)) return;
    pending.current.add(id); setOptimisticJoins(o => [...o, id]);
    try {
      const { error } = await supabase.from('community_memberships').upsert({ user_id: user.id, community_id: id }, { onConflict: 'user_id,community_id', ignoreDuplicates: true });
      if (error) throw error;
      await refresh();
    } finally { pending.current.delete(id); setOptimisticJoins(o => o.filter(x => x !== id)); }
  };
  const toggleSaved = async (id: string) => {
    if (!user) throw new Error('SIGN_IN');
    if (pending.current.has(`tool:${id}`)) return;
    const wasSaved = saved.has(id);
    pending.current.add(`tool:${id}`); setOptimisticSaved(o => ({ ...o, [id]: !wasSaved }));
    try {
      const result = wasSaved ? await supabase.from('saved_tools').delete().eq('user_id', user.id).eq('tool_id', id)
        : await supabase.from('saved_tools').insert({ user_id: user.id, tool_id: id });
      if (result.error) throw result.error;
      await queryClient.invalidateQueries({ queryKey: ['account'] });
    } finally { pending.current.delete(`tool:${id}`); setOptimisticSaved(o => { const next = { ...o }; delete next[id]; return next; }); }
  };
  return { user, authReady, platform, stats, profile: account.data?.profile, xp: account.data?.xp ?? 0,
    accountLoading: account.isLoading, accountError: account.error, joined, saved: [...saved], join, toggleSaved, refresh };
}
type Cloud = ReturnType<typeof useCloudState>;
const CloudContext = createContext<Cloud | null>(null);
export function CloudProvider({ children }: { children: ReactNode }) {
  const state = useCloudState();
  return <CloudContext.Provider value={state}>{children}</CloudContext.Provider>;
}
export function useCloud() {
  const context = useContext(CloudContext);
  if (!context) throw new Error('CloudProvider is missing');
  return context;
}