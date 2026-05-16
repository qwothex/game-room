import { Animations } from "./Animations"
import { ROLL_LEFT, ROLL_RIGHT } from "./Animations/KongAnimations"
import { GRAVITY } from "./donkeyKong"
import { FrameIndexPattern } from "./FrameIndexPattern"
import { ladders, rows } from "./levels/level1"
import { resources } from "./Resources"
import Sprite from "./Sprite"
import { Vector2 } from "./Vector2"

interface Barrel {
    vx: number
    vy: number
    row: number
    isFalling: boolean
    nextRowSnapshot: number | null
    isJumped: boolean
}

export type BarrelSprite = {
    sprite: Sprite
    barrel: Barrel
}

export let barrels: BarrelSprite[] = []

export const emptyBarrels = () => barrels = []

const dis = 6

export const updateBarrels = () => {
    for (let i = barrels.length - 1; i >= 0; i--) {
        const b = barrels[i]

        checkBarrelLadderDescent(b)

        const col = Math.floor((b.sprite.position.x - 4) / 16)

        b.barrel.row % 2 === 0 ? b.sprite.animations?.play('rollLeft') : b.sprite.animations?.play('rollRight')

        if (b.barrel.isFalling) {
            b.barrel.vy += GRAVITY
            b.sprite.position.y += b.barrel.vy

            if(!b.barrel.nextRowSnapshot){
                b.barrel.nextRowSnapshot = b.barrel.row - 1
            }

            const nextRowTiles = rows[b.barrel.nextRowSnapshot ?? b.barrel.row - 1]
            const floorY = nextRowTiles?.[col]
            if (floorY !== 0 && b.sprite.position.y >= floorY - dis) {
                b.sprite.position.y = floorY - dis
                b.barrel.vy = 0
                b.barrel.vx = 0
                b.barrel.row = b.barrel.nextRowSnapshot ?? b.barrel.row - 1
                b.barrel.nextRowSnapshot = null
                b.barrel.isFalling = false
                b.barrel.vx = b.barrel.row % 2 === 0 ? -1.25 : 1.25
            }
        } else {
            b.sprite.position.x += b.barrel.vx
            const floorY = rows[b.barrel.row]?.[col]
            if (floorY !== 0) {
                b.sprite.position.y = floorY - dis
            } else {
                b.barrel.isFalling = true
            }
        }

        if (b.sprite.position.y > 260 || b.sprite.position.x < 0 || b.sprite.position.x > 224) {
            barrels.splice(i, 1)
        }
    }
}

const LADDER_DESCENT_CHANCE = 0.1

export const checkBarrelLadderDescent = (b: BarrelSprite) => {
    if (b.barrel!.isFalling) return

    for (const ladder of ladders) {
        const xDiff = Math.abs(b.sprite.position.x - ladder.x)
        if (xDiff > 2) continue

        const rowFloorY = rows[b.barrel!.row]?.[Math.floor(ladder.x / 16)]
        if (rowFloorY === 0) continue
        if (Math.abs(b.sprite.position.y - ladder.yt) > 10) continue

        if (Math.random() < LADDER_DESCENT_CHANCE) {
            b.barrel!.isFalling = true
            b.barrel!.vx = 0
        }
    }
}

export const spawnBarrel = () => {
    barrels.push({
        sprite: new Sprite({
            resource: resources.images.barrel,
            frameSize: new Vector2(12, 10),
            hFrames: 4,
            vFrames: 1,
            frame: 0,
            position: new Vector2(56,92),
            animations: new Animations({
                rollLeft: new FrameIndexPattern(ROLL_LEFT),
                rollRight: new FrameIndexPattern(ROLL_RIGHT)
            }),
        }),
        barrel: {
            vx: +1.25,
            vy: 0,
            row: 5,
            isFalling: false,
            nextRowSnapshot: null,
            isJumped: false
        }
    })
}