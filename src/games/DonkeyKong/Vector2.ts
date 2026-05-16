
export class Vector2 {
    public x: number
    public y: number

    constructor(x: number, y: number){
        this.x = x;
        this.y = y;
    }

    duplicate(){
        return new Vector2(this.x, this.y)
    }
}