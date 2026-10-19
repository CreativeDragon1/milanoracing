import { build } from 'vite';
import react from '@vitejs/plugin-react';
import { readFile, readdir, mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const scratch = resolve(root, '.standalone-build');
await mkdir(scratch, { recursive: true });
await build({
  configFile: false, root, plugins: [react()], publicDir: false,
  define: { 'process.env.NODE_ENV': JSON.stringify('production') },
  build: {
    outDir: scratch, emptyOutDir: false, cssCodeSplit: false,
    lib: { entry: resolve(root, 'src/main.tsx'), name: 'MilanoRacing', formats: ['iife'], fileName: () => 'milano.js' },
    rollupOptions: { output: { inlineDynamicImports: true } },
  },
});
const types={'.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.svg':'image/svg+xml','.glb':'model/gltf-binary','.ttf':'font/ttf','.woff2':'font/woff2'};
const assets={};
for(const name of await readdir(resolve(root,'public/assets'))){
  const type=types[extname(name)];if(!type)continue;
  assets[`/assets/${name}`]=`data:${type};base64,${(await readFile(resolve(root,'public/assets',name))).toString('base64')}`;
}
const files=await readdir(scratch);
let css=(await Promise.all(files.filter(name=>name.endsWith('.css')).map(name=>readFile(resolve(scratch,name),'utf8')))).join('\n');
css=css.replace(/url\((['"]?)(\/assets\/[^)'"\s]+)\1\)/g,(match,quote,path)=>assets[path]?`url("${assets[path]}")`:match);
if(/https?:\/\/fonts\./.test(css))throw new Error('Offline CSS must not depend on remote fonts.');
const script=(await readFile(resolve(scratch,'milano.js'),'utf8')).replace(/<\/script/gi,'<\\/script');
const runtimeAssets=Object.fromEntries(Object.entries(assets).filter(([name])=>!['.ttf','.woff2'].includes(extname(name))));
const licenses={};
for(const name of await readdir(resolve(root,'licenses'))){licenses[name]=await readFile(resolve(root,'licenses',name),'utf8');}
for(const pkg of ['react','react-dom','three','motion','lucide-react','react-router','react-router-dom']){
  const dir=resolve(root,'node_modules',pkg);
  for(const name of (await readdir(dir)).filter(name=>/^license/i.test(name))){licenses[`${pkg}/${name}`]=await readFile(resolve(dir,name),'utf8');}
}
licenses['garment-provenance']=await readFile(resolve(root,'THIRD-PARTY-ASSETS.md'),'utf8');
const themeInit=await readFile(resolve(root,"public/theme-init.js"),"utf8");
const html=`<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#0019FF"><meta name="description" content="Milano Racing — the team, the car archive, and our personalised kit viewer."><title>Milano Racing</title><script>${themeInit}</script><style>${css}</style></head>
<body><div id="root"></div><noscript>Please enable JavaScript to explore the interactive Milano Racing website.</noscript><script id="milano-assets" type="application/json">${JSON.stringify(runtimeAssets)}</script><script id="milano-licenses" type="application/json">${JSON.stringify(licenses).replace(/</g,'\\u003c')}</script><script>window.__MILANO_OFFLINE__=true;window.__MILANO_ASSETS__=JSON.parse(document.getElementById('milano-assets').textContent);</script><script>${script}</script></body></html>`;
const output=resolve(root,'downloads/Milano-Racing.html');
await mkdir(dirname(output), { recursive: true });
await writeFile(output,html);
console.log(`Standalone HTML saved: ${output} (${(Buffer.byteLength(html)/1024/1024).toFixed(2)} MB).`);
