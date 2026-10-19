import { BufferTarget, CanvasSource, Mp4OutputFormat, Output, Quality, canEncodeVideo } from 'mediabunny';

/** Encode every rendered frame with a fixed timestamp, independent of device speed. */
export async function exportKitVideo(canvas:HTMLCanvasElement, draw:(angle:number)=>void, signal:AbortSignal, progress:(value:number)=>void) {
  const quality=new Quality({bitrate:8_000_000});
  if(!await canEncodeVideo('avc',{width:canvas.width,height:canvas.height,frameRate:60,quality})) {
    throw new Error('60 fps video is unavailable in this browser. Try the GIF download or a recent Chrome or Edge browser.');
  }
  signal.throwIfAborted();
  const target=new BufferTarget();
  const output=new Output({format:new Mp4OutputFormat(),target});
  const source=new CanvasSource(canvas,{codec:'avc',quality});
  output.addVideoTrack(source,{frameRate:60});
  const abort=()=>{void output.cancel().catch(()=>{});};
  signal.addEventListener('abort',abort,{once:true});
  try {
    await output.start();
    for(let i=0;i<432;i++) {
      signal.throwIfAborted();draw(Math.PI+i/432*Math.PI*2);
      await source.add(i/60,1/60);
      progress(Math.round((i+1)/432*95));
      await new Promise<void>(resolve=>setTimeout(resolve,0));
    }
    signal.throwIfAborted();await output.finalize();signal.throwIfAborted();
    return new Blob([target.buffer! as BlobPart],{type:'video/mp4'});
  } finally {
    signal.removeEventListener('abort',abort);
    if(output.state!=='finalized'&&output.state!=='canceled')await output.cancel();
  }
}
