export const LEFT = "LEFT"
export const RIGHT = "RIGHT"
export const DOWN = "DOWN"
export const UP = "UP"
export const JUMP = "JUMP"

export type direction = "LEFT" | "RIGHT" | "UP" | "DOWN" | "JUMP"

class Input {

    heldDirections: direction[]

    constructor(){
        this.heldDirections = []
    }

    get direction() {
        return this.heldDirections[0]
    }

    onArrowPressed(direction: direction) {
        if(this.heldDirections.indexOf(direction) === -1){
            this.heldDirections.unshift(direction)
        }
    }

    onArrowReleased(direction: direction) {
        const index = this.heldDirections.indexOf(direction)
        if(index === -1){
            return;
        }

        this.heldDirections.splice(index, 1)
    }
}

export const input = new Input()