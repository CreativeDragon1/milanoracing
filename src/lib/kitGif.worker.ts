import { GIFEncoder, quantize, applyPalette } from 'gifenc';
const gif=GIFEncoder();
self.onmessage=(event:MessageEvent)=>{
  try {
    if(event.data.finish){gif.finish();const bytes=gif.bytes();self.postMessage({bytes}, {transfer:[bytes.buffer]});return;}
    const {rgba,width,height,delay}=event.data;
    const palette=quantize(rgba,256,{format:'rgb565'});
    gif.writeFrame(applyPalette(rgba,palette,'rgb565'),width,height,{palette,delay,repeat:0});
    self.postMessage({ready:true});
  }catch(error){self.postMessage({error:error instanceof Error?error.message:'GIF encoding failed'});}
};
