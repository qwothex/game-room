import { GameModule } from "../../types/games"
import { resources } from "./Resources"
import Sprite from "./Sprite"
import { Vector2 } from "./Vector2"
import { direction, DOWN, input, LEFT, RIGHT, UP } from "./Input"
import { gridCell } from "./helpers/grid"
import { Animations } from "./Animations"
import { FrameIndexPattern } from "./FrameIndexPattern"
import { CLIMB, DEAD, JUMP_LEFT, JUMP_RIGHT, STAND_CLIMB, STAND_LEFT, STAND_LEFT_HAMMER, STAND_RIGHT, STAND_RIGHT_HAMMER, STAND_UP, WALK_LEFT, WALK_LEFT_HAMMER, WALK_RIGHT, WALK_RIGHT_HAMMER } from "./Animations/HeroAnimations"
import { FIREBALL_IDLE } from "./Animations/FlameAnimations"
import { ladders, rows } from "./levels/level1"
import { barrels, emptyBarrels, spawnBarrel, updateBarrels } from "./Barrel"
import { flame, spawnFlame, resetFlame, updateFlame } from "./Flame"
import { THROW_BARREL } from "./Animations/KongAnimations"
import { ctx, renderTarget, scene, texture, camera, updateScore } from "./utils"
// import { GameLoop } from "./GameLoop"

const backgroundSprite = new Sprite({
    resource: resources.images.background,
    frameSize: new Vector2(224, 256)
})

const hammerSprite = {
    sprite: new Sprite({
        resource: resources.images.hammer,
        frameSize: new Vector2(16, 16),
        position: new Vector2(gridCell(4), gridCell(12.5))
    }),
    isPicked: false
}

const hammerSprite1 = {
    sprite: new Sprite({
        resource: resources.images.hammer,
        frameSize: new Vector2(16, 16),
        position: new Vector2(gridCell(21.5), gridCell(24.5))
    }),
    isPicked: false
}

const flameSprite = new Sprite({
    resource: resources.images.fireball,
    frameSize: new Vector2(13, 15),
    hFrames: 1,
    vFrames: 1,
    frame: 0,
    position: new Vector2(0, 0),
    animations: new Animations({
        idle: new FrameIndexPattern(FIREBALL_IDLE)
    })
})

const kongSprite = new Sprite({
    resource: resources.images.kong,
    frameSize: new Vector2(48,32),
    hFrames: 4,
    vFrames: 2,
    frame: 6,
    position: new Vector2(20, 52),
    animations: new Animations({
        throwBarrel: new FrameIndexPattern({...THROW_BARREL, once: true})
    })
})

const marioSprite = new Sprite({
    resource: resources.images.mario,
    frameSize: new Vector2(40,40),
    hFrames: 8,
    vFrames: 4,
    frame: 4,
    position: new Vector2(gridCell(10), gridCell(27)),
    animations: new Animations({
        walkLeft: new FrameIndexPattern(WALK_LEFT),
        walkLeftWithHammer: new FrameIndexPattern(WALK_LEFT_HAMMER),
        walkRight: new FrameIndexPattern(WALK_RIGHT),
        walkRightWithHammer: new FrameIndexPattern(WALK_RIGHT_HAMMER),
        climb: new FrameIndexPattern(CLIMB),
        standClimb: new FrameIndexPattern(STAND_CLIMB),
        standUp: new FrameIndexPattern(STAND_UP),
        standLeft: new FrameIndexPattern(STAND_LEFT),
        standLeftWithHammer: new FrameIndexPattern(STAND_LEFT_HAMMER),
        standRight: new FrameIndexPattern(STAND_RIGHT),
        standRightWithHammer: new FrameIndexPattern(STAND_RIGHT_HAMMER),
        jumpLeft: new FrameIndexPattern(JUMP_LEFT),
        jumpRight: new FrameIndexPattern(JUMP_RIGHT),
        dead: new FrameIndexPattern(DEAD)
    })
})

const MARIO_OFFSET_Y = -10

const draw = () => {
    backgroundSprite.drawImage(ctx!, 0, 0)
    kongSprite.drawImage(ctx!, kongSprite.position.x, kongSprite.position.y)
    !hammerSprite.isPicked && hammerSprite.sprite.drawImage(ctx!, hammerSprite.sprite.position.x - 8, hammerSprite.sprite.position.y - 8)
    !hammerSprite1.isPicked && hammerSprite1.sprite.drawImage(ctx!, hammerSprite1.sprite.position.x - 8, hammerSprite1.sprite.position.y - 8)

    const marioOffset = new Vector2(-20, -28);
    const marioPosX = marioSprite.position.x + marioOffset.x
    const marioPosY = marioSprite.position.y + marioOffset.y
    marioSprite.drawImage(ctx!, marioPosX, marioPosY)

    for (const slot of barrels) {
        slot.sprite.drawImage(ctx!, slot.sprite.position.x - 5, slot.sprite.position.y - 4)
    }

    if (flame.active) {
        flameSprite.animations?.play('idle')
        flameSprite.drawImage(ctx!, flame.x - 6, flame.y - 15)
    }

    // for (const b of barrels) {
    //     ctx!.fillStyle = 'red'
    //     ctx!.fillRect(b.sprite.position.x, b.sprite.position.y, 2, 2)
    // }

    // ctx!.fillStyle = 'red'
    // ctx!.fillRect(marioSprite.position.x, marioSprite.position.y + MARIO_OFFSET_Y, 2, 2)

    if (isWon) {
        ctx!.fillStyle = 'rgba(0, 0, 0, 0.55)'
        ctx!.fillRect(0, 0, 224, 256)
        ctx!.fillStyle = '#FFD700'
        ctx!.font = 'bold 22px Donkey-kong, monospace'
        ctx!.textAlign = 'center'
        ctx!.textBaseline = 'middle'
        ctx!.fillText('YOU WIN!', 112, 118)
        ctx!.fillStyle = 'white'
        ctx!.font = '12px Donkey-kong, monospace'
        ctx!.fillText(`Score: ${score}`, 112, 145)
    }

    texture.needsUpdate = true

    // for(let i = 0; i < rows.length; i++){
    //     for(let j = 0; j < rows[i].length; j++){
            // ctx!.strokeStyle = "limegreen"; // line color
            // ctx!.lineWidth = 1; // thickness

            // ctx?.beginPath();
            // ctx?.moveTo(16 * j, rows[i][j]); // start point (x, y)
            // ctx?.lineTo(16 * j + 16, rows[i][j]); // end point (x, y)
            // ctx?.stroke()
    //     }
    // }

    // for(let j = 0; j < rows[currentRow].length; j++){
    //     ctx!.strokeStyle = "limegreen";
    //     ctx!.lineWidth = 2;

    //     ctx?.beginPath();
    //     ctx?.moveTo(16 * j, rows[currentRow][j] as number); // start point (x, y)
    //     ctx?.lineTo(16 * j + 16, rows[currentRow][j] as number); // end point (x, y)
    //     ctx?.stroke()
    // }

    // for(let i = 0; i < barrelLadders.length; i++){
    //         ctx!.strokeStyle = "limegreen";
    //         ctx!.lineWidth = 2;

    //         ctx?.beginPath();
    //         ctx?.moveTo(barrelLadders[i].x - 1, barrelLadders[i].yb);
    //         ctx?.lineTo(barrelLadders[i].x + 1, barrelLadders[i].yb);
    //         ctx?.stroke()

    //         ctx?.beginPath();
    //         ctx?.moveTo(barrelLadders[i].x - 1, barrelLadders[i].yt);
    //         ctx?.lineTo(barrelLadders[i].x + 1, barrelLadders[i].yt);
    //         ctx?.stroke()
    // }

    // ctx!.fillStyle = 'red'
    // ctx!.fillRect(marioSprite.position.x, marioSprite.position.y + MARIO_OFFSET_Y, 4, 4)
}

let vy = 0;
let vx = 0;
let isDead = false;
let isJumping = false;
let isClimbing = false;
let isFalling = false;
let currentRow = 0;
let nextRowSnapshot: number | null = null;
let facing: direction = RIGHT;
let hasHammer = false;
let hammerTimeout: number | undefined

let score = 0
let isWon = false
let winTimeout: number | undefined

const checkRow = () => {
    if(!isClimbing && !isFalling) return;
    if(marioSprite.position.y > 225){
        currentRow = 0
    }else if(marioSprite.position.y <= 60){
        currentRow = 6
    }else if(marioSprite.position.y <= 100){
        currentRow = 5
    }else if(marioSprite.position.y <= 130){
        currentRow = 4
    }else if(marioSprite.position.y <= 160){
        currentRow = 3
    }else if(marioSprite.position.y <= 195){
        currentRow = 2
    }else if(marioSprite.position.y <= 225){
        currentRow = 1
    }
}

export const GRAVITY = 0.05
const JUMP_FORCE = -1.45

const tryMove = () => {

    if(isDead) return;

    const dir = input.heldDirections[1]

    const col = Math.floor((marioSprite.position.x) / 16)
    const y = rows[currentRow]?.[col]

    if (y === 0) {
        isFalling = true
    }

    if (isFalling) {
        vy += GRAVITY
        if(facing === "RIGHT") marioSprite.position.x += 0.75
        else if(facing === 'LEFT') marioSprite.position.x -= 0.75
        marioSprite.position.y += vy

        if(!nextRowSnapshot){
            nextRowSnapshot = rows[currentRow - 1]?.[col]
        }
        if (nextRowSnapshot !== 0 && marioSprite.position.y >= nextRowSnapshot) {
            marioSprite.position.y = nextRowSnapshot
            vy = 0
            vx = 0
            isFalling = false
            nextRowSnapshot = null
        }

        return
    }

    if(isJumping){
        vy += GRAVITY
        marioSprite.position.y += vy
        marioSprite.position.x += vx

        if(marioSprite.position.y >= y){
            marioSprite.position.y = y
            vy = 0
            vx = 0
            isJumping = false
        }

        return
    }

    if(marioSprite.position.y !== y && !isClimbing){
        marioSprite.position.y = y
    }

    if(!input.direction){
        if(facing === LEFT){
            hasHammer ? marioSprite.animations?.play("walkLeftWithHammer") : marioSprite.animations?.play("standLeft")
        }
        if(facing === RIGHT){
            hasHammer ? marioSprite.animations?.play("walkRightWithHammer") : marioSprite.animations?.play("standRight")
        }
        if(facing === UP || facing === DOWN){marioSprite.animations?.play("standClimb")}
        return
    }

    if(input.direction === 'UP'){
        if(hasHammer) return;
        for(let i = 0; i < ladders.length; i++){

            const xDiff = Math.abs(ladders[i].x - marioSprite.position.x)
            if(xDiff > 8) continue;

            const ytDiff = ladders[i].yt - marioSprite.position.y

            if(isClimbing && ytDiff >= 0 && ytDiff <= 2){
                isClimbing = false
                break;
            }

            const ybDiff = Math.abs(ladders[i].yb - marioSprite.position.y)
            const conditionSatisfied = (xDiff <= 8 && ybDiff <=2) || (isClimbing && xDiff <= 2 && ybDiff <= 28)
            if(conditionSatisfied){
                isClimbing = true;
                marioSprite.position.x = ladders[i].x;
                marioSprite.position.y -= 0.5;
                marioSprite.animations?.play("climb");
                facing = input.direction
                break;
            }
        }
    }

    if(input.direction === 'DOWN'){
        if(hasHammer) return;
        for(let i = 0; i < ladders.length; i++){

            const xDiff = Math.abs(ladders[i].x - marioSprite.position.x)
            if(xDiff > 8) continue;

            const ybDiff = Math.abs(ladders[i].yb - marioSprite.position.y)

            if(isClimbing && ybDiff >= 0 && ybDiff <= 2){
                isClimbing = false
                break;
            }

            const ytDiff = ladders[i].yt - marioSprite.position.y
            const conditionSatisfied = (xDiff <= 8 && ytDiff <= 12 && ytDiff > 0) || (isClimbing && xDiff <=2 && ytDiff <= 20)
            if(conditionSatisfied){
                isClimbing = true;
                marioSprite.position.x = ladders[i].x;
                marioSprite.position.y += 0.5;
                marioSprite.animations?.play("climb");
                facing = input.direction
                break
            }
        }
    }

    if(isClimbing) return

    if(input.direction === 'LEFT'){
        marioSprite.position.x -= 0.75;
        facing = input.direction
        if(hasHammer){
            marioSprite.animations?.play("walkLeftWithHammer")
        }else{
            marioSprite.animations?.play("walkLeft")
        };
    }
    if(input.direction === 'RIGHT'){
        marioSprite.position.x += 0.75;
        facing = input.direction
        if(hasHammer){
            marioSprite.animations?.play("walkRightWithHammer")
        }else{
            marioSprite.animations?.play("walkRight");
        };
    }

    if(input.direction === 'JUMP' && !isJumping){
        if(hasHammer) return;

        isJumping = true
        vy = JUMP_FORCE

        if(dir === "LEFT") vx = (JUMP_FORCE * 0.45)
        else if(dir === 'RIGHT') vx = -(JUMP_FORCE * 0.45)
        else vx = 0
    }
}

let spawnInterval: number | undefined
let reviveTimeout: number | undefined

const checkBarrelCollision = () => {
    if(isDead || !barrels.length) return;
    for(let i = barrels.length - 1; i >= 0; i--){
        const b = barrels[i]
        if(!b) return;
        const dx = b.sprite.position.x - marioSprite.position.x;
        const dy = b.sprite.position.y - marioSprite.position.y - MARIO_OFFSET_Y;

        // jump over score
        if (isJumping && !b.barrel.isJumped) {
            const aboveBarrel = dy > 10 && dy < 30
            const passingOver = Math.abs(dx) < 16
            if (aboveBarrel && passingOver) {
                b.barrel.isJumped = true
                score += 100
                updateScore(score)
            }
        }
        if (b.barrel.isJumped && Math.abs(dx) > 20) {
            b.barrel.isJumped = false
        }

        if (hasHammer) {
            const REACH = 20  // hammer radius

            if (facing === 'RIGHT') {
                // in front = dx positive (barrel is to the right)
                // in arc = within reach distance, and above mario's feet
                const inFront = dx >= -10 && dx <= REACH
                const inArc = dy >= -REACH && dy <= 4  // 4 = slight below waist
                if (inFront && inArc) {
                    score += 100
                    updateScore(score)
                    barrels.splice(i, 1)
                }
            } else if (facing === 'LEFT') {
                // in front = dx negative (barrel is to the left)
                const inFront = dx <= 10 && dx >= -REACH
                const inArc = dy >= -REACH && dy <= 4
                if (inFront && inArc) {
                    score += 100
                    updateScore(score)
                    barrels.splice(i, 1)
                }
            }
        }else if (Math.abs(dx) < 10 && Math.abs(dy) <= 12) {
            clearInterval(spawnInterval)
            spawnInterval = undefined
            emptyBarrels()
            isDead = true
        }
    }
}

const checkFlameCollision = () => {
    if (!flame.active || isDead) return
    const dx = flame.x - marioSprite.position.x
    const dy = (flame.y - 6) - marioSprite.position.y - MARIO_OFFSET_Y

    if (isJumping && !flame.isJumped) {
        const aboveFlame = dy > 10 && dy < 30
        const passingOver = Math.abs(dx) < 16
        if (aboveFlame && passingOver) {
            flame.isJumped = true
            score += 100
            updateScore(score)
        }
    }
    if (flame.isJumped && Math.abs(dx) > 20) {
        flame.isJumped = false
    }

    if (hasHammer) {
        const REACH = 20
        if (facing === 'RIGHT') {
            const inFront = dx >= -10 && dx <= REACH
            const inArc = dy >= -REACH && dy <= 4
            if (inFront && inArc) {
                score += 100
                updateScore(score)
                flame.active = false
            }
        } else if (facing === 'LEFT') {
            const inFront = dx <= 10 && dx >= -REACH
            const inArc = dy >= -REACH && dy <= 4
            if (inFront && inArc) {
                score += 100
                updateScore(score)
                flame.active = false
            }
        }
    } else if (Math.abs(dx) < 10 && Math.abs(dy) <= 12) {
        clearInterval(spawnInterval)
        spawnInterval = undefined
        emptyBarrels()
        isDead = true
    }
}

const pickUpHammer = () => {
    hasHammer = true
    
    clearTimeout(hammerTimeout)
    hammerTimeout = setTimeout(() => {
        hasHammer = false
    }, 10000)
}

const checkHammerCollision = () => {
    if(!hammerSprite.isPicked){
        const dx = Math.abs(hammerSprite.sprite.position.x - marioSprite.position.x)
        const dy = Math.abs(hammerSprite.sprite.position.y - marioSprite.position.y - MARIO_OFFSET_Y)
        if (dx < 8 && dy <= 8) {
            hammerSprite.isPicked = true
            pickUpHammer()
            return;
        }
    }

    if(!hammerSprite1.isPicked){
        const dx = Math.abs(hammerSprite1.sprite.position.x - marioSprite.position.x)
        const dy = Math.abs(hammerSprite1.sprite.position.y - marioSprite.position.y - MARIO_OFFSET_Y)
        if (dx < 8 && dy <= 8) {
            hammerSprite1.isPicked = true
            pickUpHammer()
            return;
        }
    }
}

export const resetMario = () => {
    marioSprite.position = new Vector2(gridCell(10), gridCell(27))
    vy = 0;
    vx = 0;
    isJumping = false;
    isClimbing = false;
    isFalling = false;
    currentRow = 0;
    nextRowSnapshot: null;
    facing = RIGHT;
    hasHammer = false;
    hammerTimeout = undefined;
    clearTimeout(spawnInterval)
    spawnInterval = undefined
    hammerSprite.isPicked = false
    hammerSprite1.isPicked = false
    score = 0
    updateScore(0)
    emptyBarrels()
    resetFlame()
    isWon = false
    clearTimeout(winTimeout)
    winTimeout = undefined
}

const scheduleNextBarrel = () => {
    if(isDead) return
    const delay = Math.random() * 3000 + 1000
    spawnInterval = setTimeout(() => {
        kongSprite.animations?.play("throwBarrel")
        setTimeout(() => {
            if(!isDead) spawnBarrel()
        }, 1000)
        scheduleNextBarrel()
    }, delay)
}

const SCENE_LEFT = 8
const SCENE_RIGHT = 218

const inGameUpdate = (delta: number) => {
    
    marioSprite.step(delta)
    kongSprite.step(delta)
    flameSprite.step(delta)
    
    if(isWon) return

    if(!isDead){

        if (!spawnInterval) {
            scheduleNextBarrel()
            spawnFlame()
        }

        tryMove()
        checkRow()
        updateBarrels()
        updateFlame(currentRow, marioSprite.position.x)
        checkBarrelCollision()
        checkFlameCollision()
        checkHammerCollision()
        for (const slot of barrels) {
            slot.sprite.step(delta)
        }

        marioSprite.position.x = Math.max(SCENE_LEFT, Math.min(SCENE_RIGHT, marioSprite.position.x))
        if(isJumping){
            marioSprite.animations?.play(facing === RIGHT ? "jumpRight" : "jumpLeft")
        }

        if (currentRow === 6 && !isClimbing && !isFalling) {
            isWon = true
            clearInterval(spawnInterval)
            spawnInterval = undefined
            emptyBarrels()
            winTimeout = setTimeout(() => {
                winTimeout = undefined
                resetMario()
            }, 6000)
        }
    }else{
        marioSprite.animations?.play("dead")
        if(!reviveTimeout){
            reviveTimeout = setTimeout(() => {
                console.log('fired')
                reviveTimeout = undefined
                resetMario()
                isDead = false
            }, 2500)
        }
    }
}

// export const gameLoop = new GameLoop(inGameUpdate, draw)
// gameLoop.start()

let accumulatedTime = 0
const timeStep = 1000 / 60

export const DonkeyKongModule: GameModule = {
    renderTarget,
    scene,
    camera,
    update: (delta: number) => {
        accumulatedTime += delta * 1000
        accumulatedTime = Math.min(accumulatedTime, timeStep * 3)
        
        while (accumulatedTime >= timeStep) {
            inGameUpdate(timeStep)
            accumulatedTime -= timeStep
        }

        draw()
    }
}