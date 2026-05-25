import { FC, useEffect, useLayoutEffect, useRef } from "react";
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/Addons.js";
import lottie from 'lottie-web';
import gsap from 'gsap'
import generateModelsWP from "../../utils/generateModelsWP";
import { modelsList } from "../../../public/variables/roomModels";
import {gamepadButtonAnimation, joystickButtonAnimation} from "../../utils/Animations/gamepadButtonAnimation";
import './WorkingPlace.css'
import { CrossTheRoadModule } from '../../games/CrossTheRoad/utils'
import { destroyDoom, DoomModule, startDoom } from '../../games/DOOM/doom1.ts'
import { releasePointerLock, requestPointerLock } from '../../games/DOOM/utils'
import { GamesType } from "../../types/games";
import { resolveCanvasGameKeyDown, resolveCanvasGameKeyUp, resolveCrossTheRoadKeys, resolveDoomKeysDown, resolveDoomKeysUp } from "../../utils/Functions/resolveGameAction";
import { resolveInitTarget } from "../../utils/Functions/resolveInitTarget.ts";
import { scene } from '../../utils/scene.ts'
import { renderer } from '../../utils/renderer.ts'
import { camera } from '../../utils/camera.ts'
import { DonkeyKongModule, resetMario } from "../../games/DonkeyKong/donkeyKong.ts";
import { createLabel, removeLabel } from '../../utils/createLabel'
import { addClickableEffect, removeClickableEffect } from '../../utils/clickableEffect'

const zoomLabel = createLabel({ text: 'Zoom in/out' })
const doomLabel = createLabel({ text: 'Click on the screen to lock pointer', width: 450 })
const digLabel = createLabel({ text: '"Dig Dug" is in development and is not yet available', width: 650 })

const WorkingPlace:FC<{game: GamesType, setGame: (type: GamesType) => void}> = ({game, setGame}) => {

    const gameRef = useRef(game);
    const screenRef = useRef<THREE.Mesh>()

    useEffect(() => {
        gameRef.current = game;
        if (game !== 'doom') {
            removeLabel(doomLabel)
            releasePointerLock(renderer.domElement);
            destroyDoom();
        }

        if(game !== 'digdug'){
            removeLabel(digLabel)
        }
    }, [game]);

    const container = useRef<HTMLDivElement>(null);
    const animationRef = useRef<number | null>(null);

    const activeCartridgeRef = useRef<THREE.Object3D<THREE.Object3DEventMap>>();

    const lottieTextureRef = useRef<THREE.Texture>()
    const lottieTextureRef1 = useRef<THREE.Texture>()
    const glitchTextureRef = useRef<THREE.Texture>()
    const legendaryTextureRef = useRef<THREE.Texture>()

    const controlsRef = useRef<OrbitControls | null>(null)
    if (!controlsRef.current) {
        const controls = new OrbitControls(camera, renderer.domElement)
        controls.enableDamping = true;
        controls.enableZoom = false;
        controls.enablePan = false;
        controls.target.set(-1, 0.35, 0);
        controls.update();

        controls.minPolarAngle = Math.PI / 3;
        controls.maxPolarAngle = Math.PI / 2.05;

        controls.minAzimuthAngle = -Math.PI / 6; // left
        controls.maxAzimuthAngle = Math.PI / 5; // right

        controls.minDistance = 3;
        controls.maxDistance = 5;

        controlsRef.current = controls
    }
    const controls = controlsRef.current!

    const resolveGameAction = (key: string) => {
        switch(gameRef.current){
            case "crosstheroad": {
                resolveCrossTheRoadKeys(key)
                break;
            }
            case "doom": {
                resolveDoomKeysDown(key)
                break;
            }
            case "donkeykong": {
                resolveCanvasGameKeyDown(key)
                break;
            }
        }
    }

    useEffect(() => {
        let crossRepeatInterval: ReturnType<typeof setInterval> | null = null

        const handleKeyDown = (e: KeyboardEvent) => {
            if (gameRef.current === "crosstheroad") {
                if (e.repeat) return
                if (crossRepeatInterval) clearInterval(crossRepeatInterval)
                resolveCrossTheRoadKeys(e.key)
                crossRepeatInterval = setInterval(() => resolveCrossTheRoadKeys(e.key), 100)
                return
            }
            resolveGameAction(e.key)
        }

        const handleKeyUp = (e: KeyboardEvent) => {
            if (gameRef.current === "crosstheroad") {
                if (crossRepeatInterval) { clearInterval(crossRepeatInterval); crossRepeatInterval = null }
                return
            }

            switch(gameRef.current){
                case "donkeykong": {
                    resolveCanvasGameKeyUp(e.key)
                    break;
                }
                case "doom": {
                    resolveDoomKeysUp(e.key)
                    break;
                }
            }
        }

        document.addEventListener('keydown', handleKeyDown)
        document.addEventListener('keyup', handleKeyUp)
    }, [])

    useLayoutEffect(() => {
        container.current?.appendChild(renderer.domElement);
    }, [])

    useEffect(() => {

        let animPlaying = false;

        const init = async() => {
            const models = await generateModelsWP(modelsList);

            const carpet = models.getObjectByName('Plane') as THREE.Mesh;
            carpet.scale.set(5,1,3)
            carpet.position.set(0,0,4)
            carpet.traverse(child => {
                if ((child as THREE.Mesh).isMesh) child.receiveShadow = true
            })

            const gamepad = models.getObjectByName('Gamepad') as THREE.Mesh;
            gamepad.position.set(1, 0, 2)
            gamepad.traverse(child => {
                if ((child as THREE.Mesh).isMesh) child.castShadow = true
            })

            const consoleMesh = models.getObjectByName('Console') as THREE.Mesh;
            consoleMesh.rotation.set(0.015, 0.8, 0);
            consoleMesh.position.set(-1.5, 0, 2);
            consoleMesh.traverse(child => {
                if ((child as THREE.Mesh).isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                    // ((child as THREE.Mesh).material as THREE.MeshBasicMaterial).wireframe = true;
                }
            })

            const cartridgeGroup = models.getObjectByName('CartridgesGroup') as THREE.Mesh;
            cartridgeGroup.rotation.set(0, 1, 0);
            cartridgeGroup.position.set(-2.515, 1.09, 2.775);
            cartridgeGroup.traverse(child => {
                if ((child as THREE.Mesh).isMesh) {
                    child.castShadow = true
                    child.receiveShadow = true
                }
            })

            const stand = models.getObjectByName('Stand') as THREE.Mesh
            stand.scale.set(0.25, 0.3, 0.3)
            stand.rotation.set(0, 1, 0);
            stand.position.set(-2.2, 0.45, 2.97);
            stand.traverse(child => {
                if ((child as THREE.Mesh).isMesh) {
                    child.castShadow = true
                    child.receiveShadow = true
                }
            })

            screenRef.current = models.getObjectByName('screen') as THREE.Mesh

            const tvModel = models.getObjectByName('TV') as THREE.Mesh
            tvModel.traverse(child => {
                child.castShadow = false;
                child.receiveShadow = false;
                child.layers.set(1)
            })
            camera.layers.enable(1)

            const initCartridge = models.getObjectByName('donkeykong') as THREE.Mesh
            activeCartridgeRef.current = initCartridge
            scene.attach(initCartridge)

            scene.add(models)

            const toggler = models.getObjectByName('toggler')
            if (toggler) {
                addClickableEffect(toggler)
                const wp = new THREE.Vector3()
                toggler.getWorldPosition(wp)
                zoomLabel.position.set(wp.x + 0.40, wp.y + 0.15, wp.z)
                scene.add(zoomLabel)
            }
        }

        init()

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.1)
        directionalLight.castShadow = false
        directionalLight.position.set(0, 2, 3);
        directionalLight.target.position.set(0, 2, 2);
        directionalLight.layers.set(1)
        scene.add(directionalLight)
        scene.add(directionalLight.target)

        const spotLight = new THREE.SpotLight(0xffffff, 4)
        spotLight.position.set(-0.25, 1, 1.2)
        spotLight.target.position.set(-0.25, 1, 2)
        spotLight.castShadow = true
        spotLight.shadow.mapSize.set(4096, 4096)
        spotLight.angle = Math.PI / 2.4
        spotLight.shadow.camera.near = 0.1
        spotLight.shadow.camera.far = 5
        spotLight.shadow.normalBias = 0.003;
        spotLight.shadow.bias = -0.0002;
        scene.add(spotLight)
        scene.add(spotLight.target)

        const video = document.getElementById('glitch-video') as HTMLVideoElement;
        video.play()
        const glitchTexture = new THREE.VideoTexture(video);
        glitchTextureRef.current = glitchTexture

        const video1 = document.getElementById('rick-roll') as HTMLVideoElement;
        const legendary = new THREE.VideoTexture(video1);
        legendaryTextureRef.current = legendary

        const lottieContainer = document.getElementById('lottie1');

        const anim = lottie.loadAnimation({
            container: lottieContainer!,
            renderer: 'canvas',
            loop: true,
            autoplay: true,
            path: '/lotties/Animation - 1745154506878.json',
        });

        anim.setSpeed(1)

        const lottieContainer1 = document.getElementById('lottie2');

        const anim1 = lottie.loadAnimation({
            container: lottieContainer1!,
            renderer: 'canvas',
            loop: true,
            autoplay: true,
            path: '/lotties/Animation - 1745154134742.json',
        });

        anim1.setSpeed(1)

        anim.addEventListener('DOMLoaded', () => {
            const lottieCanvas = lottieContainer?.querySelector('canvas');
            if (lottieCanvas) {
                const texture = new THREE.CanvasTexture(lottieCanvas);

                lottieTextureRef1.current = texture;
            }
        })

        anim1.addEventListener('DOMLoaded', () => {
            const lottieCanvas = lottieContainer1?.querySelector('canvas');
            if (lottieCanvas) {
                const texture = new THREE.CanvasTexture(lottieCanvas);

                lottieTextureRef.current = texture
            }
        })

        const waitForScreen = () => {
            const texture = resolveInitTarget(gameRef.current)?.texture
            if (screenRef.current) {
                screenRef.current.material = new THREE.MeshBasicMaterial({ map: texture });
            } else {
                requestAnimationFrame(waitForScreen);
            }
        };
    
        waitForScreen();

        const changeCartridgeAnim = (intersect: THREE.Object3D<THREE.Object3DEventMap>) => {

            scene.attach(intersect)
            
            const newCartridgeCoords = new THREE.Vector3()
            intersect.getWorldPosition(newCartridgeCoords)

            const activeCartridgeCoords = new THREE.Vector3()
            activeCartridgeRef.current?.getWorldPosition(activeCartridgeCoords)

            gsap.timeline()
                .to(intersect.position, {y: newCartridgeCoords.y + 0.5, duration: 0.35})
                .to(activeCartridgeRef.current!.position, {y: newCartridgeCoords.y + 0.25, duration: 0.35}, '<')

                .to(activeCartridgeRef.current!.position, {x: newCartridgeCoords.x, z: newCartridgeCoords.z, duration: 0.35}, '>+=0.1')
                .to(intersect.position, {x: activeCartridgeCoords.x, z: activeCartridgeCoords.z, duration: 0.35}, '<')
                .to(activeCartridgeRef.current!.rotation, {y: 1, duration: 0.35}, '<')
                .to(intersect.rotation, {y: 0.8, duration: 0.35}, '<')

                .to(activeCartridgeRef.current!.position, {y: newCartridgeCoords.y, duration: 0.25}, '>+=0.1')
                .to(intersect.position, { y: activeCartridgeCoords.y, duration: 0.25, 
                        onComplete: () => { 
                            animPlaying = false 
                            activeCartridgeRef.current = intersect
                        }
                    }, '<')
        }

        const raycaster = new THREE.Raycaster()
        raycaster.layers.enableAll()
        const mouse = new THREE.Vector2()

        const clickFn = (event: MouseEvent) => {
            const rect = renderer.domElement.getBoundingClientRect();
                mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
                mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

            raycaster.setFromCamera(mouse, camera)

            const intersects = raycaster.intersectObjects(scene.children, true)

            if(intersects.length > 0){

                const intersect = intersects[0].object

                if(intersect.name === 'on'){
                    setGame('sleep')
                    spotLight.color = new THREE.Color(0xffffff)
                    video1.pause()
                    gamepadButtonAnimation(intersect as THREE.Mesh)
                    removeClickableEffect(intersect)
                    const onMat = new THREE.MeshBasicMaterial({ map: glitchTextureRef.current, color: new THREE.Color(0, 0, 0) })
                    screenRef.current!.material = onMat
                    gsap.to(onMat.color, { r: 1, g: 1, b: 1, duration: 0.4, ease: 'power2.out' })
                    gsap.to(directionalLight, {
                        intensity: 0.1,
                        duration: 0.1
                    });
                    gsap.to(spotLight, {
                        intensity: 4,
                        duration: 0.4
                    });
                }

                if(gameRef.current === 'off') return

                if(intersect.name === 'off'){
                    video1.pause()
                    setGame('off')
                    gamepadButtonAnimation(intersect as THREE.Mesh)
                    const j = scene.getObjectByName('Gamepad') as THREE.Group;
                    addClickableEffect(j.getObjectByName('on')!)
                    gsap.to((screenRef.current!.material as THREE.MeshBasicMaterial).color, {
                        r: 0, 
                        g: 0, 
                        b: 0, 
                        duration: 0.4, 
                        ease: 'power2.out' 
                    })
                    gsap.to(spotLight, {
                        intensity: 0,
                        duration: 0.4
                    });
                    gsap.to(directionalLight, {
                        intensity: 0.025,
                        duration: 0.4
                    });
                }

                if(intersect.name === 'sleep1'){

                    setGame('sleep')

                    video1.pause()
                    gamepadButtonAnimation(intersect as THREE.Mesh)
                    screenRef.current!.material = new THREE.MeshBasicMaterial({ map: lottieTextureRef1.current });
                    spotLight.color = new THREE.Color(0xffffff)
                }

                if(intersect.name === 'sleep2'){

                    setGame('sleep')

                    video1.pause()
                    gamepadButtonAnimation(intersect as THREE.Mesh)
                    screenRef.current!.material = new THREE.MeshBasicMaterial({ map: lottieTextureRef.current });
                    spotLight.color = new THREE.Color(0xecc1ff)
                }

                if(intersect.name === 'brightness1'){
                    gamepadButtonAnimation(intersect as THREE.Mesh)
                    spotLight.intensity -= 1
                }

                if(intersect.name === 'brightness2'){
                    gamepadButtonAnimation(intersect as THREE.Mesh)
                    spotLight.intensity += 1
                }

                if(intersect.name === 'screen' && gameRef.current === 'doom') {
                    requestPointerLock()
                    removeLabel(doomLabel)
                }

                if(intersect.name === 'toggler') {
                    removeLabel(zoomLabel)
                    removeClickableEffect(intersect)
                    if(controls.enableRotate){
                        controls.enableRotate = false
                        gsap.to(intersect.rotation, {
                            y: intersect.rotation.y + (Math.PI / 2),
                            duration: 0.6,
                            ease: 'power2.out'
                        })
                        gsap.timeline()
                            .to(camera.position, { x: 0, y: 1, z: 3, duration: 0.4, ease: 'power2.out' }, 0)
                            .to(controls.target, { x: 0, y: 0.75, z: 0, duration: 0.4, ease: 'power2.out' }, 0)
                    }else{
                        controls.enableRotate = true
                        gsap.to(intersect.rotation, {
                            y: intersect.rotation.y + -(Math.PI / 2),
                            duration: 0.6,
                            ease: 'power2.out'
                        })
                        gsap.timeline()
                            .to(camera.position, { x: 0.5, y: 1.25, z: 4.25, duration: 0.4, ease: 'power2.out' }, 0)
                            .to(controls.target, { x: -1, y: 0.35, z: 0, duration: 0.4, ease: 'power2.out' }, 0)
                    }
                }

                if(intersect.name.includes("Cartridge")){

                    spotLight.color = new THREE.Color(0xffffff)

                    video1.pause()

                    screenRef.current!.material = new THREE.MeshBasicMaterial({ map: glitchTextureRef.current })

                    if(!animPlaying){
                        changeCartridgeAnim(intersect.parent!)
                        animPlaying = true

                        if(intersect.parent!.name === 'unknown'){
                            setGame('sleep')
                            setTimeout(() => {
                                screenRef.current!.material = new THREE.MeshBasicMaterial({ map: legendaryTextureRef.current })
                                video1.muted = false
                                video1.play()
                            }, 1150)
                        }else if(intersect.parent!.name === 'crosstheroad'){

                            setGame('crosstheroad')
                            
                            const texture = CrossTheRoadModule.renderTarget.texture
                            texture.flipY = false;

                            setTimeout(() => screenRef.current!.material = new THREE.MeshBasicMaterial({ map: texture }), 1150)
                        
                        }
                        else if(intersect.parent!.name === 'digdug'){
                            setGame("digdug")
                            const wp = new THREE.Vector3()
                            screenRef.current?.getWorldPosition(wp)
                            digLabel.position.set(wp.x + 0.40, wp.y + 1, wp.z + 0.85)
                            scene.add(digLabel)
                        }
                        else if(intersect.parent!.name === 'doom'){

                            const texture = DoomModule.renderTarget.texture
                            texture.flipY = false;

                            setGame("doom")
                            const wp = new THREE.Vector3()
                            screenRef.current?.getWorldPosition(wp)
                            doomLabel.position.set(wp.x + 0.40, wp.y + 1, wp.z + 0.85)

                            setTimeout(() => {
                                screenRef.current!.material = new THREE.MeshBasicMaterial({ map: texture}), 1150
                                scene.add(doomLabel)
                            }, 1150)

                            startDoom('doom1.wad')
                        }
                        else if(intersect.parent!.name === 'freedoom1'){

                            const texture = DoomModule.renderTarget.texture
                            texture.flipY = false;

                            setGame("doom")
                            const wp = new THREE.Vector3()
                            screenRef.current?.getWorldPosition(wp)
                            doomLabel.position.set(wp.x + 0.40, wp.y + 1, wp.z + 0.85)

                            setTimeout(() => {
                                screenRef.current!.material = new THREE.MeshBasicMaterial({ map: texture}), 1150
                                scene.add(doomLabel)
                            }, 1150)

                            startDoom('freedoom1.wad')
                        }else if(intersect.parent!.name === 'freedoom2'){

                            const texture = DoomModule.renderTarget.texture
                            texture.flipY = false;

                            setGame("doom")
                            const wp = new THREE.Vector3()
                            screenRef.current?.getWorldPosition(wp)
                            doomLabel.position.set(wp.x + 0.40, wp.y + 1, wp.z + 0.85)

                            setTimeout(() => {
                                screenRef.current!.material = new THREE.MeshBasicMaterial({ map: texture}), 1150
                                scene.add(doomLabel)
                            }, 1150)

                            startDoom('freedoom2.wad')
                        }
                        else if(intersect.parent!.name === 'donkeykong'){
                            
                            const texture = DonkeyKongModule.renderTarget.texture
                            texture.flipY = false;

                            setGame("donkeykong")

                            resetMario()

                            setTimeout(() => screenRef.current!.material = new THREE.MeshBasicMaterial({ map: texture}), 1150)
                        }

                    }
                }

                if(intersect.parent!.name === 'joystick'){

                    if(intersect.name === 'joystickRight'){
                        resolveGameAction('ArrowRight')
                        joystickButtonAnimation(intersect.parent! as THREE.Mesh, -0.15, -0.15)
                    }

                    if(intersect.name === 'joystickLeft'){
                        resolveGameAction('ArrowLeft')
                        joystickButtonAnimation(intersect.parent! as THREE.Mesh, 0.15, 0.15)
                    }

                    if(intersect.name === 'joystickUp'){
                        resolveGameAction('ArrowUp')
                        joystickButtonAnimation(intersect.parent! as THREE.Mesh, 0.025, -0.025)
                    }

                    if(intersect.name === 'joystickDown'){
                        resolveGameAction('ArrowDown')
                        joystickButtonAnimation(intersect.parent! as THREE.Mesh, -0.025, 0.025)
                    }
                }
            }
        }

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();

            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        });

        window.addEventListener('click', (e) => clickFn(e))

        const getSceneData = (): [THREE.WebGLRenderTarget, THREE.Scene, THREE.Camera, ((delta: number) => any) | undefined] => {
            switch (gameRef.current) {
                case 'crosstheroad': return [CrossTheRoadModule.renderTarget, CrossTheRoadModule.scene, CrossTheRoadModule.camera, CrossTheRoadModule.update];
                case 'doom': return [DoomModule.renderTarget, DoomModule.scene, DoomModule.camera, DoomModule.update];
                case 'donkeykong': return [DonkeyKongModule.renderTarget, DonkeyKongModule.scene, DonkeyKongModule.camera, DonkeyKongModule.update];
                default: return [DonkeyKongModule.renderTarget, DonkeyKongModule.scene, DonkeyKongModule.camera, DonkeyKongModule.update];
            }
        };

        // const con1 = new OrbitControls(CrossTheRoadModule.camera, renderer.domElement);

        const clock = new THREE.Clock()

        const animate = () => {
            if (!animationRef.current) return;
            controls.update();

            if(gameRef.current === 'sleep'){
                if(lottieTextureRef1.current) lottieTextureRef1.current.needsUpdate = true;
                if(lottieTextureRef.current) lottieTextureRef.current.needsUpdate = true;
            }else{
                const delta = clock.getDelta();

                const [target, sceneToRender, cameraToRender, update] = getSceneData()

                update?.(delta)

                renderer.setRenderTarget(target);
                renderer.render(sceneToRender, cameraToRender);
                renderer.setRenderTarget(null);
            }

            renderer.render(scene, camera);

            animationRef.current = requestAnimationFrame(animate);
          };
          animationRef.current = requestAnimationFrame(animate);
    }, [])

    return(
        <div ref={container} id="three-canvas" className="container">
            <div id='loading-screen' className="loading_screen">
                LOADING...
                <progress id='loading-screen-progress' className="loading_screen_progress" value={0} max={100}></progress>
            </div>
            <div id="lottie1" className="lottie"></div>
            <div id="lottie2" className="lottie"></div>
        </div>
    )
}

export default WorkingPlace
