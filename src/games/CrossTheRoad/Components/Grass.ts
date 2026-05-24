import * as THREE from "three";
import { tilesPerRow, tileSize } from "../../../constants/CTR";

let grassTexture: THREE.Texture | null = null;

function getGrassTexture() {
  if (grassTexture) return grassTexture;

  grassTexture = new THREE.TextureLoader().load("/images/grass.jpg");
  grassTexture.repeat.set(tilesPerRow, 1);
  grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping;

  return grassTexture;
}

export const Grass = (rowIndex: number) => {
  const grass = new THREE.Group();
  grass.position.y = rowIndex * tileSize;

  const foundation = new THREE.Mesh(
    new THREE.PlaneGeometry(tilesPerRow * tileSize, tileSize),
    new THREE.MeshLambertMaterial({
      map: getGrassTexture(),
    })
  );

  foundation.receiveShadow = true;

  grass.add(foundation);
  return grass;
};