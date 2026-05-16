import { standingFrames, walkingFrames } from "./frames"

export const CLIMB = walkingFrames([11,12], 300)
export const STAND_CLIMB = standingFrames(11)
export const STAND_UP = standingFrames(8)

export const WALK_LEFT = walkingFrames([3,2], 300)
export const STAND_LEFT = standingFrames(3)
export const STAND_LEFT_HAMMER = standingFrames(19)

export const JUMP_LEFT = walkingFrames([1], 300)
export const JUMP_RIGHT = walkingFrames([6], 300)

export const WALK_RIGHT = walkingFrames([4,5], 300)
export const STAND_RIGHT = standingFrames(4)
export const STAND_RIGHT_HAMMER = standingFrames(20)

export const WALK_LEFT_HAMMER = walkingFrames([19,16], 300)
export const WALK_RIGHT_HAMMER = walkingFrames([20,23], 300)

export const DEAD = walkingFrames([], 2100, [
    {
        time: 0,
        frame: 26
    },
    {
        time: 500,
        frame: 25
    },
    {
        time: 700,
        frame: 24
    },
    {
        time: 900,
        frame: 27
    },
    {
        time: 1100,
        frame: 26
    },
    {
        time: 1600,
        frame: 7
    },
])