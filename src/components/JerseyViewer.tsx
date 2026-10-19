import { useEffect, useId, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import { RotateCcw, Plus, Minus, MoveHorizontal, Maximize, Minimize, ArrowLeft, ArrowRight, Download } from 'lucide-react';
import { Press } from '../motion';
import { useTheme } from '../theme';
import { asset } from '../assets';
import { people } from '../content';
import type { JerseyScene } from '../lib/jerseyScene';

export default function JerseyViewer() {
  const {dark}=useTheme();
  const id=useId();
  const section=useRef<HTMLDivElement>(null),host=useRef<HTMLDivElement>(null),scene=useRef<JerseyScene|null>(null);
  const reduced=useReducedMotion();
  const [ready,setReady]=useState(false),[failed,setFailed]=useState(false);
  const [angle,setAngle]=useState(10),[zoom,setZoom]=useState(100),[full,setFull]=useState(false);
  const [side,setSide]=useState<'front'|'back'>('front');
  const [snapshot,setSnapshot]=useState<{url:string;format:'png'|'gif'|'mp4'}|null>(null);
  const [exporting,setExporting]=useState<'png'|'gif'|'mp4'|null>(null),[progress,setProgress]=useState(0),[exportError,setExportError]=useState('');
  const exportAbort=useRef<AbortController|null>(null);
  const [draftName,setDraftName]=useState(''),[draftNumber,setDraftNumber]=useState('');
  const [personal,setPersonal]=useState({name:'',number:''});
  useEffect(()=>()=>{exportAbort.current?.abort();},[]);
  useEffect(()=>()=>{if(snapshot)URL.revokeObjectURL(snapshot.url);},[snapshot]);
  async function downloadKit(format:'png'|'gif'|'mp4'){
    if(!scene.current||exportAbort.current)return;
    const controller=new AbortController();exportAbort.current=controller;
    setExporting(format);setProgress(0);setExportError('');setSnapshot(null);
    try{
      const {exportKit}=await import('../lib/kitExport');
      controller.signal.throwIfAborted();
      const blob=await exportKit(scene.current,format,controller.signal,setProgress);
      if(!controller.signal.aborted)setSnapshot({url:URL.createObjectURL(blob),format});
    }catch(error){if(!controller.signal.aborted)setExportError(error instanceof Error?error.message:'Download could not be prepared. Please try again.');}
    finally{if(exportAbort.current===controller){exportAbort.current=null;setExporting(null);}}
  }
  useEffect(()=>{
    const el=host.current;if(!el)return;
    let cancelled=false,owned:JerseyScene|undefined;setReady(false);setFailed(false);
    const observer=new IntersectionObserver(entries=>{
      if(!entries.some(entry=>entry.isIntersecting))return;observer.disconnect();
      import('../lib/jerseyScene').then(module=>module.createJerseyScene(el,!!reduced,(a,z)=>{
        if(!cancelled){setAngle(a);setZoom(z);}
      })).then(api=>{
        if(cancelled){api.dispose();return;}owned=api;scene.current=api;setReady(true);
      }).catch(()=>{if(!cancelled)setFailed(true);});
    },{rootMargin:'200px'});
    observer.observe(el);
    return()=>{cancelled=true;observer.disconnect();owned?.dispose();scene.current=null;};
  },[reduced]);
  useEffect(()=>{scene.current?.personalise(personal);},[personal,ready]);
  useEffect(()=>{
    const change=()=>setFull(document.fullscreenElement===section.current);
    document.addEventListener('fullscreenchange',change);return()=>document.removeEventListener('fullscreenchange',change);
  },[]);
  function preset(value:'front'|'back'){setSide(value);scene.current?.preset(value);}
  function personalise(name:string,number:string){
    const clean={name:name.trim().toUpperCase().slice(0,18),number:number.replace(/\D/g,'').slice(0,2)};
    setPersonal(clean);setDraftName(clean.name);setDraftNumber(clean.number);setSnapshot(null);preset('back');
  }
  function key(e:React.KeyboardEvent){
    const keys:Record<string,()=>void>={ArrowLeft:()=>scene.current?.rotate(-Math.PI/12,0),ArrowRight:()=>scene.current?.rotate(Math.PI/12,0),ArrowUp:()=>scene.current?.rotate(0,-Math.PI/18),ArrowDown:()=>scene.current?.rotate(0,Math.PI/18),'+':()=>scene.current?.zoom(1),'=':()=>scene.current?.zoom(1),'-':()=>scene.current?.zoom(-1),r:()=>scene.current?.reset(),Home:()=>scene.current?.reset()};
    if(keys[e.key]){e.preventDefault();keys[e.key]();}
  }
  return <div className="kit-viewer raised" ref={section}>
    <div className="kit-topline"><span className="small-label">THE MILANO KIT</span><span className="kit-edition">360° VIEW</span></div>
    <div className="kit-product-layout"><div className="kit-display" inert={!!exporting}>
    <div className="kit-stage" ref={host} tabIndex={0} role="region" aria-label="Interactive Milano jersey. Drag to rotate. Arrow keys rotate and tilt, plus and minus zoom, R resets." onKeyDown={key}>
      {!ready&&!failed&&<div className="kit-loading" role="status">Preparing the team kit…</div>}
      {failed&&<div className="kit-fallback"><img src={asset(`jersey-${side}-recreated.png`)} alt={`Milano Racing jersey ${side}`}/>{side==='back'&&<div className="kit-fallback-personal"><strong>{personal.number}</strong><span>{personal.name}</span></div>}</div>}
      <div className="kit-studio-backdrop" aria-hidden="true">
        <svg className="kit-studio-wordmark" viewBox="0 0 1000 150" focusable="false">
          <text x="500" y="118" textAnchor="middle" textLength="960" lengthAdjust="spacingAndGlyphs">MILANO</text>
        </svg>
        <span className="kit-studio-floor"/>
        <svg className="kit-studio-signature" viewBox="25 230 555 185" focusable="false">
          <defs><filter id={`${id}-silver`} colorInterpolationFilters="sRGB">
            <feColorMatrix type="saturate" values="0"/>
            <feComponentTransfer>
              <feFuncR type="linear" slope=".42" intercept=".4"/>
              <feFuncG type="linear" slope=".42" intercept=".4"/>
              <feFuncB type="linear" slope=".42" intercept=".4"/>
            </feComponentTransfer>
          </filter></defs>
          {dark ? <image href={asset("milano-dark.svg")} x="25" y="230" width="555" height="185"/> : <image href={asset('milano-official.png')} width="648" height="648" filter={`url(#${id}-silver)`}/>}
        </svg>
      </div>
    </div>
    <div className="kit-inspect-hint"><MoveHorizontal size={16}/><span>{failed?'3D unavailable · front and back previews available':'Drag to explore · arrow keys to rotate'}</span><span className="kit-angle">{failed?side:`${angle}° / ${zoom}%`}</span></div>
    <div className="kit-controls">
      <div className="segmented" role="group" aria-label="Jersey view">
        <Press disabled={!ready&&!failed} aria-pressed={failed?side==='front':angle<15||angle>345} onClick={()=>preset('front')}>Front</Press>
        <Press disabled={!ready&&!failed} aria-pressed={failed?side==='back':Math.abs(angle-180)<15} onClick={()=>preset('back')}>Back</Press>
      </div>
      <div className="kit-tools" role="group" aria-label="Jersey inspection controls">
        <Press className="icon-button" disabled={!ready} aria-label="Rotate jersey left" onClick={()=>scene.current?.rotate(-Math.PI/6,0)}><ArrowLeft size={16}/></Press>
        <Press className="icon-button" disabled={!ready} aria-label="Rotate jersey right" onClick={()=>scene.current?.rotate(Math.PI/6,0)}><ArrowRight size={16}/></Press>
        <Press className="icon-button" disabled={!ready} aria-label="Zoom out jersey" onClick={()=>scene.current?.zoom(-1)}><Minus size={16}/></Press>
        <Press className="icon-button" disabled={!ready} aria-label="Zoom in jersey" onClick={()=>scene.current?.zoom(1)}><Plus size={16}/></Press>
        <Press className="icon-button" disabled={!ready} aria-label="Reset jersey view" onClick={()=>scene.current?.reset()}><RotateCcw size={16}/></Press>
        <Press className="icon-button" aria-label={full?'Exit full screen':'Expand jersey viewer'} onClick={()=>{if(document.fullscreenElement)document.exitFullscreen();else section.current?.requestFullscreen?.().catch(()=>{});}}>{full?<Minimize size={16}/>:<Maximize size={16}/>}</Press>
      </div>
    </div>
    </div><div className="kit-custom-panel">
    <div className="kit-product-title"><h3>The team edition.</h3><p>Rotate the kit, choose a name and number, and save your view.</p></div>
    <form className="kit-personalise" inert={!!exporting} onSubmit={e=>{e.preventDefault();personalise(draftName,draftNumber);}}>
      <div className="kit-personalise-heading"><h4>Personalise your kit</h4><span>OPTIONAL</span></div>
      <div className="kit-fields">
        <label htmlFor={`${id}-name`}>Name on back<input id={`${id}-name`} value={draftName} maxLength={18} placeholder="YOUR NAME" autoComplete="off" onChange={e=>setDraftName(e.target.value)}/></label>
        <label htmlFor={`${id}-number`}>Number<input id={`${id}-number`} value={draftNumber} maxLength={2} inputMode="numeric" pattern="[0-9]{0,2}" placeholder="00" autoComplete="off" onChange={e=>setDraftNumber(e.target.value.replace(/\D/g,'').slice(0,2))}/></label>
      </div>
      <div className="kit-personalise-actions"><Press type="submit" disabled={!ready&&!failed} className="kit-apply">Preview on back <ArrowRight size={15}/></Press><Press type="button" className="text-link" onClick={()=>personalise('','')}>Clear name & number</Press></div>
      <label className="kit-preset-label" htmlFor={`${id}-preset`}>Or try a team kit<select aria-label="Choose a team kit" id={`${id}-preset`} value="" disabled={!ready&&!failed} onChange={e=>{const person=people.find(p=>p.id===e.target.value);if(person)personalise(person.name.split(' ')[0],person.number??'');}}><option value="">Choose a team member</option>{people.map(p=><option key={p.id} value={p.id}>{p.name} · {p.number}</option>)}</select></label>
      <p className="kit-personal-status" role="status">{personal.name||personal.number?`Previewing ${[personal.name,personal.number].filter(Boolean).join(' · ')}`:'Standard team kit · no name or number'}<span>Preview only. Your details stay on this device.</span></p>
    </form>
    <div className="kit-export-panel" aria-busy={!!exporting}>
      <h4>Take your kit with you.</h4>
      <p>A studio backdrop. Your kit. The Milano signature.</p>
      <div className="kit-downloads">
        <button className="kit-save" disabled={!ready||!!exporting} onClick={()=>downloadKit('png')}><Download size={14}/>Create PNG<span>2400 × 3000</span></button>
        <button className="kit-save" disabled={!ready||!!exporting} onClick={()=>downloadKit('gif')}><RotateCcw size={14}/>Create rotating GIF<span>960 × 1200 · 50 fps</span></button>
        <button className="kit-save kit-video-save" disabled={!ready||!!exporting} onClick={()=>downloadKit('mp4')}><Download size={14}/>Create 60 fps video<span>960 × 1200 · MP4</span></button>
      </div>
      {exporting&&<div className="kit-export-progress"><p role="status">{exporting!=='png'?'Creating your rotation':'Preparing your image'}… {progress}%</p><progress value={progress} max={100} aria-label="Download preparation"/><button type="button" className="text-link" onClick={()=>exportAbort.current?.abort()}>Cancel</button></div>}
      {exportError&&<p role="alert" className="kit-export-error">{exportError}</p>}
      {snapshot&&<div className="kit-export-result">{snapshot.format==='mp4'?<video src={snapshot.url} controls loop muted playsInline preload="metadata" aria-label="Your personalised Milano kit at 60 frames per second"/>:<img src={snapshot.url} alt={`Your personalised Milano kit ${snapshot.format==='gif'?'rotating showcase':'poster'}`}/>}<a className="kit-save" href={snapshot.url} download={`milano-kit${personal.name?'-'+personal.name.replace(/[^A-Z0-9]+/g,'-'):''}.${snapshot.format}`}>Download {snapshot.format.toUpperCase()} <Download size={14}/></a></div>}
    </div>
    </div></div>
  </div>;
}
