import { useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'motion/react';
import { asset } from '../assets';
import type { JerseyScene } from '../lib/jerseyScene';
import './KitShortcut.css';

/** A decorative preview inside a normal link; tapping still navigates immediately. */
export default function KitShortcut() {
  const host=useRef<HTMLDivElement>(null), scene=useRef<JerseyScene|null>(null);
  const [ready,setReady]=useState(false),[hovered,setHovered]=useState(false),[focused,setFocused]=useState(false);
  const [visible,setVisible]=useState(!document.hidden);
  const inView=useInView(host,{margin:'80px 0px'}), reduced=useReducedMotion();
  const active=(hovered||focused)&&inView&&visible&&!reduced;
  const activeRef=useRef(active);activeRef.current=active;
  useEffect(()=>{
    const link=host.current?.closest('a');if(!link)return;
    const enter=(event:PointerEvent)=>{if(event.pointerType==='mouse')setHovered(true);};
    const leave=()=>setHovered(false);
    const focus=()=>setFocused(true),blur=()=>setFocused(false);
    const visibility=()=>setVisible(!document.hidden);
    link.addEventListener('pointerenter',enter);link.addEventListener('pointerleave',leave);
    link.addEventListener('focus',focus);link.addEventListener('blur',blur);
    document.addEventListener('visibilitychange',visibility);
    return ()=>{link.removeEventListener('pointerenter',enter);link.removeEventListener('pointerleave',leave);link.removeEventListener('focus',focus);link.removeEventListener('blur',blur);document.removeEventListener('visibilitychange',visibility);};
  },[]);
  useEffect(()=>{
    if(!inView||!host.current||scene.current)return;
    let cancelled=false;
    const el=host.current;
    import('../lib/jerseyScene').then(module=>module.createJerseyScene(el,!!reduced,(angle)=>{el.dataset.angle=String(angle);},true)).then(owned=>{
      if(cancelled){owned.dispose();return;}
      scene.current=owned;setReady(true);owned.spin(activeRef.current);
    }).catch(()=>{if(!cancelled)setReady(false);});
    return ()=>{cancelled=true;};
  },[inView,reduced]);
  useEffect(()=>{scene.current?.spin(active);},[active]);
  useEffect(()=>()=>{scene.current?.dispose();scene.current=null;},[]);
  return <div className={`kit-shortcut-preview ${ready?'is-ready':''}`} data-spinning={ready&&active?'true':'false'} role="img" aria-label="Milano Racing team kit">
    <span className="kit-shortcut-wordmark" aria-hidden="true">MILANO</span>
    <img className="kit-shortcut-fallback" src={asset('jersey-front-recreated.png')} alt="" loading="lazy"/>
    <div className="kit-shortcut-scene" ref={host} aria-hidden="true"/>
  </div>;
}
