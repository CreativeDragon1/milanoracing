import { useCallback, useEffect, useRef, useState } from 'react';
import { adminClient } from './client';
import { emptyWorkspace, type Table, type Tables, type Workspace } from './types';
export function useWorkspace(preview: Workspace | null, onAccessLost: () => void) {
  const [data, setData] = useState<Workspace>(preview ?? emptyWorkspace());
  const [loading, setLoading] = useState(!preview);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const lock = useRef(false);
  const lost = useRef(onAccessLost); lost.current = onAccessLost;
  const refresh = useCallback(async () => {
    if (preview) return;
    setLoading(true); setError('');
    try {
      if (!adminClient) throw Error('The workspace is not connected.');
      const access = await adminClient.rpc('is_milano_admin');
      if (access.error) throw access.error;
      if (access.data !== true) { setData(emptyWorkspace()); lost.current(); return; }
      const tables: Table[] = ['admin_tasks','admin_goals','admin_raci','admin_impacts'];
      const results = await Promise.all(tables.map(t => adminClient!.from(t).select('*').order(t === 'admin_tasks' ? 'updated_at' : 'position', { ascending: t !== 'admin_tasks' })));
      const failure = results.find(r => r.error); if (failure) throw failure.error;
      setData(Object.fromEntries(tables.map((t,i) => [t,results[i].data])) as Workspace);
    } catch { setError('Could not load the workspace. Check your connection and try Refresh.'); }
    finally { setLoading(false); }
  }, [preview]);
  useEffect(() => { void refresh(); }, [refresh]);
  async function save<K extends Table>(table: K, values: Partial<Tables[K]>, current?: Tables[K], remove = false) {
    if (lock.current) return false;
    lock.current = true; setBusy(true); setError(''); setNotice('');
    try {
      let saved: Tables[K];
      if (preview) {
        saved = { ...current, ...values, id: current?.id ?? crypto.randomUUID(), revision: (current?.revision ?? 0)+1, updated_at: new Date().toISOString() } as Tables[K];
      } else {
        if (!adminClient) throw Error('Not connected');
        const access = await adminClient.rpc('is_milano_admin');
        if (access.error) throw access.error;
        if (access.data !== true) { setData(emptyWorkspace()); lost.current(); return false; }
        const payload: Record<string, unknown> = { ...values };
        const query = current
          ? (remove ? adminClient.from(table).delete() : adminClient.from(table).update(payload)).eq('id',current.id).eq('revision',current.revision)
          : adminClient.from(table).insert(payload);
        const result = await query.select('*').maybeSingle();
        if (result.error) throw result.error;
        if (!result.data) throw Error('conflict');
        saved = result.data as Tables[K];
      }
      setData(old => ({ ...old, [table]: remove ? old[table].filter(r => r.id !== current!.id) : current ? old[table].map(r => r.id === current.id ? saved : r) : [...old[table], saved] }));
      setNotice(preview ? 'Preview updated · changes reset on reload' : remove ? 'Deleted' : 'Saved to the team workspace');
      return true;
    } catch (e) {
      setError(e instanceof Error && e.message === 'conflict' ? 'This item changed in another session. Close the editor and Refresh before trying again.' : 'Your change was not saved. Check your connection or access and try again.');
      return false;
    } finally { lock.current = false; setBusy(false); }
  }
  return { data, loading, busy, error, notice, refresh, save };
}
