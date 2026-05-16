import * as THREE from "three";

function ShadowLight() {
  const light = new THREE.DirectionalLight();
  light.position.set(-100, -100, 200);
  light.up.set(0, 0, 1);
  light.castShadow = true;

  light.shadow.mapSize.width = 2048;
  light.shadow.mapSize.height = 2048;

  light.shadow.camera.up.set(0, 0, 1);
  light.shadow.camera.left = -400;
  light.shadow.camera.right = 400;
  light.shadow.camera.top = 400;
  light.shadow.camera.bottom = -400;
  light.shadow.camera.near = 50;
  light.shadow.camera.far = 400;

  return light;
}

export const SLight = ShadowLight()