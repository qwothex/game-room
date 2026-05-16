export const walkingFrames = (frames: number[], duration: number = 300, completeFrames?: {frame: number, time: number}[]) => {

    const walk = {
        duration: duration,
        frames: completeFrames ?? frames.map((frame, index) => ({time: index * (duration/frames.length), frame}))
    }

    return walk
}

export const standingFrames = (rootFrame: number = 0) => {
    return {
        duration: 400,
        frames: [
            {
                time: 0,
                frame: rootFrame
            }
        ]
    }
}