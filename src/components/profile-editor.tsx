import { useEffect, useState, type FormEvent } from 'react';
import { Camera, ImagePlus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useCloud, type Profile } from '@/lib/cloud-store';
import { useApp } from '@/lib/app-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

export function ProfileEditor({ profile, open, onOpenChange }: { profile: Profile; open: boolean; onOpenChange: (open: boolean) => void }) {
  const { refresh } = useCloud();
  const { tr } = useApp();
  const [name, setName] = useState(profile.display_name);
  const [username, setUsername] = useState(profile.username);
  const [bio, setBio] = useState(profile.bio);
  const [avatar, setAvatar] = useState<File | null>(null);
  const [banner, setBanner] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState(profile.avatarUrl);
  const [bannerPreview, setBannerPreview] = useState(profile.bannerUrl);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => { if (open) { setName(profile.display_name); setUsername(profile.username); setBio(profile.bio); setAvatar(null); setBanner(null); setError(''); } }, [open, profile]);
  useEffect(() => { const url = avatar ? URL.createObjectURL(avatar) : null; setAvatarPreview(url ?? profile.avatarUrl); return () => { if (url) URL.revokeObjectURL(url); }; }, [avatar, profile.avatarUrl]);
  useEffect(() => { const url = banner ? URL.createObjectURL(banner) : null; setBannerPreview(url ?? profile.bannerUrl); return () => { if (url) URL.revokeObjectURL(url); }; }, [banner, profile.bannerUrl]);
  const pick = (file: File | undefined, kind: 'avatar' | 'banner') => {
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 5 * 1024 * 1024) {
      setError(tr('اختر صورة JPG أو PNG أو WebP بحجم أقل من 5 MB', 'Choose a JPG, PNG or WebP image under 5 MB')); return;
    }
    setError(''); if (kind === 'avatar') setAvatar(file); else setBanner(file);
  };
  const save = async (event: FormEvent) => {
    event.preventDefault(); setSaving(true); setError('');
    const uploaded: string[] = [];
    try {
      const upload = async (file: File | null, kind: string, existing: string | null) => {
        if (!file) return existing;
        const extension = file.type === 'image/jpeg' ? 'jpg' : file.type === 'image/png' ? 'png' : 'webp';
        const path = `${profile.id}/${kind}-${crypto.randomUUID()}.${extension}`;
        const result = await supabase.storage.from('profile-images').upload(path, file, { contentType: file.type });
        if (result.error) throw result.error;
        uploaded.push(path); return path;
      };
      const avatarPath = await upload(avatar, 'avatar', profile.avatar_path);
      const bannerPath = await upload(banner, 'banner', profile.banner_path);
      const result = await supabase.from('profiles').update({ display_name: name.trim(), username: username.trim(), bio: bio.trim(), avatar_path: avatarPath, banner_path: bannerPath }).eq('id', profile.id).select('id').single();
      if (result.error) throw result.error;
      await refresh(); onOpenChange(false); toast.success(tr('تم حفظ الملف الشخصي', 'Profile saved'));
      const old = [avatar && profile.avatar_path, banner && profile.banner_path].filter((p): p is string => typeof p === 'string');
      if (old.length) await supabase.storage.from('profile-images').remove(old);
    } catch (e) {
      if (uploaded.length) await supabase.storage.from('profile-images').remove(uploaded);
      setError(e && typeof e === 'object' && 'code' in e && e.code === '23505' ? tr('اسم المستخدم مستخدم بالفعل', 'Username is already taken') : tr('تعذر الحفظ، حاول مرة أخرى', 'Could not save. Please try again.'));
    } finally { setSaving(false); }
  };
  return <Dialog open={open} onOpenChange={value => { if (!saving) onOpenChange(value); }}><DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
    <DialogHeader><DialogTitle>{tr('تعديل الملف الشخصي', 'Edit profile')}</DialogTitle><DialogDescription>{tr('بياناتك في AI Magic City', 'Your AI Magic City identity')}</DialogDescription></DialogHeader>
    <form onSubmit={save} className="space-y-4">
      <div className="relative h-32 overflow-hidden rounded-lg bg-muted">{bannerPreview && <img src={bannerPreview} className="h-full w-full object-cover" alt={tr('معاينة الغلاف', 'Banner preview')} />}</div>
      <div className="flex items-center gap-4"><div className="grid size-16 shrink-0 place-items-center overflow-hidden rounded-full bg-gold text-2xl font-bold text-primary-foreground">{avatarPreview ? <img src={avatarPreview} className="size-full object-cover" alt={tr('معاينة الصورة', 'Avatar preview')} /> : name[0]}</div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline" size="sm"><label><Camera />{tr('الصورة', 'Photo')}<input className="sr-only" type="file" aria-label="Avatar image" accept="image/jpeg,image/png,image/webp" onChange={e => pick(e.target.files?.[0], 'avatar')} /></label></Button>
          <Button asChild variant="outline" size="sm"><label><ImagePlus />{tr('الغلاف', 'Banner')}<input className="sr-only" type="file" aria-label="Banner image" accept="image/jpeg,image/png,image/webp" onChange={e => pick(e.target.files?.[0], 'banner')} /></label></Button>
        </div>
      </div>
      <label className="block space-y-1 text-sm">{tr('الاسم', 'Display name')}<Input aria-label="Display name" value={name} onChange={e => setName(e.target.value)} required maxLength={80} /></label>
      <label className="block space-y-1 text-sm">{tr('اسم المستخدم', 'Username')}<Input aria-label="Username" dir="ltr" value={username} onChange={e => setUsername(e.target.value)} required pattern="[a-zA-Z0-9_]{3,30}" minLength={3} maxLength={30} /></label>
      <label className="block space-y-1 text-sm">{tr('نبذة', 'Bio')}<Textarea aria-label="Bio" value={bio} onChange={e => setBio(e.target.value)} maxLength={280} /></label>
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
      <div className="flex justify-end gap-2"><Button type="button" variant="ghost" disabled={saving} onClick={() => onOpenChange(false)}>{tr('إلغاء', 'Cancel')}</Button><Button disabled={saving || !name.trim()} type="submit">{saving && <Loader2 className="animate-spin" />}{tr('حفظ التغييرات', 'Save changes')}</Button></div>
    </form>
  </DialogContent></Dialog>;
}