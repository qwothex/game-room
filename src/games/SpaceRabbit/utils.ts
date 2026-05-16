import * as THREE from 'three'
import { FieldsList } from '../../../public/variables/fieldsList';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';
import PlayingFieldType from '../../types/playingField';
import gsap from 'gsap'
import { GameModule } from '../../types/games';
import { confetti2D } from '../../utils/confettiBurst';
import { scene } from '../../utils/scene';
import { renderer } from '../../utils/renderer';
import { camera } from '../../utils/camera';

let animPlaying = false
let characterCurrentPosition = {x: 0, z: 0};
let score = 0;
let isLost = false;

const rabbitRenderTarget = new THREE.WebGLRenderTarget(512, 512)

export const rabbitScreenScene = new THREE.Scene();
    const screenSceneBg = new THREE.TextureLoader().load('images/prev9.jpg');
    screenSceneBg.colorSpace = THREE.SRGBColorSpace;
    screenSceneBg.anisotropy = 16;
    screenSceneBg.minFilter = THREE.LinearFilter;
    rabbitScreenScene.background = screenSceneBg;

const rabbitScreenCamera = new THREE.PerspectiveCamera(45, rabbitRenderTarget.width / rabbitRenderTarget.height, 0.1, 1000)
    rabbitScreenCamera.position.set(4, 4, 5)
    rabbitScreenCamera.lookAt(-1,0,0)
    rabbitScreenCamera.zoom = 1
    rabbitScreenCamera.updateProjectionMatrix()

    const loader = new GLTFLoader();
    
    let playableMeshRef

    loader.load('models/SpaceRabbit/SpaceRabbit.gltf', (gltf) => {
        gltf.scene.name = 'playableCharacter'
        gltf.scene.position.set(0,0.25,0)
        gltf.scene.scale.set(0.2, 0.2, 0.2)
        playableMeshRef = gltf.scene
        rabbitScreenScene.add(gltf.scene)
    })

    const textureLoader = new THREE.TextureLoader()

    const scoreCanvas = document.createElement('canvas');
        scoreCanvas.width = 256;
        scoreCanvas.height = 64;

    const ctx = scoreCanvas.getContext('2d')!;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

    const scoreTexture = new THREE.CanvasTexture(scoreCanvas);

    document.fonts.load('58px Honk').then(() => {
        ctx.font = '58px Honk';
        ctx.fillText('Score: 0', scoreCanvas.width / 2, scoreCanvas.height / 2);
        
        scoreTexture.needsUpdate = true;
    });

    const hudPlane = new THREE.Mesh(
        new THREE.PlaneGeometry(0.40, 0.10),
        new THREE.MeshBasicMaterial({ map: scoreTexture, transparent: true })
    );

    hudPlane.position.set(0, 0.25, -1);

    rabbitScreenCamera.add(hudPlane)
    rabbitScreenScene.add(rabbitScreenCamera)

    const gameoverCanvas = document.createElement('canvas');
        
        gameoverCanvas.width = 512;
        gameoverCanvas.height = 256;

    const gameoverTexture = new THREE.CanvasTexture(gameoverCanvas);

    const ctx1 = gameoverCanvas.getContext('2d')!;
        ctx1.textAlign = 'center';
        ctx1.textBaseline = 'middle';

        ctx1.fillStyle = 'rgba(0, 0, 0, 0.80)';
        ctx1.fillRect(0, 0, gameoverCanvas.width, gameoverCanvas.height);

        Promise.all([
            document.fonts.load('58px Honk'),
            document.fonts.load('32px Honk')
        ]).then(() => {
            ctx1.font = '58px Honk';
            ctx1.fillText('Game Over', gameoverCanvas.width / 2, gameoverCanvas.height / 2 - 25);

            ctx1.font = '32px Honk';
            ctx1.fillText('Press any key to restart', gameoverCanvas.width / 2, gameoverCanvas.height / 2 + 25); 
        });

        gameoverTexture.needsUpdate = true;

        const gameoverPlane = new THREE.Mesh(
            new THREE.PlaneGeometry(1, 1),
            new THREE.MeshBasicMaterial({ map: gameoverTexture, transparent: true })
        );

        gameoverPlane.position.set(0, 0, -1);

        const cameraVector = new THREE.Vector3(-1,0,0)

export const bonusField = (axis: 'x' | 'z', isForward: boolean) => {

    const fieldData: PlayingFieldType | undefined = FieldsList.find(field => field.x == characterCurrentPosition.x && field.z == characterCurrentPosition.z)

    const texture = textureLoader.load(`images/pixel${fieldData?.fieldName}.png`)
    const field = rabbitScreenScene.getObjectByName(`${characterCurrentPosition.x}${characterCurrentPosition.z}`) as THREE.Mesh

    const pos = new THREE.Vector3();
    
    const logo = scene.getObjectByName(`techLogo_${fieldData?.fieldName}`)?.children[0] as THREE.Mesh

    const mat = logo.material as THREE.Material & { color: THREE.Color };

    logo.getWorldPosition(pos);

    const vector = pos.clone().project(camera);

    const canvasRect = renderer.domElement.getBoundingClientRect();
    const x = (vector.x + 1) / 2 * canvasRect.width;
    const y = (-vector.y + 1) / 2 * canvasRect.height;


    const materials = [
        new THREE.MeshStandardMaterial({ color: 0xffffff }), // right
        new THREE.MeshStandardMaterial({ color: 0xffffff }), // left
        new THREE.MeshStandardMaterial({ map: texture }),    // top
        new THREE.MeshStandardMaterial({ color: 0xffffff }), // bottom
        new THREE.MeshStandardMaterial({ color: 0xffffff }), // front
        new THREE.MeshStandardMaterial({ color: 0xffffff })  // back
    ];

    axis == 'x' 
        ? gsap.to(playableMeshRef!.rotation, {
            z: `-=${Math.PI * 2}`,
            onComplete: () => {
            if(fieldData?.specialField == 'bonus' && !fieldData.discovered){
                field.material = materials //new THREE.MeshBasicMaterial({ map: texture })
                confetti2D.spawn(100, {x, y});
                mat.color.copy(logo.userData.originalColor);
                fieldData.discovered = true
            }
            }
        })
        : gsap.to(playableMeshRef!.rotation, {
            x: isForward ? `-=${Math.PI * 2}` : `+=${Math.PI * 2}`,
            onComplete: () => {
            if(fieldData?.specialField == 'bonus' && !fieldData.discovered){
                field.material = materials //new THREE.MeshBasicMaterial({ map: texture })
                confetti2D.spawn(100, {x, y});
                mat.color.copy(logo.userData.originalColor);
                fieldData.discovered = true
            }
            }
        })
    
}

export const updateScore = (newScore: number) => {
    score = newScore
    ctx.clearRect(0, 0, scoreCanvas.width, scoreCanvas.height)
    ctx.fillText(`Score: ${newScore}`, scoreCanvas.width / 2, scoreCanvas.height / 2)
    scoreTexture.needsUpdate = true
}

export const wrongField = ({x,z}: PlayingFieldType) => {
    const field = rabbitScreenScene.getObjectByName(`${x}${z}`)
    const tl = gsap.timeline()
        tl.to(field!.position, {
            y: -10,
            duration: 0.5
        })
        .to(playableMeshRef!.position, {
            y: -10,
            duration: 0.5,
            ease: 'power3.in',
            onComplete: () => { 
                animPlaying = false
            }
        }, '<0.15')
        rabbitScreenCamera.add(gameoverPlane)
}

const wrongMoveAnimation = () => {
    const {x,z} = characterCurrentPosition
    gsap.to(playableMeshRef!.position, {
        x: x + -0.04, 
        z: z, 
        duration: 0.1,
        repeat: 5,
        yoyo: true,
        onComplete: () => {animPlaying = false}
    })
}

export const restart = () => {

    gsap.killTweensOf(playableMeshRef!.position);

    rabbitScreenCamera.position.set(4, 4, 5)
    playableMeshRef!.position.set(0,0.25,0)

    rabbitScreenScene.getObjectByName(`${characterCurrentPosition.x}${characterCurrentPosition.z}`)!.position.setY(0)

    rabbitScreenCamera.remove(gameoverPlane)
    animPlaying = false
    characterCurrentPosition = {x: 0, z: 0}
    isLost = false
    cameraVector.set(-1,0,0)
    rabbitScreenCamera.lookAt(-1,0,0)
}

export const moveCameraTo = (axis: 'x' | 'z', isForward: boolean) => {
    const newPos = playableMeshRef!.position

    const tl = gsap.timeline()
    axis === 'x' 
        ? tl.to(cameraVector, {
            x: isForward ? newPos.x + 1 : newPos.x - 1,
            z: newPos.z,
            duration: 0.5,
            ease: 'power2.out',
            onUpdate: () => {
                rabbitScreenCamera.lookAt(cameraVector)
            }
            })
            .to(rabbitScreenCamera.position, {
            x: isForward ? '+=0.5' : '-=0.5', 
            ease: 'none',
            duration: 0.25,
            }, '<')

        : tl.to(cameraVector, {
            x: newPos.x,
            z: isForward ? newPos.z - 1 : newPos.z + 1,
            duration: 0.5,
            ease: 'power2.out',
            onUpdate: () => {
                rabbitScreenCamera.lookAt(cameraVector)
            }
            })
            .to(rabbitScreenCamera.position, {
            z: isForward ? '-=0.5' : '+=0.5', 
            ease: 'none',
            duration: 0.25,
            }, '<')
}

const moveCharacterTo = (axis: 'x' | 'z', isForward: boolean) => {
    const tl = gsap.timeline()

    moveCameraTo(axis, isForward)
    
    axis === 'x' 

        ? tl.to(playableMeshRef!.rotation, {
            y: isForward ? 0 : `${Math.PI}`,
            })
            .to(playableMeshRef!.position, {
            x: isForward ? '+=0.5' : '-=0.5', 
            y: 0.5,
            ease: 'none',
            duration: 0.25,
            }, '<')
            .to(playableMeshRef!.position, {
            x: isForward ? '+=0.5' : '-=0.5', 
            y: 0.25,
            ease: 'power1.out',
            duration: 0.25,
            onComplete: () => { animPlaying = false }
            }, '>')

        : tl.to(playableMeshRef!.rotation, {
            y: isForward ? `${Math.PI / 2}` : `-${Math.PI / 2}`,
            })
            .to(playableMeshRef!.position, {
            z: isForward ? '-=0.5' : '+=0.5', 
            y: 0.5,
            ease: 'power1.inOut',
            duration: 0.25,
            }, '<')
            .to(playableMeshRef!.position, {
            z: isForward ? '-=0.5' : '+=0.5', 
            y: 0.25,
            ease: 'none',
            duration: 0.25,
            onComplete: () => { animPlaying = false }
            }, '>')
}

export const rabbitRightButtonClicked = () => {

    if(true){
        if(!isLost){
            const currentPosX = characterCurrentPosition.x
            const currentPosZ = characterCurrentPosition.z

            const nextPos = FieldsList.findIndex(field => field.x === currentPosX + 1 && field.z === currentPosZ);

            if(!animPlaying){
                animPlaying = true
                if(nextPos !== -1){
                    moveCharacterTo('x', true)
                    characterCurrentPosition.x++;
                    if(FieldsList[nextPos].specialField){
                        if(FieldsList[nextPos].specialField === 'bonus'){
                            bonusField('x', true)
                            updateScore(score + 5)
                        }else{
                            isLost = true
                            wrongField(FieldsList[nextPos])
                            updateScore(0)
                        }
                    }else{
                        updateScore(score + 1)
                    }
                } 
                else{
                    wrongMoveAnimation()
                }
            }
        }else{
            restart()
        }
    }
}

export const rabbitLeftButtonClicked = () => {
    if(!isLost){
        const currentPosX = characterCurrentPosition.x
        const currentPosZ = characterCurrentPosition.z

        const nextPos = FieldsList.findIndex(field => field.x === currentPosX - 1 && field.z === currentPosZ);
        
        if(!animPlaying){
            animPlaying = true
            if(nextPos !== -1){
                moveCharacterTo('x', false)
                characterCurrentPosition.x--
                if(FieldsList[nextPos].specialField){
                    if(FieldsList[nextPos].specialField === 'bonus'){
                        bonusField('x', false)
                        updateScore(score + 5)
                    }else{
                        isLost = true
                        wrongField(FieldsList[nextPos])
                        updateScore(0)
                    }
                }else{
                    updateScore(score + 1)
                }
            } 
            else{
                wrongMoveAnimation()
            }
        }
    }else{
        restart()
    }
}

export const rabbitUpButtonClicked = () => {
    if(!isLost){
        const currentPosX = characterCurrentPosition.x
        const currentPosZ = characterCurrentPosition.z
        
        const nextPos = FieldsList.findIndex(field => field.x === currentPosX && field.z === currentPosZ - 1);

        if(!animPlaying){
            animPlaying = true
            if(nextPos !== -1){
                moveCharacterTo('z', true)
                characterCurrentPosition.z--
                if(FieldsList[nextPos].specialField){
                    if(FieldsList[nextPos].specialField === 'bonus'){
                        bonusField('z', true)
                        updateScore(score + 5)
                    }else{
                        isLost = true
                        wrongField(FieldsList[nextPos])
                        updateScore(0)
                    }
                }else{
                    updateScore(score + 1)
                }
            }
            else{
                wrongMoveAnimation()
            }
        }
    }else{
        restart()
    }
}

export const rabbitDownButtonClicked = () => {
    if(!isLost){
        const currentPosX = characterCurrentPosition.x
        const currentPosZ = characterCurrentPosition.z
        
        const nextPos = FieldsList.findIndex(field => field.x === currentPosX && field.z === currentPosZ + 1);

        if(!animPlaying){
            animPlaying = true
            if(nextPos !== -1){
                moveCharacterTo('z', false)
                characterCurrentPosition.z++
                if(FieldsList[nextPos].specialField){
                    if(FieldsList[nextPos].specialField === 'bonus'){
                        bonusField('z', false)
                        updateScore(score + 5)
                    }else{
                        isLost = true
                        wrongField(FieldsList[nextPos])
                        updateScore(0)
                    }
                }else{
                    updateScore(score + 1)
                }
            }
            else{
                wrongMoveAnimation()
            }
        }
    }else{
        restart()
    }
}

export const SpaceRabbitModule: GameModule = {
  scene: rabbitScreenScene,
  camera: rabbitScreenCamera,
  renderTarget: rabbitRenderTarget,
};