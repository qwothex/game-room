import * as THREE from "three";
import { tileSize, tilesPerRow } from "../../../constants/CTR";

let roadTexture: THREE.Texture | null = null;

function getRoadTexture() {
  if (roadTexture) return roadTexture;

  roadTexture = new THREE.TextureLoader().load("/images/road.jpg");
  roadTexture.repeat.set(tilesPerRow, 1);
  roadTexture.wrapS = roadTexture.wrapT = THREE.RepeatWrapping;
  // roadTexture.rotation = 0.2

  return roadTexture;
}

export const Road = (rowIndex: number) => {
  const road = new THREE.Group();
  road.position.y = rowIndex * tileSize;

  const foundation = new THREE.Mesh(
    new THREE.PlaneGeometry(tilesPerRow * tileSize, tileSize),
    new THREE.MeshLambertMaterial({ map: getRoadTexture() })
  );

  foundation.receiveShadow = true;

  road.add(foundation);

  return road;
}