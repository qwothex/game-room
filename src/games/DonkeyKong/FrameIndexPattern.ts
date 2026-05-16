interface AnimationConfig {
    duration: number,
    frames: {time: number, frame: number}[],
    once?: boolean
}

export class FrameIndexPattern {

    currentTime: number
    animationConfig: AnimationConfig
    duration: number
    isDone: boolean

    constructor(animationConfig: AnimationConfig){
        this.currentTime = 0
        this.animationConfig = animationConfig
        this.duration = animationConfig.duration ?? 500
        this.isDone = false
    }

    get frame(){
        const {frames} = this.animationConfig
        for(let i = frames.length - 1; i >= 0; i--){
            if(this.currentTime >= frames[i].time){
                return frames[i].frame
            }
        }

        throw "Time is before the first keyframe"
    }

    step(delta: number){
        if(this.isDone) return

        this.currentTime += delta;
        if(this.currentTime >= this.duration){
            if(this.animationConfig.once){
                this.currentTime = this.duration - 1
                this.isDone = true
            } else {
                this.currentTime = 0
            }
        }
    }
}