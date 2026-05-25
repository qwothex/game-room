import gsap from 'gsap'
import * as THREE from 'three'

type MeshEntry = { mesh: THREE.Mesh; originalMat: THREE.Material }

function collectMeshes(object: THREE.Object3D): MeshEntry[] {
    const entries: MeshEntry[] = []
    object.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh
            entries.push({ mesh, originalMat: mesh.material as THREE.Material })
        }
    })
    return entries
}

export function addClickableEffect(object: THREE.Object3D) {
    const entries = collectMeshes(object)
    const clonedMats: THREE.MeshStandardMaterial[] = []

    for (const { mesh } of entries) {
        const mat = (mesh.material as THREE.MeshStandardMaterial).clone() as THREE.MeshStandardMaterial
        mat.emissive = new THREE.Color(1, 1, 1)
        mat.emissiveIntensity = 0
        mesh.material = mat
        clonedMats.push(mat)
    }

    object.userData._clickableMats = clonedMats
    object.userData._clickableEntries = entries

    const proxy = { intensity: 0 }
    const tween = gsap.to(proxy, {
        intensity: 0.18,
        duration: 1.4,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        onUpdate: () => {
            for (const mat of clonedMats) {
                mat.emissiveIntensity = proxy.intensity
            }
        },
    })

    object.userData._clickableTweens = [tween]
}

export function removeClickableEffect(object: THREE.Object3D) {
    const tweens: gsap.core.Tween[] = object.userData._clickableTweens ?? []
    tweens.forEach((t) => t.kill())

    const entries: MeshEntry[] = object.userData._clickableEntries ?? []
    const mats: THREE.MeshStandardMaterial[] = object.userData._clickableMats ?? []

    for (const mat of mats) mat.dispose()
    for (const { mesh, originalMat } of entries) mesh.material = originalMat

    delete object.userData._clickableTweens
    delete object.userData._clickableMats
    delete object.userData._clickableEntries
}
