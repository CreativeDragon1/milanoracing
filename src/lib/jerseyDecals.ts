import * as THREE from 'three';
import { DecalGeometry } from 'three/addons/geometries/DecalGeometry.js';
import { asset } from '../assets';

/** Small, surface-normal decals preserve the marks' proportions around the sleeve. */
export async function addSleeveDecals(model:THREE.Object3D, parent:THREE.Group){
  model.updateMatrixWorld(true);
  const meshes:THREE.Mesh[]=[];
  model.traverse(o=>{if(o instanceof THREE.Mesh && o.visible && o.material.name==='Milano cloth')meshes.push(o);});
  const definitions=[
    {file:'brindas.png',crop:[35,85,340,130],side:1,y:.90,width:.32},
    {file:'enermax.png',crop:[35,35,335,220],side:1,y:.65,width:.31},
    {file:'npe.png',crop:[36,140,375,170],side:-1,y:.90,width:.32},
    {file:'axis.png',crop:[105,90,290,405],side:-1,y:.65,width:.18},
  ];
  await Promise.all(definitions.map(async d=>{
    const image=new Image();image.src=asset(d.file);await image.decode();
    const [sx,sy,sw,sh]=d.crop;
    const canvas=document.createElement('canvas');canvas.width=sw;canvas.height=sh;
    canvas.getContext('2d')!.drawImage(image,sx,sy,sw,sh,0,0,sw,sh);
    const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=8;
    // Marks face outwards from the upper arm, as on a worn jersey.
    // Project from each side, never from the back of the garment.
    const ray=new THREE.Raycaster(new THREE.Vector3(d.side*3,d.y,.015),new THREE.Vector3(-d.side,0,0));
    const hit=ray.intersectObjects(meshes,false)[0];
    if(!hit?.face){texture.dispose();throw new Error(`Sleeve placement unavailable: ${d.file}`);}
    const normal=hit.face.normal.clone().transformDirection(hit.object.matrixWorld);
    if(normal.x*d.side<0)normal.negate();
    const orientation=new THREE.Euler().setFromQuaternion(new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().lookAt(hit.point.clone().add(normal),hit.point,new THREE.Vector3(0,1,0))));
    const geometry=new DecalGeometry(hit.object as THREE.Mesh,hit.point,orientation,new THREE.Vector3(d.width,d.width*sh/sw,.23));
    const material=new THREE.MeshStandardMaterial({map:texture,transparent:true,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-4,roughness:1,metalness:0,side:THREE.FrontSide});
    const decal=new THREE.Mesh(geometry,material);decal.renderOrder=2;parent.add(decal);
  }));
}
