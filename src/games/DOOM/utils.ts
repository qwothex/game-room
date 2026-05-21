import * as THREE from 'three'
import { renderer } from '../../utils/renderer';

export const doomRenderTarget = new THREE.WebGLRenderTarget(1024, 1024)

export const doomWidth = 640;
export const doomHeight = 400;

export const scene = new THREE.Scene();
  const aspect = doomWidth / doomHeight;
  const orthoHeight = 2;
  const orthoWidth = orthoHeight * aspect;
export const camera = new THREE.OrthographicCamera(
    -orthoWidth / 2, orthoWidth / 2,
    orthoHeight / 2, -orthoHeight / 2,
    0.1, 10
  );
  camera.position.z = 4;

const KEY_RIGHTARROW = 0xae;
const KEY_LEFTARROW = 0xac;
const KEY_UPARROW = 0xad;
const KEY_DOWNARROW = 0xaf;
const KEY_STRAFE_L = 0xa0;
const KEY_STRAFE_R = 0xa1;
const KEY_USE = 0xa2
const KEY_FIRE = 0xa3
const KEY_ESCAPE = 27
const KEY_ENTER = 13
const KEY_TAB = 9
const KEY_F1 = (0x80+0x3b)
const KEY_F2 = (0x80+0x3c)
const KEY_F3 = (0x80+0x3d)
const KEY_F4 = (0x80+0x3e)
const KEY_F5 = (0x80+0x3f)
const KEY_F6 = (0x80+0x40)
const KEY_F7 = (0x80+0x41)
const KEY_F8 = (0x80+0x42)
const KEY_F9 = (0x80+0x43)
const KEY_F10 = (0x80+0x44)
const KEY_F11 = (0x80+0x57)
const KEY_F12 = (0x80+0x58)
// const KEY_FIRE = 0xa3;
// const KEY_USE = 0x20;
// const KEY_ESCAPE = 0x1b;
// const KEY_ENTER = 0x0d;
// const KEY_RSHIFT = 0x36;
// const KEY_LALT = 0x38;
const KEY_BACKSPACE = 0x7f
const KEY_PAUSE = 0xff
const KEY_EQUALS = 0x3d
const KEY_MINUS = 0x2d
const KEY_RSHIFT = (0x80+0x36)
const KEY_RCTRL = (0x80+0x1d)
const KEY_RALT = (0x80+0x38)
const KEY_LALT = KEY_RALT

export const keyMap: { [key: string]: number } = {
  'ArrowUp': KEY_UPARROW,
  'w': 'w'.charCodeAt(0),
  'ArrowDown': KEY_DOWNARROW,
  's': 's'.charCodeAt(0),
  'ArrowLeft': KEY_LEFTARROW,
  'a': 'a'.charCodeAt(0),
  'ArrowRight': KEY_RIGHTARROW,
  'd': 'd'.charCodeAt(0),
  'Control': KEY_FIRE,
  ' ': KEY_USE,
  'Escape': KEY_ESCAPE,
  'Enter': KEY_ENTER,
  'Shift': KEY_RSHIFT,
  'Alt': KEY_LALT,
  'y': 'y'.charCodeAt(0),
  'n': 'n'.charCodeAt(0),
  '1': '1'.charCodeAt(0),
  '2': '2'.charCodeAt(0),
  '3': '3'.charCodeAt(0),
  '4': '4'.charCodeAt(0),
  '5': '5'.charCodeAt(0),
};

export function requestPointerLock() {
  renderer.domElement.requestPointerLock();
}

export function releasePointerLock(_canvas: HTMLCanvasElement) {
  if (document.pointerLockElement) {
    document.exitPointerLock();
  }
}

export function setupMouseInput(canvas: HTMLCanvasElement, Module: any) {

  // Mouse movement (when pointer is locked)
  document.addEventListener('mousemove', (e) => {
    if (document.pointerLockElement === canvas) {
      // movementX/Y gives relative movement
      const deltaX = e.movementX;
      // const deltaY = e.movementY;
      
      // Doom uses X for turning, Y for forward/back (optional)
      if (Module._doom_mouse_move) {
        Module._doom_mouse_move(deltaX, 0);
      }
    }
  });

  // Mouse buttons
  canvas.addEventListener('mousedown', (e) => {
    if (Module._doom_mouse_button) {
      Module._doom_mouse_button(e.button, 1);
    }
    e.preventDefault();
  });

  canvas.addEventListener('mouseup', (e) => {
    if (Module._doom_mouse_button) {
      Module._doom_mouse_button(e.button, 0);
    }
    e.preventDefault();
  });
}