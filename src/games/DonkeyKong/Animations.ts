import { FrameIndexPattern } from "./FrameIndexPattern";

interface Patterns {
    [key: string]: FrameIndexPattern
}

export class Animations {

    patterns: Patterns
    activeKey: string

    constructor(patterns: Patterns){
        this.patterns = patterns;
        this.activeKey = Object.keys(this.patterns)[0];
    }

    get frame(){
        return this.patterns[this.activeKey].frame;
    }

    play(key: string, startAtTime = 0){
        if(this.activeKey === key && !this.patterns[key].isDone){
            return;
        }

        this.activeKey = key;
        this.patterns[this.activeKey].currentTime = startAtTime;
        this.patterns[this.activeKey].isDone = false
    }

    step(delta: number) {
        this.patterns[this.activeKey].step(delta);
    }
}