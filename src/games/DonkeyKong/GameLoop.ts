export class GameLoop {

    lastFrameTime: number;
    accumulatedTime: number;
    timeStep: number;

    rafId: number | null;
    isRunning: boolean;

    render: () => void
    update: (arg1: number) => void

    constructor(update: (arg1: number) => void, render: () => void) {

        this.lastFrameTime = 0;
        this.accumulatedTime = 0;
        this.timeStep = 1000/60;

        this.render = render;
        this.update = update;

        this.rafId = null;
        this.isRunning = false;
    }

    mainLoop = (timestamp: number) => {
        if(!this.isRunning){
            return;
        }

        let deltaTime = timestamp - this.lastFrameTime
        this.lastFrameTime = timestamp

        this.accumulatedTime += deltaTime

        while(this.accumulatedTime >= this.timeStep){
            this.update(this.timeStep)
            this.accumulatedTime -=this.timeStep
        }

        this.render()

        this.rafId = requestAnimationFrame(this.mainLoop)
    }

    start(){
        if(!this.isRunning){
            this.isRunning = true
        }

        this.rafId = requestAnimationFrame(this.mainLoop)
    }

    stop(){
        if(this.rafId){
            cancelAnimationFrame(this.rafId)
        }

        this.isRunning = false
    }
}