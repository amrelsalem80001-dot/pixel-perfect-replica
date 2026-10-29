import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { CalendarDays, Camera, ImagePlus, Pencil, LogOut, Bookmark, ExternalLink } from 'lucide-react';
import { useCloud } from '@/lib/cloud-store';
import { useApp } from '@/lib/app-store';
import { tierProgress } from '@/lib/tiers';
import { TOOLS } from '@/lib/data';
import skyline from '@/assets/skyline.png.asset.json';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { VerifiedBadge } from '@/components/member-badge';
import { ProfileEditor } from '@/components/profile-editor';
import { AccountSignIn } from '@/components/account-sign-in';
import { PostCard } from '@/components/post-card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const Route = createFileRoute('/profile')({
  head: () => ({ meta: [{ title: 'الملف الشخصي | AI Magic City' }, { name: 'description', content: 'ملفك الشخصي، إبداعاتك وأدواتك المفضلة في مدينة الذكاء الاصطناعي.' }, { property: 'og:title', content: 'الملف الشخصي | AI Magic City' }, { property: 'og:description', content: 'هويتك ونقاطك ومشاركاتك في AI Magic City.' }, { property: 'og:type', content: 'profile' }, { name: 'twitter:card', content: 'summary' }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const cloud = useCloud();
  const { tr, lang } = useApp();
  const [edit, setEdit] = useState(false);
  if (!cloud.authReady || cloud.accountLoading) return <p className="py-12 text-center text-muted-foreground">{tr('جارٍ تحميل ملفك...', 'Loading your profile...')}</p>;
  if (!cloud.user) return <AccountSignIn />;
  const profile = cloud.profile;
  if (!profile) return <div className="py-12 text-center"><p>{tr('تعذر تحميل الملف الشخصي', 'Could not load your profile')}</p><Button onClick={() => cloud.refresh()}>{tr('حاول مجدداً', 'Try again')}</Button></div>;
  const progress = tierProgress(cloud.xp);
  const posts = cloud.platform.posts.filter(p => p.authorId === profile.id);
  const savedTools = TOOLS.filter(t => cloud.saved.includes(t.id));
  return <div className="mx-auto max-w-5xl space-y-8">
    <section>
      <div className="relative h-44 overflow-hidden rounded-lg sm:h-60"><img src={profile.bannerUrl ?? skyline.url} alt={tr('غلاف الملف الشخصي', 'Profile banner')} className="size-full object-cover" /><Button variant="secondary" size="sm" className="absolute bottom-3 end-3" onClick={() => setEdit(true)}><ImagePlus />{tr('تعديل الغلاف', 'Edit banner')}</Button></div>
      <div className="relative grid grid-cols-[96px_minmax(0,1fr)] items-start gap-5 px-2 pt-5 sm:grid-cols-[112px_minmax(0,1fr)_auto] sm:px-6">
        <div className="relative -mt-12 shrink-0"><div className="grid size-24 place-items-center overflow-hidden rounded-full border-4 border-background bg-gold text-4xl font-bold text-primary-foreground sm:size-28">{profile.avatarUrl ? <img src={profile.avatarUrl} alt={profile.display_name} className="size-full object-cover" /> : profile.display_name[0]}</div><Button size="icon" variant="secondary" className="absolute bottom-0 end-0 size-8 rounded-full" title={tr('تعديل الصورة', 'Edit photo')} aria-label="Edit photo" onClick={() => setEdit(true)}><Camera className="size-4" /></Button></div>
        <div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-3"><h1 className="break-words text-2xl font-black sm:text-3xl">{profile.display_name}</h1><VerifiedBadge xp={cloud.xp} /></div><p className="break-all text-sm text-muted-foreground" dir="ltr">@{profile.username}</p><p className="mt-3 whitespace-pre-wrap break-words text-sm">{profile.bio}</p><p className="mt-3 flex items-center gap-2 text-xs text-muted-foreground"><CalendarDays className="size-4" />{tr('انضم في', 'Joined')} {new Intl.DateTimeFormat(lang === 'ar' ? 'ar-EG' : 'en', { dateStyle: 'medium', timeZone: 'UTC' }).format(new Date(profile.joined_at))}</p></div>
        <div className="col-span-2 flex flex-wrap gap-2 sm:col-span-1"><Button variant="outline" onClick={() => setEdit(true)}><Pencil />{tr('تعديل الملف', 'Edit profile')}</Button><Button variant="ghost" size="icon" title={tr('تسجيل الخروج', 'Sign out')} aria-label="Sign out" onClick={async () => { const r = await supabase.auth.signOut(); if (r.error) toast.error(tr('تعذر تسجيل الخروج', 'Could not sign out')); }}><LogOut /></Button></div>
      </div>
    </section>
    <section className="space-y-3 border-y py-5"><div className="flex flex-wrap justify-between gap-2 text-sm"><span className="font-bold text-primary">⚡ {cloud.xp} XP</span><span className="text-muted-foreground">{progress.next ? tr(`${progress.remaining} نقطة للوصول إلى ${progress.next.ar}`, `${progress.remaining} XP to ${progress.next.en}`) : tr('وصلت إلى رتبة النخبة / VIP', 'AI Elite / VIP reached')}</span></div><Progress value={progress.percent} aria-label="XP progress" /><div className="flex justify-between text-xs"><span>{tr(progress.current.ar, progress.current.en)}</span><span>{progress.next?.min ?? 'VIP'} XP</span></div></section>
    <Tabs defaultValue="posts"><TabsList className="flex h-auto flex-wrap justify-start gap-1 bg-transparent p-0"><TabsTrigger value="posts">{tr('منشوراتي', 'My posts')} ({posts.length})</TabsTrigger><TabsTrigger value="showcases">{tr('إبداعاتي', 'Showcases')} ({posts.filter(p => p.type === 'showcase').length})</TabsTrigger><TabsTrigger value="saved">{tr('أدواتي المفضلة', 'Saved tools')} ({savedTools.length})</TabsTrigger></TabsList>
      <TabsContent value="posts" className="space-y-4 pt-4">{posts.length ? posts.map(p => <PostCard key={p.id} post={p} />) : <p className="py-10 text-center text-muted-foreground">{tr('لا توجد منشورات بعد', 'No posts yet')}</p>}</TabsContent>
      <TabsContent value="showcases" className="space-y-4 pt-4">{posts.some(p => p.type === 'showcase') ? posts.filter(p => p.type === 'showcase').map(p => <PostCard key={p.id} post={p} />) : <p className="py-10 text-center text-muted-foreground">{tr('لا توجد إبداعات بعد', 'No showcases yet')}</p>}</TabsContent>
      <TabsContent value="saved" className="grid gap-4 pt-4 data-[state=inactive]:hidden sm:grid-cols-2">{savedTools.length ? savedTools.map(tool => <article key={tool.id} className="space-y-3 rounded-lg border bg-card p-4"><div className="flex items-center justify-between"><h3 className="font-bold">{tool.name}</h3><Button size="icon" variant="ghost" title={tr('إزالة من المفضلة', 'Remove saved tool')} aria-label={`Remove ${tool.name}`} onClick={() => cloud.toggleSaved(tool.id).catch(() => toast.error(tr('تعذر الحفظ', 'Could not save')))}><Bookmark className="fill-primary text-primary" /></Button></div><p className="text-sm text-muted-foreground">{tr(tool.desc.ar, tool.desc.en)}</p><Button asChild variant="outline" size="sm"><a href={tool.url} target="_blank" rel="noopener noreferrer">{tr('زيارة الأداة', 'Visit tool')}<ExternalLink /></a></Button></article>) : <p className="py-10 text-center text-muted-foreground sm:col-span-2">{tr('لا توجد أدوات مفضلة بعد', 'No saved tools yet')}</p>}</TabsContent>
    </Tabs>
    <ProfileEditor profile={profile} open={edit} onOpenChange={setEdit} />
  </div>;
}