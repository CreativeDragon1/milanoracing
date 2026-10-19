import * as THREE from 'three';
import { asset } from '../assets';
export type KitPersonalisation = { name: string; number: string };
async function load(name: string) {
  const image = new Image(); image.src = asset(name); await image.decode(); return image;
}

/** The textile is extracted unaltered from page 9 of the team's shirt specification. */
export async function createKitArtwork() {
  const [dragon, mr, hive, stem] = await Promise.all([
    'kit-dragon-original.png', 'milano-official.png', 'hustle-hive.png', 'stem-racing.png',
  ].map(load));
  await Promise.all([document.fonts.load('24px Michroma'), document.fonts.load('italic 500 100px "Kit Numbers"')]);
  const canvases = [false, true].map(back => {
    const canvas = document.createElement('canvas'); canvas.width = 1536; canvas.height = 1536;
    const ctx = canvas.getContext('2d')!;
    const k = 1536 / 3.4, x = (v: number) => (v + 1.7) * k, y = (v: number) => (1.5 - v) / 3.05 * 1536;
    ctx.fillStyle = '#FFFFFF'; ctx.fillRect(0, 0, 1536, 1536);
    // The original illustration is clipped to the torso's raglan panel.
    ctx.save(); ctx.beginPath();ctx.moveTo(x(-.34),y(1.4));ctx.lineTo(x(.34),y(1.4));
    ctx.bezierCurveTo(x(.54),y(1.21),x(.65),y(.78),x(.89),y(.42));
    ctx.lineTo(x(.85),y(-1.55));ctx.lineTo(x(-.85),y(-1.55));ctx.lineTo(x(-.89),y(.42));
    ctx.bezierCurveTo(x(-.65),y(.78),x(-.54),y(1.21),x(-.34),y(1.4));ctx.clip();
    ctx.drawImage(dragon,x(-.85),y(1.4),1.7*k,y(-1.55)-y(1.4));ctx.restore();
    const path=(points:[number,number][],color:string)=>{ctx.beginPath();points.forEach(([a,b],i)=>i?ctx.lineTo(x(a),y(b)):ctx.moveTo(x(a),y(b)));ctx.closePath();ctx.fillStyle=color;ctx.fill();};
    for(const sign of [-1,1]) {
      ctx.beginPath();ctx.moveTo(x(sign*.34),y(1.34));ctx.bezierCurveTo(x(sign*.54),y(1.21),x(sign*.65),y(.78),x(sign*.89),y(.42));ctx.lineWidth=5;ctx.strokeStyle='#0019FF';ctx.stroke();
      path([[sign*.99,.08],[sign*1.72,.595],[sign*1.72,-.2],[sign*.99,-.2]],'#000000');
      ctx.strokeStyle='#0019FF';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(x(sign*1.05),y(.025));ctx.lineTo(x(sign*1.72),y(.498));ctx.stroke();
    }
    const logo=(image:HTMLImageElement,sx:number,sy:number,sw:number,sh:number,cx:number,cy:number,w:number,h:number,angle=0)=>{ctx.save();ctx.translate(x(cx),y(cy));ctx.rotate(angle);ctx.globalCompositeOperation='multiply';ctx.drawImage(image,sx,sy,sw,sh,-w*k/2,-h*k/2,w*k,h*k);ctx.restore();};
    if(back){
      logo(stem,10,10,330,155,0,1.03,.34,.16);
    }else{
      logo(hive,93,109,410,183,-.36,.66,.43,.19);
      logo(mr,60,240,510,180,.37,.66,.44,.155);
      ctx.fillStyle='#000000';ctx.textAlign='center';ctx.textBaseline='middle';ctx.font='400 46px Michroma';ctx.fillText('MILANO RACING',x(0),y(.28),1.42*k);
    }
    return canvas;
  });
  const backBase=document.createElement('canvas');backBase.width=1536;backBase.height=1536;
  backBase.getContext('2d')!.drawImage(canvases[1],0,0);
  const textures=canvases.map(canvas=>{const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;return texture;});
  function personalise({name,number}:KitPersonalisation){
    const ctx=canvases[1].getContext('2d')!;ctx.clearRect(0,0,1536,1536);ctx.drawImage(backBase,0,0);
    ctx.fillStyle='#000000';ctx.textAlign='center';ctx.textBaseline='middle';
    if(number){ctx.font='italic 500 420px "Kit Numbers", Georgia, serif';ctx.fillText(number,768,570,570);}
    if(name){ctx.font='700 57px "DM Sans", sans-serif';ctx.fillText(name.toUpperCase(),768,875,590);}
    textures[1].needsUpdate=true;
  }
  return {textures,personalise};
}
