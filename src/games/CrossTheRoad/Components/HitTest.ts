import * as THREE from "three";
import { character, position } from "./Character";
import { metadata } from "./Map";
import { handleHit } from "../utils";

export function hitTest() {
  const row = metadata[position.currentRow - 1];
  if (!row) return;

  if (row.type === "car" || row.type === "truck") {
    const playerBoundingBox = new THREE.Box3();
    playerBoundingBox.setFromObject(character.character.children[0]);

    row.vehicles.forEach(({ ref }) => {
      if (!ref) throw Error("Vehicle reference is missing");

      const vehicleBoundingBox = new THREE.Box3();
      vehicleBoundingBox.setFromObject(ref);

      if (playerBoundingBox.intersectsBox(vehicleBoundingBox)) {
        handleHit(row.direction)
      }
    });
  }
}