import * as THREE from "three";
import { Direction } from "../../../types/CTRGameTypes";
import gsap from "gsap";
import { maxTileIndex, minTileIndex, tileSize } from "../../../constants/CTR";
import { addRows, metadata } from "./Map";
import { camera } from "./Camera";
import { SLight } from "./ShadowLight";
import { initializeGame, updateScore } from "../utils";

let animPlaying = false

export function cancelCharacterTweens() {
  gsap.killTweensOf(character.character.position)
  gsap.killTweensOf(character.character.children[0].position)
  gsap.killTweensOf(character.character.children[0])
  animPlaying = false
}

export const restartGame = () => {
  initializeGame()
  animPlaying = true
  gsap.delayedCall(0.35, () => {
    animPlaying = false
  })
}

function Character() {

  const characterRoot = new THREE.Group();

  const characterMesh = new THREE.Group();
  characterRoot.add(characterMesh)

  const body = new THREE.Mesh(
    new THREE.BoxGeometry(15, 15, 20),
    new THREE.MeshLambertMaterial({
      color: "white",
      flatShading: true,
    })
  );
  body.position.z = 10;
  body.castShadow = true;
  body.receiveShadow = true;
  characterMesh.add(body);

  const cap = new THREE.Mesh(
    new THREE.BoxGeometry(2, 4, 2),
    new THREE.MeshLambertMaterial({
      color: 0xf0619a,
      flatShading: true,
    })
  );
  cap.position.z = 21;
  cap.castShadow = true;
  cap.receiveShadow = true;
  characterMesh.add(cap);

  const target = new THREE.Object3D();
  target.position.set(0, 0, 0);

  characterMesh.add(target);
  SLight.target = target;

  characterRoot.add(camera);
  characterRoot.add(SLight);
  characterRoot.add(SLight.target);
    
  return {character: characterRoot, isDead: false, farest: 0}
}

export const character = Character()

export const position: {
  currentRow: number;
  currentTile: number;
} = {
  currentRow: 0,
  currentTile: 0,
};

export function step(direction: Direction) {

  if(!character.isDead){
      animPlaying = true

    if (position.currentRow > metadata.length - 10) addRows();

    if (direction === "forward") {

      position.currentRow += 1

      if(position.currentRow > character.farest){
        character.farest = position.currentRow
        updateScore(1)
      }
      gsap.timeline().to(character.character.position, {
          y: `+=${tileSize / 2}`,
          ease: 'none',
          duration: 0.125,
        })
        .to(character.character.children[0].position, {
          z: `+=15`,
          ease: 'none',
          duration: 0.125,
        }, '<')
        .to(character.character.position, {
          y: `+=${tileSize / 2}`,
          ease: 'power1.out',
          duration: 0.125,
        }, '>')
        .to(character.character.children[0].position, {
          z: 0,
          ease: 'power1.out',
          duration: 0.125,
          onComplete: () => {animPlaying = false}
        }, '<')
    };

    if (direction === "backward") {
      position.currentRow -= 1

     gsap.timeline().to(character.character.position, {
          y: `-=${tileSize / 2}`,
          ease: 'none',
          duration: 0.125,
        })
        .to(character.character.children[0].position, {
          z: `+=15`,
          ease: 'none',
          duration: 0.125,
        }, '<')
        .to(character.character.position, {
          y: `-=${tileSize / 2}`,
          ease: 'power1.out',
          duration: 0.125,
        }, '>')
        .to(character.character.children[0].position, {
          z: 0,
          ease: 'power1.out',
          duration: 0.125,
          onComplete: () => {animPlaying = false}
        }, '<')
    };

    if (direction === "left") {
      position.currentTile -= 1
      gsap.timeline().to(character.character.position, {
          x: `-=${tileSize / 2}`,
          ease: 'none',
          duration: 0.125,
        })
        .to(character.character.children[0].position, {
          z: `+=15`,
          ease: 'none',
          duration: 0.125,
        }, '<')
        .to(character.character.position, {
          x: `-=${tileSize / 2}`,
          ease: 'power1.out',
          duration: 0.125,
        }, '>')
        .to(character.character.children[0].position, {
          z: 0,
          ease: 'power1.out',
          duration: 0.125,
          onComplete: () => {animPlaying = false}
        }, '<')
    };

    if (direction === "right") {
      position.currentTile += 1
      gsap.timeline().to(character.character.position, {
          x: `+=${tileSize}`,
          ease: 'none',
          duration: 0.250,
        })
        .to(character.character.children[0].position, {
          z: `+=15`,
          ease: 'none',
          duration: 0.125,
        }, '<')
        .to(character.character.children[0].position, {
          z: 0,
          ease: 'power1.out',
          duration: 0.125,
          onComplete: () => {animPlaying = false}
        }, '>')
    };
  }
}

export const initializePlayer = () => {
  cancelCharacterTweens()

  character.character.position.x = 0;
  character.character.position.y = 0;
  character.character.children[0].position.z = 0;
  character.character.children[0].rotation.y = 0;

  character.isDead = false

  position.currentRow = 0;
  position.currentTile = 0;
}

export function calculateFinalPosition(direction: Direction) {

  if (direction === "forward")
    return {
      currentRow: position.currentRow + 1,
      currentTile: position.currentTile,
    };

  if (direction === "backward")
    return {
      currentRow: position.currentRow - 1,
      currentTile: position.currentTile,
    };

  if (direction === "left")
    return {
      currentRow: position.currentRow,
      currentTile: position.currentTile - 1,
    };

  if (direction === "right")
    return {
      currentRow: position.currentRow,
      currentTile: position.currentTile + 1,
    };
  return position;
}

export function endsUpInValidPosition(
  direction: Direction
) {
  const finalPosition = calculateFinalPosition(
    direction
  );

  if (
    finalPosition.currentRow === -4 ||
    finalPosition.currentTile === minTileIndex - 1 ||
    finalPosition.currentTile === maxTileIndex + 1
  ) {
    return false;
  }

  const finalRow = metadata[finalPosition.currentRow - 1];
  if (
    finalRow &&
    finalRow.type === "forest" &&
    finalRow.trees.some(
      (tree) => tree.tileIndex === finalPosition.currentTile
    )
  ) {
    return false;
  }

  return true;
}

const tryRestart = () => {
  if (!character.isDead) return false
  restartGame()
  return true
}

export const crossRightButtonClicked = () => {
  if (tryRestart()) return
  if (!animPlaying && endsUpInValidPosition('right')) step('right')
}

export const crossLeftButtonClicked = () => {
  if (tryRestart()) return
  if (!animPlaying && endsUpInValidPosition('left')) step('left')
}

export const crossUpButtonClicked = () => {
  if (tryRestart()) return
  if (!animPlaying && endsUpInValidPosition('forward')) step('forward')
}

export const crossDownButtonClicked = () => {
  if (tryRestart()) return
  if (!animPlaying && endsUpInValidPosition('backward')) step('backward')
}