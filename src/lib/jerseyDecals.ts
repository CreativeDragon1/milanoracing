import * as THREE from 'three';
import { DecalGeometry } from 'three/addons/geometries/DecalGeometry.js';
import { asset } from '../assets';

/** Small, surface-normal decals preserve the marks' proportions around the sleeve. */
export async function addSleeveDecals(model:THREE.Object3D, parent:THREE.Group){
  model.updateMatrixWorld(true);
  const meshes:THREE.Mesh[]=[];
  model.traverse(o=>{if(o instanceof THREE.Mesh && o.visible && o.material.name==='Milano cloth')meshes.push(o);});
  const definitions=[
    {file:'brindas.png',crop:[35,85,340,130],x:1.08,y:.77,width:.30},
    {file:'enermax.png',crop:[35,35,335,220],x:1.16,y:.51,width:.33},
    {file:'npe.png',crop:[36,140,375,170],x:-1.08,y:.77,width:.32},
    {file:'axis.png',crop:[105,90,290,405],x:-1.17,y:.49,width:.19},
  ];
  await Promise.all(definitions.map(async d=>{
    const image=new Image();image.src=asset(d.file);await image.decode();
    const [sx,sy,sw,sh]=d.crop;
    const canvas=document.createElement('canvas');canvas.width=sw;canvas.height=sh;
    canvas.getContext('2d')!.drawImage(image,sx,sy,sw,sh,0,0,sw,sh);
    const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=8;
    // Cast from behind the garment onto the actual sleeve, then project along its normal.
    const ray=new THREE.Raycaster(new THREE.Vector3(d.x,d.y,-3),new THREE.Vector3(0,0,1));
    const hit=ray.intersectObjects(meshes,false)[0];
    if(!hit?.face){texture.dispose();throw new Error(`Sleeve placement unavailable: ${d.file}`);}
    const normal=hit.face.normal.clone().transformDirection(hit.object.matrixWorld);
    if(normal.z>0)normal.negate();
    const orientation=new THREE.Euler().setFromQuaternion(new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().lookAt(hit.point.clone().add(normal),hit.point,new THREE.Vector3(0,1,0))));
    const geometry=new DecalGeometry(hit.object as THREE.Mesh,hit.point,orientation,new THREE.Vector3(d.width,d.width*sh/sw,.23));
    const material=new THREE.MeshStandardMaterial({map:texture,transparent:true,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-4,roughness:1,metalness:0,side:THREE.FrontSide});
    const decal=new THREE.Mesh(geometry,material);decal.renderOrder=2;parent.add(decal);
  }));
}
