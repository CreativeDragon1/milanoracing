import { useSyncExternalStore } from 'react';
export type ThemeMode = 'light' | 'dark' | 'system';
const media=window.matchMedia('(prefers-color-scheme: dark)');
export function setTheme(mode:ThemeMode,persist=true){
  const theme=mode==='system'?(media.matches?'dark':'light'):mode;
  const root=document.documentElement;root.dataset.theme=theme;root.dataset.themeMode=mode;root.style.colorScheme=theme;
  const meta=document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');if(meta)meta.content=theme==='dark'?'#0c1017':'#ffffff';
  if(persist)try{if(mode==='system')localStorage.removeItem('milano-theme');else localStorage.setItem('milano-theme',mode);}catch{/* The selection still works for this visit. */}
  window.dispatchEvent(new Event('milano-theme-change'));
}
const mode=()=>document.documentElement.dataset.themeMode as ThemeMode||'system';
media.addEventListener('change',()=>{if(mode()==='system')setTheme('system',false);});
window.addEventListener('storage',event=>{if(event.key==='milano-theme'||event.key===null)setTheme(event.newValue==='dark'||event.newValue==='light'?event.newValue:'system',false);});
const subscribe=(listener:()=>void)=>{window.addEventListener('milano-theme-change',listener);return()=>window.removeEventListener('milano-theme-change',listener);};
export function useTheme(){const value=useSyncExternalStore(subscribe,()=>`${document.documentElement.dataset.theme||'light'}:${mode()}`);return {dark:value.startsWith('dark:'),mode:mode()};}
