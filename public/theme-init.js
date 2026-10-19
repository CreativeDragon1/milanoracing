// Apply before first paint, including when storage is unavailable.
(function(){
  var mode='system';try{var saved=localStorage.getItem('milano-theme');if(saved==='light'||saved==='dark')mode=saved;}catch(e){}
  var theme=mode==='system'?(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'):mode;
  document.documentElement.dataset.theme=theme;document.documentElement.dataset.themeMode=mode;
  document.documentElement.style.colorScheme=theme;
  var meta=document.querySelector('meta[name="theme-color"]');if(meta)meta.content=theme==='dark'?'#0c1017':'#ffffff';
})();
