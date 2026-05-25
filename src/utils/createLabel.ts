import * as THREE from 'three'

type LabelOptions = {
    text: string
    width?: number
    height?: number
    radius?: number
    fontSize?: number
    background?: string
    color?: string
}

export function createLabel(options: LabelOptions): THREE.Mesh {
    const {
        text,
        width: W = 320,
        height: H = 80,
        radius: R = 16,
        fontSize = 24,
        background = 'rgba(3, 3, 3, 1)',
        color = '#f3f3f3',
    } = options

    const canvas = document.createElement('canvas')
    canvas.width = W
    canvas.height = H
    const ctx = canvas.getContext('2d')!

    ctx.beginPath()
    ctx.moveTo(0, H)
    ctx.lineTo(W - R, H)
    ctx.arcTo(W, H, W, H - R, R)
    ctx.lineTo(W, R)
    ctx.arcTo(W, 0, W - R, 0, R)
    ctx.lineTo(R, 0)
    ctx.arcTo(0, 0, 0, R, R)
    ctx.closePath()
    ctx.fillStyle = background
    ctx.fill()

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)'
    ctx.lineWidth = 2.5
    ctx.stroke()

    ctx.fillStyle = color
    ctx.font = `bold ${fontSize}px sans-serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(text, W / 2, H / 2)

    const texture = new THREE.CanvasTexture(canvas)
    const mesh = new THREE.Mesh(
        new THREE.PlaneGeometry(W / 533, H / 533),
        new THREE.MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false, side: THREE.DoubleSide })
    )

    return mesh
}

export function removeLabel(mesh: THREE.Mesh): void {
    mesh.parent?.remove(mesh)
    ;(mesh.material as THREE.MeshBasicMaterial).map?.dispose()
    ;(mesh.material as THREE.MeshBasicMaterial).dispose()
    mesh.geometry.dispose()
}
