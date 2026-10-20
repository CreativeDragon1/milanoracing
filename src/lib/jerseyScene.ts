import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { animate } from 'motion';
import { physics } from '../motion';

import { asset } from '../assets';
import { createKitArtwork, type KitPersonalisation } from './jerseyArtwork';
import { addSleeveDecals } from './jerseyDecals';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
export type JerseyExport = { render:(angle?:number)=>HTMLCanvasElement; dispose:()=>void };
export type JerseyScene = { preset:(side:'front'|'back')=>void; zoom:(step:number)=>void; reset:()=>void; rotate:(x:number,y:number)=>void; spin:(active:boolean)=>void; createExport:(width:number,height:number)=>JerseyExport; personalise:(value:KitPersonalisation)=>void; dispose:()=>void };
export async function createJerseyScene(host:HTMLElement,reduced:boolean,onChange:(angle:number,zoom:number)=>void,preview=false):Promise<JerseyScene>{
  const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'low-power'});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,preview?1.25:1.75));
  renderer.outputColorSpace=THREE.SRGBColorSpace;
  renderer.toneMapping=THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure=.95;
  renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  // Only the camera moves: the garment's shadow need not be rebuilt every frame.
  renderer.shadowMap.autoUpdate=false;renderer.shadowMap.needsUpdate=true;
  renderer.domElement.setAttribute('aria-hidden','true');
  host.appendChild(renderer.domElement);
  const scene=new THREE.Scene();
  const camera=new THREE.PerspectiveCamera(36,1,.1,30);
  let baseDistance=6.1;
  camera.position.set(1.1,.2,baseDistance);
  const controls=new OrbitControls(camera,renderer.domElement);
  controls.enabled=!preview;controls.autoRotateSpeed=2;
  controls.enablePan=false;controls.enableZoom=false;controls.enableDamping=!reduced&&!preview;controls.dampingFactor=.10;
  controls.rotateSpeed=.65;controls.minPolarAngle=.22*Math.PI;controls.maxPolarAngle=.78*Math.PI;
  renderer.domElement.style.touchAction='pan-y';
  controls.target.set(0,-.03,0);controls.update();
  const ambient=new THREE.HemisphereLight(0xf4f6ff,0x555866,.45);scene.add(ambient);
  const light=new THREE.DirectionalLight(0xfffaf3,2.6);light.position.set(-3,5,5);light.castShadow=true;
  light.shadow.mapSize.set(2048,2048);light.shadow.camera.left=-2.2;light.shadow.camera.right=2.2;
  light.shadow.camera.top=2.2;light.shadow.camera.bottom=-2.2;
  light.shadow.camera.near=.5;light.shadow.camera.far=14;
  light.shadow.normalBias=.025;light.shadow.bias=-.0003;light.shadow.radius=3;scene.add(light);
  const fill=new THREE.DirectionalLight(0xe9edff,.35);fill.position.set(4,2,4);scene.add(fill);
  const rim=new THREE.DirectionalLight(0xf5f7ff,1.2);rim.position.set(2,3,-4);scene.add(rim);
  const garment=new THREE.Group();scene.add(garment);
  const ownedTextures:THREE.Texture[]=[];
  // Fine knit relief, independent of the printed artwork. Generated once,
  // sampled by the material, and never animated.
  const weavePixels=new Uint8Array(128*128*4),roughnessPixels=new Uint8Array(128*128*4);
  for(let y=0;y<128;y++)for(let x=0;x<128;x++){
    const i=(y*128+x)*4,a=x*Math.PI/4,b=y*Math.PI/4;
    weavePixels[i]=128+30*Math.cos(a)*Math.sin(b);
    weavePixels[i+1]=128+30*Math.sin(a)*Math.cos(b);
    weavePixels[i+2]=255;weavePixels[i+3]=255;
    const thread=230+16*Math.cos(a)*Math.cos(b);
    roughnessPixels[i]=roughnessPixels[i+1]=roughnessPixels[i+2]=thread;roughnessPixels[i+3]=255;
  }
  const weave=new THREE.DataTexture(weavePixels,128,128);
  weave.wrapS=weave.wrapT=THREE.RepeatWrapping;weave.repeat.set(32,32);
  weave.minFilter=THREE.LinearMipmapLinearFilter;weave.magFilter=THREE.LinearFilter;
  weave.generateMipmaps=true;weave.needsUpdate=true;ownedTextures.push(weave);
  weave.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());
  const clothRoughness=new THREE.DataTexture(roughnessPixels,128,128);
  clothRoughness.wrapS=clothRoughness.wrapT=THREE.RepeatWrapping;clothRoughness.repeat.copy(weave.repeat);
  clothRoughness.minFilter=THREE.LinearMipmapLinearFilter;clothRoughness.magFilter=THREE.LinearFilter;
  clothRoughness.generateMipmaps=true;clothRoughness.anisotropy=weave.anisotropy;clothRoughness.needsUpdate=true;ownedTextures.push(clothRoughness);
  let updateArtwork:((value:KitPersonalisation)=>void)|undefined;
  let disposed=false,observer:ResizeObserver|undefined,animation:ReturnType<typeof animate>|undefined;
  let renderFrame=0, onScreen=true,dampingFrame=0,dragging=false,lastFrame=0;
  const render=()=>{
    if(disposed||renderFrame||!onScreen||document.hidden)return;
    renderFrame=requestAnimationFrame(()=>{renderFrame=0;if(!disposed&&onScreen&&!document.hidden)renderer.render(scene,camera);});
  };
  const visibility=new IntersectionObserver(entries=>{
    onScreen=entries.some(entry=>entry.isIntersecting);
    if(onScreen){render();if(controls.autoRotate&&!dampingFrame)dampingFrame=requestAnimationFrame(tick);}
  });
  visibility.observe(host);
  const show=()=>{if(!document.hidden){render();if(onScreen&&controls.autoRotate&&!dampingFrame)dampingFrame=requestAnimationFrame(tick);}};
  document.addEventListener('visibilitychange',show);
  const updateStatus=()=>{const angle=((Math.atan2(camera.position.x,camera.position.z)*180/Math.PI)%360+360)%360;onChange(Math.round(angle)%360,Math.round(baseDistance/camera.position.distanceTo(controls.target)*100));};
  controls.addEventListener('change',render);controls.addEventListener('end',updateStatus);
  try{
    const [artwork,model]=await Promise.all([createKitArtwork(),new GLTFLoader().loadAsync(asset('milano-garment.glb'))]);
    const {textures,personalise}=artwork;updateArtwork=personalise;
    ownedTextures.push(...textures);
    textures.forEach(texture=>{texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());});
    model.scene.traverse(object=>{
      if(!(object instanceof THREE.Mesh))return;
      const old=object.material as THREE.MeshStandardMaterial;
      if(['Buttons','Collar','Inner buttons','Inner collar'].includes(old.name)){object.visible=false;}
      const collar=old.name==='Collar';
      const fabric=old.name==='Fabric'||old.name==='Hem';
      const material=new THREE.MeshPhysicalMaterial({color:fabric?0xffffff:old.name.startsWith('Inner')?0x858990:0x08090b,roughness:.94,roughnessMap:clothRoughness,metalness:0,side:THREE.DoubleSide,sheen:.12,sheenColor:new THREE.Color(0x606570),sheenRoughness:.85,normalMap:weave,normalScale:new THREE.Vector2(.16,.16)});
      if(fabric){
        material.name="Milano cloth";
        material.onBeforeCompile=shader=>{
          shader.uniforms.kitFront={value:textures[0]};shader.uniforms.kitBack={value:textures[1]};
          shader.vertexShader='varying vec3 kitPosition;\n'+shader.vertexShader;
          shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\n kitPosition=position;');
          shader.fragmentShader='uniform sampler2D kitFront; uniform sampler2D kitBack; varying vec3 kitPosition;\n'+shader.fragmentShader;
          shader.fragmentShader=shader.fragmentShader.replace('#include <map_fragment>',`
            vec2 frontUV=vec2((kitPosition.x+1.7)/3.4,1.0-(1.5-kitPosition.y)/3.05);
            vec2 backUV=vec2((-kitPosition.x+1.7)/3.4,frontUV.y);
            vec4 ink=mix(texture2D(kitBack,backUV),texture2D(kitFront,frontUV),smoothstep(-.09,.09,kitPosition.z));
            diffuseColor*=ink;
            // A single continuous side panel runs around each side of the torso.
            float sideEdge=.625 + .09 * smoothstep(-.2,.38,kitPosition.y);
            if(kitPosition.y < .38 && abs(kitPosition.x) > sideEdge && abs(kitPosition.x) < .89){
              diffuseColor.rgb = kitPosition.y < -1.18 ? vec3(0.0) : vec3(1.0,.1946,0.0);
            }
            float neckEdge = 1.085 + .22 * (1.0 - sqrt(max(0.0, 1.0 - pow(kitPosition.x / .40, 2.0))));
            if(kitPosition.z > .12 && abs(kitPosition.x) < .37 && kitPosition.y > neckEdge && kitPosition.y < neckEdge + .045) diffuseColor.rgb = vec3(0.0,.0097,1.0);
            // Two restrained rows of hem stitching; derivative smoothing avoids shimmer at distance.
            float seamDistance=min(abs(kitPosition.y+1.395),abs(kitPosition.y+1.425));
            float seamAA=max(fwidth(kitPosition.y),.0008);
            float stitchRow=1.0-smoothstep(.001,.001+seamAA,seamDistance);
            float stitchDash=1.0-smoothstep(.006,.009,abs(mod(kitPosition.x+.012,.024)-.012));
            if(abs(kitPosition.x)<.87) diffuseColor.rgb*=1.0-.22*stitchRow*stitchDash;
          `);
        };
        material.customProgramCacheKey=()=>'milano-kit-cloth-v2';
      }
      if(collar){
        material.onBeforeCompile=shader=>{
          shader.vertexShader='varying vec3 collarPosition;\n'+shader.vertexShader;
          shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\n collarPosition=position;');
          shader.fragmentShader='varying vec3 collarPosition;\n'+shader.fragmentShader;
          shader.fragmentShader=shader.fragmentShader.replace('#include <color_fragment>','#include <color_fragment>\n if(collarPosition.z < -.05 && collarPosition.y>1.25) diffuseColor.rgb=vec3(0.0,.01,1.0);');
        };material.customProgramCacheKey=()=>'milano-blue-neck';
      }
      const inner=old.name.startsWith('Inner'),hem=old.name==='Hem';
      old.dispose();object.material=material;object.castShadow=!inner&&!hem;object.receiveShadow=!hem;
    });
    garment.add(model.scene);
    await addSleeveDecals(model.scene,garment);
    // Thin curved binding follows the original crew-neck and black side-collar design.
    const collarPosition:number[]=[],collarColours:number[]=[],collarIndices:number[]=[];
    const collarSteps=96;
    for(let i=0;i<=collarSteps;i++){
      const theta=i/collarSteps*Math.PI*2,front=Math.max(0,Math.cos(theta));
      for(let j=0;j<=4;j++){
        const t=j/4,rx=.345+t*.055,rz=.26+t*.05;
        collarPosition.push(Math.sin(theta)*rx,1.34-.22*front-t*.035,.015+Math.cos(theta)*rz);
        const c=new THREE.Color(Math.cos(theta)>.55?0x0019ff:0x000000);
        collarColours.push(c.r,c.g,c.b);
      }
      if(i<collarSteps)for(let j=0;j<4;j++){const a=i*5+j,b=a+5;collarIndices.push(a,b,a+1,b,b+1,a+1);}
    }
    const binding=new THREE.BufferGeometry();binding.setAttribute('position',new THREE.Float32BufferAttribute(collarPosition,3));binding.setAttribute('color',new THREE.Float32BufferAttribute(collarColours,3));binding.setIndex(collarIndices);binding.computeVertexNormals();
    const neckBinding=new THREE.Mesh(binding,new THREE.MeshPhysicalMaterial({vertexColors:true,roughness:.92,sheen:.15,sheenRoughness:.9,side:THREE.DoubleSide}));
    neckBinding.castShadow=false;neckBinding.receiveShadow=true;garment.add(neckBinding);

    const shadowCanvas=document.createElement('canvas');shadowCanvas.width=128;shadowCanvas.height=128;const shadowCtx=shadowCanvas.getContext('2d')!;const gradient=shadowCtx.createRadialGradient(64,64,0,64,64,64);gradient.addColorStop(0,'rgba(30,30,22,.18)');gradient.addColorStop(1,'rgba(30,30,22,0)');shadowCtx.fillStyle=gradient;shadowCtx.fillRect(0,0,128,128);const shadowMap=new THREE.CanvasTexture(shadowCanvas);const ground=new THREE.Mesh(new THREE.PlaneGeometry(3,1.3),new THREE.MeshBasicMaterial({map:shadowMap,transparent:true,depthWrite:false}));ground.rotation.x=-Math.PI/2;ground.position.y=-1.64;scene.add(ground);
    observer=new ResizeObserver(()=>{const {width,height}=host.getBoundingClientRect();if(!width||!height)return;renderer.setSize(width,height,false);camera.aspect=width/height;const nextDistance=Math.max(6.1,5.4/camera.aspect);camera.position.sub(controls.target).multiplyScalar(nextDistance/baseDistance).add(controls.target);baseDistance=nextDistance;camera.updateProjectionMatrix();controls.update();updateStatus();render();});observer.observe(host);
    updateStatus();render();
  }catch(error){disposed=true;cancelAnimationFrame(renderFrame);visibility.disconnect();document.removeEventListener('visibilitychange',show);controls.dispose();renderer.dispose();renderer.domElement.remove();throw error;}
  function move(angle:number,distance:number,polar=camera.position.clone().sub(controls.target).angleTo(new THREE.Vector3(0,1,0))){
    animation?.stop();const from=camera.position.clone();
    const target=new THREE.Vector3(Math.sin(angle)*Math.sin(polar)*distance,Math.cos(polar)*distance,Math.cos(angle)*Math.sin(polar)*distance).add(controls.target);
    const startTheta=Math.atan2(from.x,from.z);let delta=angle-startTheta;while(delta>Math.PI)delta-=Math.PI*2;while(delta<-Math.PI)delta+=Math.PI*2;
    const fromDist=from.distanceTo(controls.target),fromPolar=from.clone().sub(controls.target).angleTo(new THREE.Vector3(0,1,0));
    animation=animate(0,1,{...(reduced?{duration:0}:physics.gentle),onUpdate:p=>{const a=startTheta+delta*p,d=THREE.MathUtils.lerp(fromDist,distance,p),phi=THREE.MathUtils.lerp(fromPolar,polar,p);camera.position.set(Math.sin(a)*Math.sin(phi)*d,Math.cos(phi)*d,Math.cos(a)*Math.sin(phi)*d).add(controls.target);controls.update();render();},onComplete:updateStatus});
    void target;
  }
  const tick=(time:number)=>{dampingFrame=0;if(disposed||!onScreen||document.hidden){lastFrame=0;return;}const dt=lastFrame?Math.min((time-lastFrame)/1000,.05):1/60;lastFrame=time;const changed=controls.update(dt);render();if(controls.autoRotate)updateStatus();if(dragging||changed||controls.autoRotate)dampingFrame=requestAnimationFrame(tick);else {lastFrame=0;updateStatus();}};
  const cancel=()=>{animation?.stop();dragging=true;if(!dampingFrame)dampingFrame=requestAnimationFrame(tick);};
  controls.addEventListener('start',cancel);controls.addEventListener('end',()=>{dragging=false;});
  return {
    spin:active=>{
      const spinning=active&&!reduced;
      if(controls.autoRotate===spinning)return;
      controls.autoRotate=spinning;
      if(spinning){animation?.stop();lastFrame=0;if(!dampingFrame)dampingFrame=requestAnimationFrame(tick);}
      else {cancelAnimationFrame(dampingFrame);dampingFrame=0;lastFrame=0;move(.18,baseDistance,Math.PI/2-.035);}
    },
    personalise:value=>{updateArtwork?.(value);render();},
    preset:side=>move(side==='front'?0:Math.PI,camera.position.distanceTo(controls.target),Math.PI/2),
    zoom:step=>move(Math.atan2(camera.position.x,camera.position.z),THREE.MathUtils.clamp(camera.position.distanceTo(controls.target)-step*baseDistance*.105,baseDistance*.62,baseDistance*1.2)),
    reset:()=>move(.18,baseDistance,Math.PI/2-.035),
    rotate:(x,y)=>{const polar=camera.position.clone().sub(controls.target).angleTo(new THREE.Vector3(0,1,0));move(Math.atan2(camera.position.x,camera.position.z)+x,camera.position.distanceTo(controls.target),THREE.MathUtils.clamp(polar+y,.22*Math.PI,.78*Math.PI));},
    createExport:(width,height)=>{
      const output=new THREE.WebGLRenderer({antialias:true,alpha:true,preserveDrawingBuffer:true});
      output.setPixelRatio(1);output.setSize(width,height,false);
      output.outputColorSpace=renderer.outputColorSpace;output.toneMapping=renderer.toneMapping;output.toneMappingExposure=renderer.toneMappingExposure;
      output.shadowMap.enabled=true;output.shadowMap.type=renderer.shadowMap.type;
      output.shadowMap.autoUpdate=false;output.shadowMap.needsUpdate=true;
      const lens=camera.clone();lens.aspect=width/height;lens.updateProjectionMatrix();
      const start=Math.atan2(camera.position.x,camera.position.z);
      return {render:(angle=start)=>{
        if(disposed)throw new Error('Viewer closed');
        lens.position.set(Math.sin(angle)*6.1,.08,Math.cos(angle)*6.1);lens.lookAt(0,-.03,0);
        output.render(scene,lens);return output.domElement;
      },dispose:()=>{output.dispose();output.forceContextLoss();}};
    },
    dispose:()=>{disposed=true;cancelAnimationFrame(renderFrame);visibility.disconnect();document.removeEventListener('visibilitychange',show);cancelAnimationFrame(dampingFrame);animation?.stop();observer?.disconnect();controls.dispose();scene.traverse(object=>{if(object instanceof THREE.Mesh){object.geometry.dispose();const mats=Array.isArray(object.material)?object.material:[object.material];mats.forEach(material=>{if('map' in material)(material.map as THREE.Texture|null)?.dispose();material.dispose();});}});ownedTextures.forEach(texture=>texture.dispose());light.shadow.dispose();renderer.dispose();renderer.domElement.remove();},
  };
}
