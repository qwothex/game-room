import * as THREE from 'three'
import { GameModule } from '../../types/games';
import { crossRenderTarget } from './Components/RenderTarget';
import { initializeMap, metadata } from './Components/Map';
import { minTileIndex, tileSize, maxTileIndex } from '../../constants/CTR';
import { Row, RowType } from '../../types/CTRGameTypes';
import { camera } from './Components/Camera';
import { cancelCharacterTweens, character, initializePlayer } from './Components/Character';
import { hitTest } from './Components/HitTest';

export const scene = new THREE.Scene();
    const screenSceneBg = new THREE.Color(0xf3f3f3);
    scene.background = screenSceneBg;

// const grid = new THREE.GridHelper(42 * 17, 17);
// grid.rotation.x = Math.PI / 2;
// scene.add(grid);

// scene.add(grid)

let score = 0;

const scoreCanvas = document.createElement('canvas');
    scoreCanvas.width = 256;
    scoreCanvas.height = 64;

const scoreCtx = scoreCanvas.getContext('2d')!;
  scoreCtx.textAlign = 'center';
  scoreCtx.textBaseline = 'middle';

const font = new FontFace('Donkey-kong', 'url(/donkey-kong.ttf)')

font.load().then((loadedFont) => {
    document.fonts.add(loadedFont)

    scoreCtx.font = '18px Donkey-kong';
    scoreCtx.fillStyle = 'white'
    scoreCtx.fillText('Score: 0', scoreCanvas.width / 2, scoreCanvas.height / 2);

    scoreTexture.needsUpdate = true
})

const scoreTexture = new THREE.CanvasTexture(scoreCanvas);

const hudPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(200, 50),
    new THREE.MeshBasicMaterial({ map: scoreTexture, transparent: true })
);

hudPlane.position.set(0, 75, -150);

camera.add(hudPlane)

export const updateScore = (newScore: number) => {
    newScore === -1 ? score = 0 : score += newScore
    scoreCtx.clearRect(0, 0, scoreCanvas.width, scoreCanvas.height)
    scoreCtx.fillText(`Score: ${score}`, scoreCanvas.width / 2, scoreCanvas.height / 2)
    scoreTexture.needsUpdate = true
}

export function generateRows(amount: number): Row[] {
  const rows: Row[] = [];
  for (let i = 0; i < amount; i++) {
    const rowData = generateRow();
    rows.push(rowData);
  }
  return rows;
}

function generateForesMetadata(): Row {
  const occupiedTiles = new Set<number>();
  const trees = Array.from({ length: 4 }, () => {
    let tileIndex;
    do {
      tileIndex = THREE.MathUtils.randInt(minTileIndex, maxTileIndex);
    } while (occupiedTiles.has(tileIndex));
    occupiedTiles.add(tileIndex);

    const height = randomElement([20, 45, 60]);

    return { tileIndex, height };
  });

  return { type: "forest", trees };
}

function generateCarLaneMetadata(): Row {
  const direction = randomElement([true, false]);
  const speed = randomElement([125, 156, 188]);

  const occupiedTiles = new Set<number>();

  const vehicles = Array.from({ length: 3 }, () => {
    let initialTileIndex;
    do {
      initialTileIndex = THREE.MathUtils.randInt(
        minTileIndex,
        maxTileIndex
      );
    } while (occupiedTiles.has(initialTileIndex));
    occupiedTiles.add(initialTileIndex - 1);
    occupiedTiles.add(initialTileIndex);
    occupiedTiles.add(initialTileIndex + 1);

    const color: THREE.ColorRepresentation = randomElement([
      0xa52523, 0xbdb638, 0x78b14b,
    ]);

    return { initialTileIndex, color };
  });

  return { type: "car", direction, speed, vehicles };
}

function generateTruckLaneMetadata(): Row {
  const direction = randomElement([true, false]);
  const speed = randomElement([125, 156, 188]);

  const occupiedTiles = new Set<number>();

  const vehicles = Array.from({ length: 2 }, () => {
    let initialTileIndex;
    do {
      initialTileIndex = THREE.MathUtils.randInt(
        minTileIndex,
        maxTileIndex
      );
    } while (occupiedTiles.has(initialTileIndex));
    occupiedTiles.add(initialTileIndex - 2);
    occupiedTiles.add(initialTileIndex - 1);
    occupiedTiles.add(initialTileIndex);
    occupiedTiles.add(initialTileIndex + 1);
    occupiedTiles.add(initialTileIndex + 2);

    const color: THREE.ColorRepresentation = randomElement([
      0xa52523, 0xbdb638, 0x78b14b,
    ]);

    return { initialTileIndex, color };
  });

  return { type: "truck", direction, speed, vehicles };
}

function generateRow(): Row {
  const type: RowType = randomElement(["car", "truck", "forest"]);
  if (type === "car") return generateCarLaneMetadata();
  if (type === "truck") return generateTruckLaneMetadata();
  return generateForesMetadata();
}

function randomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

export const initializeGame = () => {
  updateScore(-1)
  character.farest = 0
  initializeMap()
  initializePlayer()
}

export const handleHit = (isForward: boolean) => {
  cancelCharacterTweens()
  isForward ? character.character.children[0].rotateY(Math.PI / 2) : character.character.children[0].rotateY(-Math.PI / 2)
  character.isDead = true
}

export function update(delta: number) {

  if(!character.isDead){
    hitTest()

    metadata.forEach((rowData) => {
      if (rowData.type === "car" || rowData.type === "truck") {
        const beginningOfRow = (minTileIndex - 2) * tileSize;
        const endOfRow = (maxTileIndex + 2) * tileSize;

        rowData.vehicles.forEach(({ ref }) => {
          if (!ref) throw Error("Vehicle reference is missing");

          if (rowData.direction) {
            ref.position.x =
              ref.position.x > endOfRow
                ? beginningOfRow
                : ref.position.x + rowData.speed * delta;
          } else {
            ref.position.x =
              ref.position.x < beginningOfRow
                ? endOfRow
                : ref.position.x - rowData.speed * delta;
          }
        });
      }
    });
  }
}

export const CrossTheRoadModule: GameModule = {
    camera: camera,
    renderTarget: crossRenderTarget,
    scene: scene,
    update
}