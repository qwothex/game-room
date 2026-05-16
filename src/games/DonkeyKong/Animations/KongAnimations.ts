import { walkingFrames } from "./frames"

export const THROW_BARREL = walkingFrames([4,5,6,0], 1500)

export const ROLL_LEFT = walkingFrames([0,1,2,3], 600)
export const ROLL_RIGHT = walkingFrames([3,2,1,0], 600)