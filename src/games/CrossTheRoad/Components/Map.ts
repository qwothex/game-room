import * as THREE from "three";
import { Grass } from "./Grass";
import { Row } from "../../../types/CTRGameTypes";
import { Tree } from "./Tree";
import { Road } from "./Road";
import { Car } from "./Car";
import { Truck } from "./Truck";
import { generateRows } from "../utils";

export const map = new THREE.Group();

export const metadata: Row[] = [];

export function addRows() {
  const newMetadata = generateRows(20);

  const startIndex = metadata.length;
  metadata.push(...newMetadata);

  newMetadata.forEach((rowData, index) => {
    const rowIndex = startIndex + index + 1;

    if (rowData.type === "forest") {
      const row = Grass(rowIndex);

      rowData.trees.forEach(({ tileIndex, height }) => {
        const three = Tree(tileIndex, height);
        row.add(three);
      });

      map.add(row);
    }

    if (rowData.type === "car") {
      const row = Road(rowIndex);

      rowData.vehicles.forEach((vehicle) => {
        const car = Car(
          vehicle.initialTileIndex,
          rowData.direction,
          vehicle.color
        );
        vehicle.ref = car;
        row.add(car);
      });

      map.add(row);
    }

    if (rowData.type === "truck") {
      const row = Road(rowIndex);

      rowData.vehicles.forEach((vehicle) => {
        const truck = Truck(
          vehicle.initialTileIndex,
          rowData.direction,
          vehicle.color
        );
        vehicle.ref = truck;
        row.add(truck);
      });

      map.add(row);
    }
  });
}

export function initializeMap() {
   metadata.length = 0;
   map.remove(...map.children);
   
   for (let rowIndex = 0; rowIndex > -5; rowIndex--) {
    const grass = Grass(rowIndex);
    map.add(grass);
  }
  addRows()
}