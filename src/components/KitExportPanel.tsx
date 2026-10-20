import { useEffect, useId, useRef, useState } from 'react';
import { ArrowUpRight, Check, Download, Film, Image, LoaderCircle, Maximize2, Pause, Play, Repeat2, RotateCcw, X } from 'lucide-react';
import './KitExportPanel.css';

export type KitFormat = 'png' | 'gif' | 'mp4';
export type KitSnapshot = { url: string; format: KitFormat; bytes: number; filename: string };
const formats = [
  { id: 'png' as const, title: 'Image', label: 'PNG', detail: 'High-res', icon: Image },
  { id: 'gif' as const, title: 'Loop', label: 'GIF', detail: '50 fps', icon: Repeat2 },
  { id: 'mp4' as const, title: 'Video', label: 'MP4', detail: '60 fps', icon: Film },
];
const timestamp = (seconds: number) => `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;

function KitVideo({ url, onExpand, suspended = false }: { url: string; onExpand?: () => void; suspended?: boolean }) {
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState('');
  useEffect(() => { if (suspended) video.current?.pause(); }, [suspended]);
  async function toggle() {
    if (!video.current) return;
    if (video.current.paused) {
      try { await video.current.play(); setError(''); }
      catch { setError('Playback unavailable here. Download the MP4 to watch it.'); }
    } else video.current.pause();
  }
  return <div className="ke-player">
    <div className="ke-screen">
      <video ref={video} src={url} loop muted playsInline preload="auto"
        aria-label="Your personalised Milano kit video"
        onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)}
        onLoadedMetadata={e => setDuration(e.currentTarget.duration)}
        onTimeUpdate={e => setTime(e.currentTarget.currentTime)}
        onError={() => setError('Playback unavailable here. Download the MP4 to watch it.')} />
      <button type="button" className={`ke-screen-play${playing ? ' is-playing' : ''}`}
        aria-label={playing ? 'Pause kit video' : 'Play kit video'} onClick={toggle}>
        {playing ? <Pause size={24}/> : <Play size={24}/>}
      </button>
    </div>
    <div className="ke-transport">
      <button type="button" onClick={toggle} aria-label={playing ? 'Pause' : 'Play'}>{playing ? <Pause size={17}/> : <Play size={17}/>}</button>
      <span className="ke-time">{timestamp(time)} / {timestamp(duration)}</span>
      <button type="button" aria-label="Restart video" onClick={() => { if (video.current) video.current.currentTime = 0; setTime(0); }}><RotateCcw size={16}/></button>
      {onExpand && <button type="button" aria-label="Expand video preview" onClick={() => { video.current?.pause(); onExpand(); }}><Maximize2 size={17}/></button>}
      <input type="range" min="0" max={duration || 1} step="0.01" value={time} disabled={!duration}
        aria-label="Video playback position" aria-valuetext={`${timestamp(time)} of ${timestamp(duration)}`}
        onChange={e => { const next = Number(e.target.value); if (video.current) video.current.currentTime = next; setTime(next); }}/>
    </div>
    {error && <p className="ke-playback-error" role="alert">{error}</p>}
  </div>;
}

function KitPreview({ snapshot }: { snapshot: KitSnapshot }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [expanded, setExpanded] = useState(false);
  const title = useId();
  useEffect(() => {
    if (!expanded) { dialog.current?.close(); return; }
    dialog.current?.showModal();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = overflow; };
  }, [expanded]);
  const size = snapshot.bytes < 1_000_000 ? `${Math.round(snapshot.bytes / 1000)} KB` : `${(snapshot.bytes / 1_000_000).toFixed(1)} MB`;
  const download = <a className="ke-primary" href={snapshot.url} download={snapshot.filename}><Download size={17}/>Download {snapshot.format.toUpperCase()}<span>{size}</span></a>;
  const visual = (large: boolean) => snapshot.format === 'mp4'
    ? <KitVideo key={large ? 'large' : 'inline'} url={snapshot.url} suspended={!large && expanded} onExpand={large ? undefined : () => setExpanded(true)}/>
    : <img src={snapshot.url} alt={`Your personalised Milano kit ${snapshot.format === 'gif' ? 'rotating loop' : 'poster'}`}/>;
  return <div className="ke-result">
    <div className="ke-result-heading"><span role="status"><Check size={15}/>Your kit is ready</span><span>{snapshot.format.toUpperCase()}</span></div>
    {visual(false)}
    <button type="button" className="ke-expand" onClick={() => setExpanded(true)}>Open large preview <ArrowUpRight size={15}/></button>
    {download}
    <dialog ref={dialog} className="ke-dialog" aria-labelledby={title} onCancel={() => setExpanded(false)} onClose={() => setExpanded(false)}
      onClick={e => { if (e.target === dialog.current) setExpanded(false); }}>
      {expanded && <div className="ke-dialog-inner">
        <header><div><span>MILANO RACING</span><h2 id={title}>Your team edition.</h2></div><button autoFocus type="button" className="ke-close" aria-label="Close preview" onClick={() => setExpanded(false)}><X size={22}/></button></header>
        {visual(true)}
        {download}
      </div>}
    </dialog>
  </div>;
}

export default function KitExportPanel({ ready, exporting, progress, error, snapshot, onCreate, onCancel }: {
  ready: boolean; exporting: KitFormat | null; progress: number; error: string; snapshot: KitSnapshot | null;
  onCreate: (format: KitFormat) => void; onCancel: () => void;
}) {
  const [format, setFormat] = useState<KitFormat>('mp4');
  const formatGroup = useId();
  const [cancelled, setCancelled] = useState(false);
  const createButton = useRef<HTMLButtonElement>(null);
  const cancelButton = useRef<HTMLButtonElement>(null);
  const wasBusy = useRef(false);
  const busy = !!exporting;
  useEffect(() => {
    if (busy) cancelButton.current?.focus({ preventScroll: true });
    else if (wasBusy.current) createButton.current?.focus({ preventScroll: true });
    wasBusy.current = busy;
  }, [busy]);
  const step = progress >= 95 ? 2 : progress > 0 ? 1 : 0;
  const stages = ['Preparing artwork', exporting === 'png' ? 'Rendering your image' : 'Rendering your rotation', 'Finishing your file'];
  return <section className="ke-panel" aria-label="Save your kit">
    <h4>Take your kit with you.</h4>
    <p>Your name. Your number. Your Milano.</p>
    <fieldset className="ke-formats" disabled={!ready || busy}>
      <legend className="ke-sr-only">Download format</legend>
      {formats.map(({ id, title, label, detail, icon: Icon }) => <label key={id} className={`ke-format${format === id ? ' is-selected' : ''}`}>
        <input type="radio" name={formatGroup} value={id} checked={format === id} onChange={() => setFormat(id)}/>
        <Icon size={20}/><strong>{title}</strong><span>{label} · {detail}</span>
        {format === id && <Check className="ke-format-check" size={12}/>}
      </label>)}
    </fieldset>
    <p className="ke-spec">{format === 'png' ? '2400 × 3000 · current angle · full-quality PNG' : `Full 360° rotation · 7.2 seconds · 960 × 1200`}</p>
    {!busy && <button ref={createButton} type="button" className="ke-primary" disabled={!ready} onClick={() => { setCancelled(false); onCreate(format); }}>
      {format === 'mp4' ? <Film size={17}/> : format === 'gif' ? <Repeat2 size={17}/> : <Image size={17}/>}
      {ready ? `Create ${format === 'png' ? 'image' : format === 'gif' ? 'GIF' : 'video'}` : 'Preparing viewer…'}<ArrowUpRight size={17}/>
    </button>}
    {busy && <div className="ke-progress">
      <div className="ke-progress-heading"><LoaderCircle size={17}/><span role="status">{stages[step]}</span><strong>{progress}<small>%</small></strong></div>
      <progress value={progress} max={100} aria-label="Kit export progress"/>
      <ol aria-label="Export stages">{['Prepare', 'Render', 'Finish'].map((label, i) => <li key={label} className={i <= step ? 'is-active' : ''} aria-current={i === step ? 'step' : undefined}>{i < step ? <Check size={12}/> : <span>{i + 1}</span>}{label}</li>)}</ol>
      <div className="ke-progress-footer"><span>Keep this tab open.</span><button ref={cancelButton} type="button" onClick={() => { onCancel(); setCancelled(true); }}>Cancel export</button></div>
    </div>}
    {!busy && cancelled && <p className="ke-notice" role="status">Export cancelled. Your kit is unchanged.</p>}
    {error && <p className="ke-error" role="alert">{error}</p>}
    {snapshot && <KitPreview key={snapshot.url} snapshot={snapshot}/>}
  </section>;
}
