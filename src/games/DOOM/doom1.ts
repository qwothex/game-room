import * as THREE from 'three';
import { GameModule } from '../../types/games.js';
import { camera, doomHeight, doomRenderTarget, doomWidth, scene, setupMouseInput } from './utils.js';
import createDoom from './doom.js'
import { renderer } from '../../utils/renderer.js';

export type WADType = 'doom1.wad' | 'freedoom1.wad' | 'freedoom2.wad'

let Module: any;

export async function startDoom(WAD: WADType) {

  if (Module) {
    try {
      DoomModule.update = undefined
      await Module._doom_destroy();
    } catch (e) {
      console.error(e)
    }
    Module = null;
    console.log("MODULE RESET, VALUE: ", Module)
  }

  Module = await createDoom();

  if(Module){
    console.log("MODULE, VALUE: ", Module)
    const wadResponse = await fetch(WAD);
    const wadBuffer = await wadResponse.arrayBuffer();
    Module.FS.writeFile(WAD, new Uint8Array(wadBuffer));
    setupMouseInput(renderer.domElement, Module);

    try{
      Module._main(1, [WAD]);
    }catch(e){
      console.error(e)
    }

    const framebufferPtr = Module._doom_get_framebuffer();
    const framebufferHeap = new Uint8Array(Module.HEAPU8.buffer, framebufferPtr, doomWidth * doomHeight * 4);

    const doomTexture = new THREE.DataTexture(framebufferHeap, doomWidth, doomHeight);
    doomTexture.type = THREE.UnsignedByteType;
    doomTexture.magFilter = THREE.NearestFilter;
    doomTexture.minFilter = THREE.NearestFilter;
    doomTexture.generateMipmaps = false;

    doomTexture.needsUpdate = true;
    doomTexture.flipY = true

    const material = new THREE.MeshBasicMaterial({ map: doomTexture });
    const planeWidth = 3.15;
    const planeHeight = 1.4;
    const geometry = new THREE.PlaneGeometry(planeWidth, planeHeight);

    const plane = new THREE.Mesh(geometry, material);

    scene.add(plane);

    function updateDoom(_delta?: number) {

      const ptr = Module._doom_get_framebuffer();
      if(!ptr) return;

      const src = new Uint32Array(
        Module.HEAPU8.buffer,
        ptr,
        doomWidth * doomHeight
      );

      for (let i = 0; i < doomWidth * doomHeight; i++) {
        const c = src[i];
        const j = i * 4;
        framebufferHeap[j + 0] = (c >> 16) & 0xff;
        framebufferHeap[j + 1] = (c >> 8) & 0xff;
        framebufferHeap[j + 2] = c & 0xff;
        framebufferHeap[j + 3] = 255;
      }
      
      doomTexture.needsUpdate = true;
    }

    DoomModule.update = updateDoom;

    // doomStarted = 1
  }else{
    console.log("NO MODULE")
  }

}

export function getModule() {
  if (!Module) {
    throw new Error('Module not ready yet');
  }
  return Module;
}

export const DoomModule: GameModule = {
    camera: camera,
    renderTarget: doomRenderTarget,
    scene: scene,
    update: undefined as any
}