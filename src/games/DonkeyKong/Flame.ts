import { barrelLadders, rows } from "./levels/level1"

const FLAME_SPEED = 0.55
const CLIMB_SPEED = 0.4
const FALL_VY = 1.5
const GRAVITY = 0.05

type FlamePhase = 'falling' | 'smart'

interface FlameState {
    x: number
    y: number
    row: number
    vx: number
    vy: number
    phase: FlamePhase
    isClimbing: boolean
    isFalling: boolean
    nextRowSnapshot: number | null
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
        vy: 0,
        phase: 'falling',
        isClimbing: false,
        isFalling: false,
        nextRowSnapshot: null,
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

    // Phase 1: initial straight fall to bottom floor
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

    // Falling off an edge or descending a ladder
    if (flame.isFalling) {
        flame.vy += GRAVITY
        flame.y += flame.vy

        const col = Math.floor(flame.x / 16)
        if (flame.nextRowSnapshot === null && flame.row > 0) {
            flame.nextRowSnapshot = flame.row - 1
        }

        if (flame.nextRowSnapshot !== null) {
            const landY = rows[flame.nextRowSnapshot]?.[col] as number | undefined
            if (landY && landY !== 0 && flame.y >= landY) {
                flame.y = landY
                flame.vy = 0
                flame.row = flame.nextRowSnapshot
                flame.nextRowSnapshot = null
                flame.isFalling = false
                flame.vx = marioX >= flame.x ? FLAME_SPEED : -FLAME_SPEED
            }
        }

        if (flame.y > 270) flame.active = false
        return
    }

    // Horizontal movement
    flame.x += flame.vx

    const col = Math.floor(flame.x / 16)
    const floorY = rows[flame.row]?.[col]

    // No floor at this column — fall off the edge
    if (!floorY || floorY === 0) {
        flame.isFalling = true
        flame.vy = 0
        flame.vx = 0
        return
    }

    flame.y = floorY as number

    // Wall bounce (only when there is floor)
    if (flame.x <= 8)   { flame.x = 8;   flame.vx = FLAME_SPEED }
    if (flame.x >= 218) { flame.x = 218; flame.vx = -FLAME_SPEED }

    // Smart ladder logic
    if (marioRow > flame.row) {
        // Mario is higher — climb up
        for (const ladder of barrelLadders) {
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
    } else if (marioRow < flame.row) {
        // Mario is lower — descend via ladder
        for (const ladder of barrelLadders) {
            if (Math.abs(flame.x - ladder.x) > 5) continue
            if (Math.abs(flame.y - ladder.yt) > 8) continue

            const bottomRow = rowFromY(ladder.yb)
            if (bottomRow >= flame.row) continue

            flame.isFalling = true
            flame.vy = 0
            flame.x = ladder.x
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
