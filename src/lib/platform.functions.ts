import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import type { L, Post } from "./data";

export type PlatformStats = { posts: number; members: number; communities: number; communityMembers: Record<string, number> };
export const getPlatform = createServerFn({ method: "GET" }).handler(async () => {
  const key = process.env['SUPABASE_PUBLISHABLE_KEY'];
  const url = process.env['SUPABASE_URL'];
  if (!key || !url) throw new Error("Cloud configuration unavailable");
  const db = createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { fetch: (input, init) => {
      const headers = new Headers(init?.headers);
      if (key.startsWith('sb_') && headers.get('Authorization') === `Bearer ${key}`) headers.delete('Authorization');
      headers.set('apikey', key);
      return fetch(input, { ...init, headers });
    } },
  });
  const [stats, communities, posts, members, xp] = await Promise.all([
    db.rpc('platform_stats'), db.from('communities').select('id,name,description,icon'),
    db.from('posts').select('id,author_id,content').order('created_at', { ascending: false }),
    db.from('profiles').select('id,display_name,username'), db.from('member_xp').select('user_id,xp'),
  ]);
  for (const result of [stats, communities, posts, members, xp]) if (result.error) throw new Error("Could not load community data");
  return {
    stats: stats.data as unknown as PlatformStats,
    communities: (communities.data ?? []).map(c => ({ id: c.id, name: c.name as unknown as L, desc: c.description as unknown as L, icon: c.icon })),
    posts: (posts.data ?? []).map(p => ({ ...(p.content as unknown as Post), authorId: p.author_id ?? (p.content as unknown as Post).authorId })),
    members: (members.data ?? []).map(m => ({ id: m.id, name: m.display_name, handle: m.username, xp: xp.data?.find(x => x.user_id === m.id)?.xp ?? 0 })),
  };
});