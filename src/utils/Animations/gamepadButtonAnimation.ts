import {Mesh} from 'three'
import gsap from 'gsap'

const joystickButtonAnimation = (intersect: Mesh, z: number, x: number) => {
    gsap.killTweensOf(intersect.rotation);
    intersect.rotation.z = 0;
    intersect.rotation.x = 0;
    gsap.to(intersect.rotation, {z, x, yoyo: true, repeat: 1, duration: 0.15, overwrite: 'auto'})
}

const gamepadButtonAnimation = (intersect: Mesh) => {
    gsap.killTweensOf(intersect.position);
    intersect.position.y = 0.23;
    gsap.to(intersect.position, {y: 0.220, yoyo: true, repeat: 1, duration: 0.15, overwrite: 'auto'})
}

export {
    gamepadButtonAnimation, 
    joystickButtonAnimation
}