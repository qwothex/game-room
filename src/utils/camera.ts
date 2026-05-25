import { PerspectiveCamera } from "three";
import { scene } from "./scene";

export const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 50);
    scene.add(camera)
    camera.position.set(0.5, 1.25, 4.25);