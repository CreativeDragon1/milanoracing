import { asset } from '../assets';
import type { JerseyScene } from './jerseyScene';
import GifWorker from './kitGif.worker.ts?worker&inline';

const loadImage=(src:string)=>new Promise<HTMLImageElement>((resolve,reject)=>{const image=new Image();image.onload=()=>resolve(image);image.onerror=()=>reject(new Error('Could not load export artwork. Please try again.'));image.src=src;});
const nextPaint=()=>new Promise<void>(resolve=>setTimeout(resolve,0));
export async function exportKit(scene:JerseyScene,format:'png'|'gif',signal:AbortSignal,onProgress:(value:number)=>void):Promise<Blob>{
  const check=()=>signal.throwIfAborted();check();
  const [logo,dragon]=await Promise.all([loadImage(asset('milano-official.png')),loadImage(asset('kit-dragon-original.png')),document.fonts.ready]);check();
  const width=format==='png'?2400:960,height=width*1.25;
  const canvas=document.createElement('canvas');canvas.width=width;canvas.height=height;
  const ctx=canvas.getContext('2d',{willReadFrequently:format==='gif'})!;
  const background=document.createElement('canvas');background.width=width;background.height=height;
  const bg=background.getContext('2d')!;bg.scale(width/960,width/960);
  const gradient=bg.createLinearGradient(0,0,960,1200);gradient.addColorStop(0,'#141c48');gradient.addColorStop(.55,'#080c20');gradient.addColorStop(1,'#02030a');bg.fillStyle=gradient;bg.fillRect(0,0,960,1200);
  bg.save();bg.globalAlpha=.045;bg.drawImage(dragon,0,0,960,1200);bg.restore();
  bg.fillStyle='#0019ff';bg.beginPath();bg.moveTo(0,220);bg.lineTo(230,0);bg.lineTo(310,0);bg.lineTo(0,305);bg.fill();
  bg.strokeStyle='#ff7a00';bg.lineWidth=3;bg.beginPath();bg.moveTo(0,330);bg.lineTo(330,0);bg.stroke();
  const glow=bg.createRadialGradient(480,650,60,480,650,510);glow.addColorStop(0,'#23398a55');glow.addColorStop(1,'#0019ff00');bg.fillStyle=glow;bg.fillRect(0,180,960,880);
  bg.strokeStyle='#263469';bg.lineWidth=1;bg.beginPath();bg.ellipse(480,1000,305,53,0,0,Math.PI*2);bg.stroke();
  bg.save();bg.shadowColor='#ffffff';bg.shadowBlur=1.5;bg.drawImage(logo,25,230,555,185,62,62,210,70);bg.restore();
  bg.fillStyle='#ffffff';bg.font='500 13px "DM Sans"';bg.textAlign='right';bg.fillText('THE TEAM EDITION',898,94);
  bg.fillStyle='#9da6cb';bg.font='500 12px "DM Sans"';bg.fillText('MILANO RACING',898,116);
  bg.textAlign='left';bg.fillStyle='#ffffff';bg.font='400 27px Michroma';bg.fillText('MADE YOURS.',62,1110);
  bg.fillStyle='#9da6cb';bg.font='400 13px "DM Sans"';bg.fillText('MILANO RACING  /  SINGAPORE',64,1144);
  bg.fillStyle='#ff7a00';bg.fillRect(776,1135,60,4);bg.fillStyle='#0019ff';bg.fillRect(836,1135,62,4);
  const output=scene.createExport(width,Math.round(height*.85));
  let worker:Worker|undefined;
  const abort=()=>worker?.terminate();signal.addEventListener('abort',abort,{once:true});
  try{
    const draw=(angle?:number)=>{check();ctx.drawImage(background,0,0);ctx.drawImage(output.render(angle),0,height*.065);};
    if(format==='png'){draw();onProgress(95);return await new Promise<Blob>((resolve,reject)=>canvas.toBlob(blob=>{if(signal.aborted)reject(signal.reason);else if(blob)resolve(blob);else reject(new Error('Image export failed'));},'image/png'));}
    worker=new GifWorker();
    const send=(data:object,transfer:Transferable[]=[])=>new Promise<{bytes?:Uint8Array}>((resolve,reject)=>{
      const cancelled=()=>{cleanup();reject(signal.reason);};
      const cleanup=()=>{signal.removeEventListener('abort',cancelled);};
      worker!.onmessage=event=>{cleanup();event.data.error?reject(new Error(event.data.error)):resolve(event.data);};
      worker!.onerror=()=>{cleanup();reject(new Error('Could not create GIF. Try the PNG download.'));};
      signal.addEventListener('abort',cancelled,{once:true});worker!.postMessage(data,transfer);
    });
    const frames=90;
    for(let i=0;i<frames;i++){
      check();draw(Math.PI+i/frames*Math.PI*2);
      const rgba=ctx.getImageData(0,0,width,height).data;
      await send({rgba,width,height,delay:80},[rgba.buffer]);
      onProgress(Math.round((i+1)/frames*95));await nextPaint();
    }
    check();const result=await send({finish:true});check();
    return new Blob([result.bytes! as BlobPart],{type:'image/gif'});
  }finally{signal.removeEventListener('abort',abort);worker?.terminate();output.dispose();canvas.width=0;background.width=0;}
}
