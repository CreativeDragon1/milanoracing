import { Moon, Sun, Monitor } from 'lucide-react';
import { setTheme, useTheme } from '../theme';
export default function ThemeToggle(){
  const {dark}=useTheme();
  return <button type="button" className="theme-toggle" aria-label={dark?'Switch to light mode':'Switch to dark mode'} title={dark?'Switch to light mode':'Switch to dark mode'} onClick={()=>setTheme(dark?'light':'dark')}>
    {dark?<Sun size={19} aria-hidden="true"/>:<Moon size={19} aria-hidden="true"/>}
  </button>;
}
export function ThemePreference(){
  const {mode}=useTheme();
  return <label className="theme-preference"><Monitor size={15} aria-hidden="true"/><span>Appearance</span><select aria-label="Appearance" value={mode} onChange={event=>setTheme(event.target.value as 'light'|'dark'|'system')}><option value="system">Device setting</option><option value="light">Light</option><option value="dark">Dark</option></select></label>;
}
