import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from 'three'

const scaleToSize = (root: THREE.Group<THREE.Object3DEventMap>, targetSize: number) => {
    const box = new THREE.Box3().setFromObject(root);
    const size = new THREE.Vector3();
    box.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = targetSize / maxDim;
    root.scale.setScalar(scale);
}

const generateModelsWP = (modelsList: String[]): Promise<THREE.Group> => {
  return new Promise((resolve) => {
    const loadingManager = new THREE.LoadingManager();
    const textureLoader = new THREE.TextureLoader(loadingManager);
    const loader = new GLTFLoader(loadingManager);

    const geometryGroup = new THREE.Group();
    const images = ['unknown', 'digdug', 'crosstheroad', 'freedoom2', 'freedoom1', 'doom'];

    loadingManager.onProgress = (_url, loaded, total) => {
      const loadingProgress = document.getElementById('loading-screen-progress') as HTMLProgressElement;

      loadingProgress.value = loaded / total * 100
    }

    loadingManager.onLoad = () => {
      const loadingScreen = document.getElementById('loading-screen');
      if (loadingScreen) {
        loadingScreen.style.display = 'none';
      }
      resolve(geometryGroup);
    };

    let logoN = 1;

    modelsList.forEach((entry) => {
      const url = `models/${entry}/${entry}.gltf`;

      loader.load(url, (gltf) => {
        const root = gltf.scene;

        if(root.name.includes('techLogo')){

          const mesh = root.children[0] as THREE.Mesh

          const mat = mesh.material as THREE.Material & { color: THREE.Color };

          mesh.userData.originalColor = mat.color.clone();

          // mat.color.set(0xffd037);
          mat.color.set(0xcccccc);

          scaleToSize(root, 0.2)
          root.rotation.set(-Math.PI / 2, 0, 0)
          logoN <= 3 
            ? root.position.set(logoN * 0.25 - 0.75, 0.01, Math.random() * (2.25 - 1.75) + 1.75)
            : root.position.set(logoN * 0.25 - 1.5, 0.01, Math.random() * (2.75 - 2.35) + 2.35)

          logoN++;
        }
        
        else if (root.name === 'Console') {
          const cartridge = root.getObjectByName('Cartridge') as THREE.Mesh;
          const sticker = cartridge.getObjectByName("Cartridge_3_Cartridge_1001_0001_6") as THREE.Mesh;
          cartridge.name = 'donkeykong'

          const texture = textureLoader.load('images/donkeykong.png');
          texture.flipY = false;
          sticker.material = new THREE.MeshStandardMaterial({ map: texture });

          const box = new THREE.Box3().setFromObject(root);
          const size = new THREE.Vector3();
          box.getSize(size);
          const maxDim = Math.max(size.x, size.y, size.z);
          const scale = 2.5 / maxDim;
          root.scale.setScalar(scale);

          const group = new THREE.Group();
          group.name = 'CartridgesGroup';

          // const emptyCartrigdgeTexture = textureLoader.load(`images/emptyBanner.png`);
          // emptyCartrigdgeTexture.flipY = false;

          // const unknownCartrigdgeTexture = textureLoader.load(`images/unknown.png`)
          // unknownCartrigdgeTexture.flipY = false;

          for (let i = 5; i >= 0; i--) {
            const clonedCartridge = cartridge.clone(true);
            const sticker = clonedCartridge.getObjectByName("Cartridge_3_Cartridge_1001_0001_6") as THREE.Mesh;

            clonedCartridge.name = images[i];

            const texture = textureLoader.load(`images/${images[i]}.png`);
            texture.flipY = false

            sticker.material = new THREE.MeshStandardMaterial({ map: texture});
            // sticker.material = new THREE.MeshStandardMaterial({ map: i === 0 ? unknownCartrigdgeTexture : emptyCartrigdgeTexture });
            // clonedCartridge.position.set(i * 0.05, i * -2.6, i * 2.5);
            clonedCartridge.position.set(i * 0.015, i * -2.6, i * 2.6);
            group.add(clonedCartridge);
          }

          group.scale.set(scale, scale, scale);
          geometryGroup.add(group);
        }

        else{
          scaleToSize(root, 2.5)
          geometryGroup.add(root);
        }

        geometryGroup.add(root);
      });
    });
  });
};

export default generateModelsWP;
