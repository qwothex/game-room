import { FC, useEffect, useLayoutEffect, useRef } from "react";
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/Addons.js";
import lottie from 'lottie-web';
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js';
import gsap from 'gsap'
import generateModelsWP from "../../utils/generateModelsWP";
import { modelsList } from "../../../public/variables/roomModels";
import {gamepadButtonAnimation, joystickButtonAnimation} from "../../utils/Animations/gamepadButtonAnimation";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import s from './WorkingPlace.module.scss'
import { SpaceRabbitModule } from "../../games/SpaceRabbit/utils";
import { CrossTheRoadModule } from '../../games/CrossTheRoad/utils'
import { destroyDoom, DoomModule, startDoom } from '../../games/DOOM/doom1.ts'
import { releasePointerLock } from '../../games/DOOM/utils'
import { GamesType } from "../../types/games";
import { resolveCanvasGameKeyDown, resolveCanvasGameKeyUp, resolveCrossTheRoadKeys, resolveDoomKeysDown, resolveDoomKeysUp, resolveRabbitKeys } from "../../utils/Functions/resolveGameAction";
import { resolveInitTarget } from "../../utils/Functions/resolveInitTarget.ts";
import { scene } from '../../utils/scene.ts'
import { renderer } from '../../utils/renderer.ts'
import { camera } from '../../utils/camera.ts'
import { DonkeyKongModule, resetMario } from "../../games/DonkeyKong/donkeyKong.ts";
RectAreaLightUniformsLib.init();

gsap.registerPlugin(ScrollTrigger)
gsap.registerPlugin(ScrollToPlugin);

const WorkingPlace:FC<{game: GamesType, setGame: (type: GamesType) => void}> = ({game, setGame}) => {

    const gameRef = useRef(game);
    const screenRef = useRef<THREE.Mesh>()

    useEffect(() => {
        gameRef.current = game;
        if (game !== 'doom') { 
            releasePointerLock(renderer.domElement);
            destroyDoom();
        }
    }, [game]);

    const container = useRef<HTMLDivElement>(null);
    const animationRef = useRef<number | null>(null);

    const activeCartridgeRef = useRef<THREE.Object3D<THREE.Object3DEventMap>>();

    const lottieTextureRef = useRef<THREE.Texture>()
    const lottieTextureRef1 = useRef<THREE.Texture>()
    const glitchTextureRef = useRef<THREE.Texture>()
    const legendaryTextureRef = useRef<THREE.Texture>()

    const controls = new OrbitControls(camera, renderer.domElement)
        controls.enableDamping = true;
        controls.enableZoom = false;
        // controls.enableRotate = false
        // controls.enablePan = false
        // controls.enableDamping = false
        controls.target.set(-1, 0.35, 0);
        controls.update();

        controls.minPolarAngle = Math.PI / 4;  // 45°
        controls.maxPolarAngle = Math.PI / 2.05;   // 90°

        controls.minAzimuthAngle = -Math.PI / 2; // left
        controls.maxAzimuthAngle = Math.PI / 2;  // right

        controls.minDistance = 3;
        controls.maxDistance = 5;

    const resolveGameAction = (key: string) => {
        switch(gameRef.current){
            case "rabbit": {
                resolveRabbitKeys(key)
                break;
            }
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
        const handleKeyDown = (e: KeyboardEvent) => {
            // e.preventDefault()
            resolveGameAction(e.key)
        }

        const handleKeyUp = (e: KeyboardEvent) => {

            switch(gameRef.current){
                case "donkeykong": {
                    // e.preventDefault()
                    resolveCanvasGameKeyUp(e.key)
                    break;
                }
                case "doom": {
                    // e.preventDefault()
                    resolveDoomKeysUp(e.key)
                    break;
                }
            }

            // if (e.key === 'Control') controls.enableZoom = false
        }

        document.addEventListener('keydown', handleKeyDown)
        document.addEventListener('keyup', handleKeyUp)

        window.addEventListener("wheel", () => gsap.killTweensOf(window), { passive: true });
        window.addEventListener("touchmove", () => gsap.killTweensOf(window), { passive: true });
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

            const gamepad = models.getObjectByName('Gamepad') as THREE.Mesh;
            gamepad.position.set(1, 0, 2)

            const consoleMesh = models.getObjectByName('Console') as THREE.Mesh;
            consoleMesh.rotation.set(0, 0.8, 0);
            consoleMesh.position.set(-1.5, 0.03, 2);

            const cartridgeGroup = models.getObjectByName('CartridgesGroup') as THREE.Mesh;
            cartridgeGroup.rotation.set(0, 1, 0);
            cartridgeGroup.position.set(-2.515, 1.09, 2.775);

            const stand = models.getObjectByName('Stand') as THREE.Mesh
            stand.scale.set(0.25, 0.3, 0.3)
            stand.rotation.set(0, 1, 0);
            stand.position.set(-2.2, 0.45, 2.97);

            screenRef.current = models.getObjectByName('screen') as THREE.Mesh

            const initCartridge = models.getObjectByName('donkeykong') as THREE.Mesh
            activeCartridgeRef.current = initCartridge
            scene.attach(initCartridge)

            scene.add(models)
        }

        init()

        let timeoutId: any;

        ScrollTrigger.create({
            trigger: renderer.domElement,
            start: "top center",
            end: "bottom center",
            onUpdate: _self => {
                clearTimeout(timeoutId);

                timeoutId = setTimeout(() => {
                    const rect = renderer.domElement.getBoundingClientRect();

                    if (rect.top < window.innerHeight / 2 && rect.top > -rect.height / 2) {
                        gsap.to(window, {
                            scrollTo: renderer.domElement,
                            duration: 0.5,
                            ease: "power2.out"
                        });
                    }
                }, 750);
            }
        });

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2)
        directionalLight.position.set(0, -1, 2);
        scene.add(directionalLight)

        const rectLight = new THREE.RectAreaLight(0xffffff, 4, 2.5, 1.3)
        rectLight.position.set(0, 1, 1.5)
        rectLight.lookAt(0, 1, 2)
        scene.add(rectLight)

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
                    video1.play()
                    gamepadButtonAnimation(intersect as THREE.Mesh)
                }

                if(intersect.name === 'off'){
                    video1.pause()
                    gamepadButtonAnimation(intersect as THREE.Mesh)
                }

                if(intersect.name === 'sleep1'){
                    // isGameOn = false

                    setGame('sleep')

                    video1.pause()
                    gamepadButtonAnimation(intersect as THREE.Mesh)
                    screenRef.current!.material = new THREE.MeshBasicMaterial({ map: lottieTextureRef1.current });
                    rectLight.color = new THREE.Color(0xffffff)
                }

                if(intersect.name === 'sleep2'){
                    // isGameOn = false

                    setGame('sleep')

                    video1.pause()
                    gamepadButtonAnimation(intersect as THREE.Mesh)
                    screenRef.current!.material = new THREE.MeshBasicMaterial({ map: lottieTextureRef.current });
                    rectLight.color = new THREE.Color(0xecc1ff)
                }

                if(intersect.name === 'brightness1'){
                    gamepadButtonAnimation(intersect as THREE.Mesh)
                    rectLight.intensity -= 1
                }

                if(intersect.name === 'brightness2'){
                    gamepadButtonAnimation(intersect as THREE.Mesh)
                    rectLight.intensity += 1
                }

                if(intersect.name.includes("Cartridge")){

                    // isGameOn = false
                    video1.pause()

                    screenRef.current!.material = new THREE.MeshBasicMaterial({ map: glitchTextureRef.current })

                    if(!animPlaying){
                        changeCartridgeAnim(intersect.parent!)
                        animPlaying = true

                        if(intersect.parent!.name === 'unknown'){
                            setTimeout(() => {
                                screenRef.current!.material = new THREE.MeshBasicMaterial({ map: legendaryTextureRef.current })
                                video1.muted = false
                                video1.play()
                            }, 1150)
                            rectLight.color = new THREE.Color(0xffffff)
                        }else if(intersect.parent!.name === 'crosstheroad'){
                            
                            // isGameOn = true

                            setGame('crosstheroad')
                            
                            const texture = CrossTheRoadModule.renderTarget.texture
                            texture.flipY = false;

                            setTimeout(() => screenRef.current!.material = new THREE.MeshBasicMaterial({ map: texture }), 1150)
                            rectLight.color = new THREE.Color(0xffffff)
                        
                        }else if(intersect.parent!.name === 'rabbitGame'){
                            
                            // isGameOn = true
                            
                            const texture = SpaceRabbitModule.renderTarget.texture
                            texture.flipY = false;

                            setGame("rabbit")

                            setTimeout(() => screenRef.current!.material = new THREE.MeshBasicMaterial({ map: texture}), 1150)
                            rectLight.color = new THREE.Color(0xffffff)

                        }else if(intersect.parent!.name === 'doom'){

                            // renderer.domElement.requestPointerLock({
                            //     unadjustedMovement: true
                            // })
                            
                            // isGameOn = true
                            
                            const texture = DoomModule.renderTarget.texture
                            texture.flipY = false;

                            setGame("doom")

                            setTimeout(() => screenRef.current!.material = new THREE.MeshBasicMaterial({ map: texture}), 1150)
                            rectLight.color = new THREE.Color(0xffffff)

                            startDoom('doom1.wad')
                        }
                        else if(intersect.parent!.name === 'freedoom1'){
                            
                            // isGameOn = true
                            
                            const texture = DoomModule.renderTarget.texture
                            texture.flipY = false;

                            setGame("doom")

                            setTimeout(() => screenRef.current!.material = new THREE.MeshBasicMaterial({ map: texture}), 1150)
                            rectLight.color = new THREE.Color(0xffffff)

                            startDoom('freedoom1.wad')
                        }else if(intersect.parent!.name === 'freedoom2'){
                            
                            // isGameOn = true
                            
                            const texture = DoomModule.renderTarget.texture
                            texture.flipY = false;

                            setGame("doom")

                            setTimeout(() => screenRef.current!.material = new THREE.MeshBasicMaterial({ map: texture}), 1150)
                            rectLight.color = new THREE.Color(0xffffff)

                            startDoom('freedoom2.wad')
                        }
                        else if(intersect.parent!.name === 'donkeykong'){
                            
                            // isGameOn = true
                            
                            const texture = DonkeyKongModule.renderTarget.texture
                            texture.flipY = false;

                            setGame("donkeykong")

                            resetMario()

                            setTimeout(() => screenRef.current!.material = new THREE.MeshBasicMaterial({ map: texture}), 1150)
                            rectLight.color = new THREE.Color(0xffffff)

                            // gameLoop.start()
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
                case 'rabbit': return [SpaceRabbitModule.renderTarget, SpaceRabbitModule.scene, SpaceRabbitModule.camera, SpaceRabbitModule.update];
                case 'crosstheroad': return [CrossTheRoadModule.renderTarget, CrossTheRoadModule.scene, CrossTheRoadModule.camera, CrossTheRoadModule.update];
                case 'doom': return [DoomModule.renderTarget, DoomModule.scene, DoomModule.camera, DoomModule.update];
                case 'donkeykong': return [DonkeyKongModule.renderTarget, DonkeyKongModule.scene, DonkeyKongModule.camera, DonkeyKongModule.update];
                default: return [SpaceRabbitModule.renderTarget, SpaceRabbitModule.scene, SpaceRabbitModule.camera, SpaceRabbitModule.update];
            }
        };

        // const con1 = new OrbitControls(CrossTheRoadModule.camera, renderer.domElement);

        const clock = new THREE.Clock()

        const animate = () => {
            if (!animationRef.current) return;

            const delta = clock.getDelta();

            const [target, sceneToRender, cameraToRender, update] = getSceneData()

            update?.(delta)

            renderer.setRenderTarget(target);
            renderer.render(sceneToRender, cameraToRender);
            renderer.setRenderTarget(null);
            renderer.render(scene, camera);

            if(gameRef.current === 'sleep'){
                if(lottieTextureRef1.current) lottieTextureRef1.current.needsUpdate = true;
                if(lottieTextureRef.current) lottieTextureRef.current.needsUpdate = true;
            }

            animationRef.current = requestAnimationFrame(animate);
          };
          animationRef.current = requestAnimationFrame(animate);
    }, [])

    return(
        <div ref={container} id="three-canvas" className={s.container}>
            <div id='loading-screen' className={s.loading_screen}>
                LOADING...
                <progress id='loading-screen-progress' className={s.loading_screen_progress} value={0} max={100}></progress>
            </div>
            {/* <div className={s.controls}>
                <h2>Controls</h2>
                <p>ctrl + wheel to zoom</p>
                <p>ctrl + LMB to move</p>
                <p>LMB to rotate</p>
            </div> */}
            <div id="lottie1" className={s.lottie}></div>
            <div id="lottie2" className={s.lottie}></div>
        </div>
    )
}

export default WorkingPlace
