import { lazy, Suspense, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, LockKeyhole } from 'lucide-react';
import { adminClient } from './client';
import type { Workspace } from './types';
import './admin.css';
const Dashboard = lazy(() => import('./Dashboard'));
type Access = 'checking' | 'signed-out' | 'allowed' | 'denied' | 'error';
export default function Admin() {
  const [access, setAccess] = useState<Access>('checking');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState<Workspace | null>(null);
  useEffect(() => {
    document.title = 'Team workspace | Milano Racing';
    const meta = document.createElement('meta'); meta.name = 'robots'; meta.content = 'noindex, nofollow, noarchive'; document.head.append(meta);
    if (new URLSearchParams(location.search).has('error')) {
      setMessage('Sign-in was not completed. Choose an approved Google account and try again.');
      history.replaceState(null, '', location.pathname);
    }
    return () => meta.remove();
  }, []);
  useEffect(() => {
    let active = true, generation = 0;
    if (import.meta.env.DEV && new URLSearchParams(location.search).get('preview') === '1') {
      import('./preview').then(m => { if (active) setPreview(m.previewWorkspace()); });
      return () => { active = false; };
    }
    if (!adminClient) { setAccess('signed-out'); return; }
    const client = adminClient;
    async function check() {
      const current = ++generation;
      try {
        const { data, error } = await client.auth.getUser();
        if (!active || current !== generation) return;
        if (error || !data.user) { setAccess('signed-out'); return; }
        const result = await client.rpc('is_milano_admin');
        if (!active || current !== generation) return;
        setAccess(result.error ? 'error' : result.data === true ? 'allowed' : 'denied');
      } catch { if (active && current === generation) setAccess('error'); }
    }
    void check();
    // Defer work outside Supabase's auth callback to avoid holding its auth lock.
    const { data: listener } = client.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') { generation++; setAccess('signed-out'); }
      else setTimeout(() => { if (active) void check(); }, 0);
    });
    window.addEventListener('focus', check);
    const interval = window.setInterval(check, 60000);
    return () => { active = false; generation++; listener.subscription.unsubscribe(); window.removeEventListener('focus', check); clearInterval(interval); };
  }, []);
  async function signOut() {
    setBusy(true);
    const result = await adminClient?.auth.signOut({ scope: 'local' });
    if (result?.error) setMessage('Could not sign out. Please try again.');
    else { setAccess('signed-out'); setMessage('You have signed out.'); }
    setBusy(false);
  }
  if (preview || access === 'allowed') return <Suspense fallback={<div className="admin-shell admin-loading" role="status">Opening workspace…</div>}><Dashboard preview={preview} onSignOut={signOut} onAccessLost={() => setAccess('denied')} /></Suspense>;
  return <div className="admin-shell admin-gate">
    <Link to="/" className="admin-back"><ArrowLeft size={16} /> Back to Milano Racing</Link>
    <section className="admin-login">
      <span className="admin-kicker">MILANO RACING / TEAM ACCESS</span>
      <div className="admin-lock"><LockKeyhole size={27}/></div>
      <h1>A space for<br/><span>our team.</span></h1>
      {access === 'checking' ? <p role="status">Checking your access…</p> : access === 'denied' ? <>
        <p>This account doesn’t have access to the team workspace.</p><button className="admin-primary" disabled={busy} onClick={signOut}>Use another account</button>
      </> : access === 'error' ? <><p role="alert">We couldn’t verify your access. Please try again.</p><button className="admin-primary" onClick={() => location.reload()}>Try again</button></> : !adminClient ? <p>The private workspace is being set up. Access is closed until setup is complete.</p> : <>
        <p>Continue with your approved Google account.<br/>Only invited team members can enter.</p>
        <div className="admin-login-actions"><button className="admin-primary" disabled={busy} onClick={async () => {
          if (busy) return; setBusy(true); setMessage('');
          try {
            const { error } = await adminClient!.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: `${location.origin}/admin`, queryParams: { prompt: 'select_account' } } });
            if (error) setMessage('Unable to start Google sign-in. Please try again shortly.');
          } catch { setMessage('Unable to connect. Please try again.'); }
          finally { setBusy(false); }
        }}>{busy ? 'Connecting…' : 'Sign in with Google'}<ArrowUpRight size={18}/></button></div>
      </>}
      <p className="admin-message" role="status">{message}</p>
      <div className="admin-login-note"><LockKeyhole size={14}/> Private team workspace</div>
    </section>
  </div>;
}
