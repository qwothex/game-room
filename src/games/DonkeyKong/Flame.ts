import { ladders, rows } from "./levels/level1"

const FLAME_SPEED = 0.55
const CLIMB_SPEED = 0.4
const FALL_VY = 2.5

type FlamePhase = 'falling' | 'smart'

interface FlameState {
    x: number
    y: number
    row: number
    vx: number
    phase: FlamePhase
    isClimbing: boolean
    climbTargetY: number
    climbTargetRow: number
    active: boolean
    isJumped: boolean
}

const SPAWN_X = 56
const SPAWN_Y = 80
const BOTTOM_Y = rows[0][Math.floor(SPAWN_X / 16)] as number

function makeFlame(): FlameState {
    return {
        x: SPAWN_X,
        y: SPAWN_Y,
        row: 0,
        vx: 0,
        phase: 'falling',
        isClimbing: false,
        climbTargetY: 0,
        climbTargetRow: 0,
        active: false,
        isJumped: false,
    }
}

export let flame = makeFlame()

export const spawnFlame = () => {
    setTimeout(() => {
        flame = makeFlame()
        flame.active = true
    }, 1000)
}

export const resetFlame = () => {
    flame = makeFlame()
}

export const updateFlame = (marioRow: number, marioX: number) => {
    if (!flame.active) return

    // Phase 1: fall straight down until hitting the bottom floor
    if (flame.phase === 'falling') {
        flame.y += FALL_VY
        if (flame.y >= BOTTOM_Y) {
            flame.y = BOTTOM_Y
            flame.row = 0
            flame.phase = 'smart'
            flame.vx = marioX >= flame.x ? FLAME_SPEED : -FLAME_SPEED
        }
        return
    }

    // Climbing a ladder upward
    if (flame.isClimbing) {
        flame.y -= CLIMB_SPEED
        if (flame.y <= flame.climbTargetY) {
            flame.y = flame.climbTargetY
            flame.row = flame.climbTargetRow
            flame.isClimbing = false
            flame.vx = marioX >= flame.x ? FLAME_SPEED : -FLAME_SPEED
        }
        return
    }

    // Horizontal movement
    flame.x += flame.vx

    if (flame.x <= 8)   { flame.x = 8;   flame.vx = FLAME_SPEED }
    if (flame.x >= 218) { flame.x = 218; flame.vx = -FLAME_SPEED }

    // Snap to floor
    const col = Math.floor(flame.x / 16)
    const floorY = rows[flame.row]?.[col]
    if (floorY && floorY !== 0) {
        flame.y = floorY as number
    }

    // Smart: if Mario is on a higher row, find a ladder going up and climb it
    if (marioRow > flame.row) {
        for (const ladder of ladders) {
            if (Math.abs(flame.x - ladder.x) > 5) continue
            if (Math.abs(flame.y - ladder.yb) > 8) continue

            const topRow = rowFromY(ladder.yt)
            if (topRow <= flame.row) continue

            flame.isClimbing = true
            flame.x = ladder.x
            flame.climbTargetY = ladder.yt
            flame.climbTargetRow = topRow
            flame.vx = 0
            break
        }
    }
}

function rowFromY(y: number): number {
    if (y <= 60) return 6
    if (y <= 100) return 5
    if (y <= 130) return 4
    if (y <= 160) return 3
    if (y <= 195) return 2
    if (y <= 225) return 1
    return 0
}
