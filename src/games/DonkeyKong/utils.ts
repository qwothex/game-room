import * as THREE from 'three'

export const canvas = document.createElement('canvas')
canvas.id = 'donkey-kong-canvas'
canvas.width = 224
canvas.height = 256
// export const canvas = document.getElementById('donkey-kong-canvas') as HTMLCanvasElement
export const ctx = canvas!.getContext('2d')
ctx!.imageSmoothingEnabled = false

export const scene = new THREE.Scene()
export const renderTarget = new THREE.WebGLRenderTarget(512, 512)

const orthoHeight = 2.5;
const orthoWidth = orthoHeight * 1.25;
export const camera = new THREE.OrthographicCamera(
    -orthoWidth / 2, orthoWidth / 2,
    orthoHeight / 2.40, -orthoHeight / 1.75,
    0.1, 10
);
camera.position.z = 6;

const planeWidth = 2.24;
const planeHeight = 2;

export const texture = new THREE.CanvasTexture(canvas)
texture.minFilter = THREE.NearestFilter
texture.magFilter = THREE.NearestFilter
texture.generateMipmaps = false
texture.colorSpace = THREE.SRGBColorSpace

const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(planeWidth, planeHeight),
    new THREE.MeshBasicMaterial({ map: texture })
)

scene.add(mesh)

const scoreCanvas = document.createElement('canvas');
    scoreCanvas.width = 512;
    scoreCanvas.height = 64;

const scoreCtx = scoreCanvas.getContext('2d')!;
    scoreCtx.textAlign = 'center';
    scoreCtx.textBaseline = 'middle';

const font = new FontFace('Donkey-kong', 'url(/donkey-kong.ttf)')

font.load().then((loadedFont) => {
    document.fonts.add(loadedFont)

    scoreCtx.font = '24px Donkey-kong';
    scoreCtx.fillStyle = 'white'
    scoreCtx.fillText('Score: 0', scoreCanvas.width / 2, scoreCanvas.height / 2);

    scoreTexture.needsUpdate = true
})

const scoreTexture = new THREE.CanvasTexture(scoreCanvas);

const hudPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(2, 0.25),
    new THREE.MeshBasicMaterial({ map: scoreTexture, transparent: true })
);

hudPlane.position.set(0.75, 0.5, -0.1);

camera.add(hudPlane)
scene.add(camera)

export const updateScore = (newScore: number) => {
    scoreCtx.clearRect(0, 0, scoreCanvas.width, scoreCanvas.height)
    scoreCtx.font = '24px Donkey-kong'
    scoreCtx.fillStyle = 'white'
    scoreCtx.fillText(`Score: ${newScore}`, scoreCanvas.width / 2, scoreCanvas.height / 2)
    scoreTexture.needsUpdate = true
}