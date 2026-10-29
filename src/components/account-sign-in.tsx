import { useState, type FormEvent } from 'react';
import { LogIn } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { lovable } from '@/integrations/lovable';
import { useApp } from '@/lib/app-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import '@lovable.dev/cloud-auth-js/styles.css';

export function AccountSignIn() {
  const { tr } = useApp();
  const [signup, setSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const social = async (provider: 'google' | 'lovable') => {
    setMessage(''); setBusy(true);
    try { const result = await lovable.auth.signInWithOAuth(provider, { redirect_uri: `${window.location.origin}/profile` }); if (result.error) setMessage(tr('تعذر تسجيل الدخول', 'Could not sign in')); }
    catch { setMessage(tr('تعذر تسجيل الدخول', 'Could not sign in')); }
    finally { setBusy(false); }
  };
  const submit = async (e: FormEvent) => {
    e.preventDefault(); setBusy(true); setMessage('');
    try {
      const result = signup ? await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/profile` } }) : await supabase.auth.signInWithPassword({ email, password });
      if (result.error) setMessage(tr('راجع البريد وكلمة المرور ثم حاول مجدداً', 'Check your email and password, then try again'));
      else if (signup && !result.data.session) setMessage(tr('تحقق من بريدك لتأكيد الحساب', 'Check your email to confirm your account'));
    } finally { setBusy(false); }
  };
  return <div className="mx-auto max-w-sm space-y-5 py-12"><h1 className="text-3xl font-bold">{tr('ملفك في المدينة', 'Your city profile')}</h1>
    <Button variant="outline" className="w-full" disabled={busy} onClick={() => social('google')}><LogIn />{tr('المتابعة مع Google', 'Continue with Google')}</Button>
    <Button className="lovable-auth-button w-full" disabled={busy} onClick={() => social('lovable')}>Continue with Lovable</Button>
    <form onSubmit={submit} className="space-y-3"><Input aria-label="Email" placeholder={tr('البريد الإلكتروني', 'Email')} type="email" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email" />
      <Input aria-label="Password" placeholder={tr('كلمة المرور', 'Password')} type="password" value={password} onChange={e => setPassword(e.target.value)} minLength={8} required autoComplete={signup ? 'new-password' : 'current-password'} />
      <Button className="w-full" disabled={busy} type="submit">{signup ? tr('إنشاء حساب', 'Create account') : tr('تسجيل الدخول', 'Sign in')}</Button>
    </form>
    <Button variant="link" onClick={() => { setSignup(!signup); setMessage(''); }}>{signup ? tr('لديك حساب؟ تسجيل الدخول', 'Already have an account? Sign in') : tr('حساب جديد', 'Create an account')}</Button>
    {message && <p role="status" className="text-sm text-primary">{message}</p>}
  </div>;
}