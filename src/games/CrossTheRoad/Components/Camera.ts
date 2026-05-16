import {OrthographicCamera} from 'three'

const size = 250;
const viewRatio = 1.25;
const width = viewRatio < 1 ? size : size * viewRatio;
const height = viewRatio < 1 ? size / viewRatio : size;

const Camera = () => {
  const camera = new OrthographicCamera(
    width / -2, // left
    width / 2, // right
    height / 2, // top
    height / -2, // bottom
    100, // near
    900 // far
  );

  camera.up.set(0, 0, 1);
  camera.position.set(250, -250, 250);
  camera.lookAt(0, 0, 0);

  return camera
}

export const camera = Camera()