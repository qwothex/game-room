import { rabbitDownButtonClicked, rabbitLeftButtonClicked, rabbitRightButtonClicked, rabbitUpButtonClicked } from "../../games/SpaceRabbit/utils";
import { crossLeftButtonClicked, crossUpButtonClicked, crossDownButtonClicked, crossRightButtonClicked } from "../../games/CrossTheRoad/Components/Character";
import { keyMap } from "../../games/DOOM/utils";
import { getModule } from "../../games/DOOM/doom1";
import { DOWN, input, JUMP, LEFT, RIGHT, UP } from "../../games/DonkeyKong/Input";

export const resolveRabbitKeys = (key: string) => {
    switch(key){
        case "w": 
        case "W":
        case "ArrowUp": {
            rabbitUpButtonClicked()
            break;
        }
        case "s": 
        case "S": 
        case "ArrowDown": {
            rabbitDownButtonClicked()
            break;
        }
        case "a": 
        case "A": 
        case "ArrowLeft": {
            rabbitLeftButtonClicked()
            break;
        }
        case "d":
        case "D": 
        case "ArrowRight": {
            rabbitRightButtonClicked()
            break;
        }
    }
}

export const resolveCrossTheRoadKeys = (key: string) => {
    switch(key){
        case "w": 
        case "W":
        case "ArrowUp": {
            crossUpButtonClicked()
            break;
        }
        case "s": 
        case "S": 
        case "ArrowDown": {
            crossDownButtonClicked()
            break;
        }
        case "a": 
        case "A":
        case "ArrowLeft": {
            crossLeftButtonClicked()
            break;
        }
        case "d":
        case "D": 
        case "ArrowRight": {
            crossRightButtonClicked()
            break;
        }
    }
}

export const resolveDoomKeysDown = (key: string) => {

    const Module = getModule()

    switch(key){
        case "w":
        case "W":
        case "ArrowUp": {
            const doomKey = keyMap['ArrowUp'];
            Module._doom_key_down(doomKey);
            break;
        }
        case "s":
        case "S":
        case "ArrowDown": {
            const doomKey = keyMap['ArrowDown'];
            Module._doom_key_down(doomKey);
            break;
        }
        case "a":
        case "A":
        case "ArrowLeft": {
            const doomKey = keyMap['ArrowLeft'];
            Module._doom_key_down(doomKey);
            break;
        }
        case "d":
        case "D":
        case "ArrowRight": {
            const doomKey = keyMap['ArrowRight'];
            Module._doom_key_down(doomKey);
            break;
        }

        case "Enter": {
            const doomKey = keyMap['Enter'];
            Module._doom_key_down(doomKey);
            break;
        }

        case "Escape": {
            const doomKey = keyMap['Escape'];
            Module._doom_key_down(doomKey);
            break;
        }

        case "Shift": {
            const doomKey = keyMap['Shift'];
            Module._doom_key_down(doomKey);
            break;
        }

        case "Alt": {
            const doomKey = keyMap['Alt'];
            Module._doom_key_down(doomKey);
            break;
        }

        case "Control": {
            const doomKey = keyMap['Control'];
            Module._doom_key_down(doomKey);
            break;
        }

        case " ": {
            const doomKey = keyMap[' '];
            Module._doom_key_down(doomKey);
            break;
        }

        case "1": {
            const doomKey = keyMap['1'];
            Module._doom_key_down(doomKey);
            break;
        }

        case "2": {
            const doomKey = keyMap['2'];
            Module._doom_key_down(doomKey);
            break;
        }

        case "3": {
            const doomKey = keyMap['3'];
            Module._doom_key_down(doomKey);
            break;
        }

        case "4": {
            const doomKey = keyMap['4'];
            Module._doom_key_down(doomKey);
            break;
        }
        
        case "5": {
            const doomKey = keyMap['5'];
            Module._doom_key_down(doomKey);
            break;
        }

        case "6": {
            const doomKey = keyMap['6'];
            Module._doom_key_down(doomKey);
            break;
        }

        case "7": {
            const doomKey = keyMap['7'];
            Module._doom_key_down(doomKey);
            break;
        }

        case "y":
        case "Y": {
            const doomKey = keyMap['y'];
            Module._doom_key_down(doomKey);
            break;
        }

        case "n":
        case "N": {
            const doomKey = keyMap['n'];
            Module._doom_key_down(doomKey);
            break;
        }
    }
}

export const resolveDoomKeysUp = (key: string) => {

    const Module = getModule()

    switch(key){
        case "w":
        case "W":
        case "ArrowUp": {
            const doomKey = keyMap['ArrowUp'];
            Module._doom_key_up(doomKey);
            break;
        }
        case "s":
        case "S":
        case "ArrowDown": {
            const doomKey = keyMap['ArrowDown'];
            Module._doom_key_up(doomKey);
            break;
        }
        case "a":
        case "A":
        case "ArrowLeft": {
            const doomKey = keyMap['ArrowLeft'];
            Module._doom_key_up(doomKey);
            break;
        }
        case "d": 
        case "D":
        case "ArrowRight": {
            const doomKey = keyMap['ArrowRight'];
            Module._doom_key_up(doomKey);
            break;
        }

        case "Enter": {
            const doomKey = keyMap['Enter'];
            Module._doom_key_up(doomKey);
            break;
        }

        case "Escape": {
            const doomKey = keyMap['Escape'];
            Module._doom_key_up(doomKey);
            break;
        }

        case "Shift": {
            const doomKey = keyMap['Shift'];
            Module._doom_key_up(doomKey);
            break;
        }

        case "Alt": {
            const doomKey = keyMap['Alt'];
            Module._doom_key_up(doomKey);
            break;
        }

        case "Control": {
            const doomKey = keyMap['Control'];
            Module._doom_key_up(doomKey);
            break;
        }

        case " ": {
            const doomKey = keyMap[' '];
            Module._doom_key_up(doomKey);
            break;
        }

        case "1": {
            const doomKey = keyMap['1'];
            Module._doom_key_up(doomKey);
            break;
        }

        case "2": {
            const doomKey = keyMap['2'];
            Module._doom_key_up(doomKey);
            break;
        }

        case "3": {
            const doomKey = keyMap['3'];
            Module._doom_key_up(doomKey);
            break;
        }

        case "4": {
            const doomKey = keyMap['4'];
            Module._doom_key_up(doomKey);
            break;
        }
        
        case "5": {
            const doomKey = keyMap['5'];
            Module._doom_key_up(doomKey);
            break;
        }

        case "6": {
            const doomKey = keyMap['6'];
            Module._doom_key_up(doomKey);
            break;
        }

        case "7": {
            const doomKey = keyMap['7'];
            Module._doom_key_up(doomKey);
            break;
        }

        case "y":
        case "Y": {
            const doomKey = keyMap['y'];
            Module._doom_key_down(doomKey);
            break;
        }

        case "n":
        case "N": {
            const doomKey = keyMap['n'];
            Module._doom_key_down(doomKey);
            break;
        }
    }
}

export const resolveCanvasGameKeyDown = (key: string) => {

    switch(key){
        case 'w':
        case 'W':
        case 'ArrowUp': {
            input.onArrowPressed(UP);
            break;
        }

        case 's':
        case 'S':
        case 'ArrowDown': {
            input.onArrowPressed(DOWN)
            break;
        }

        case 'a':
        case 'A':
        case 'ArrowLeft': {
            input.onArrowPressed(LEFT)
            break;
        }

        case 'd':
        case 'D':
        case 'ArrowRight': {
            input.onArrowPressed(RIGHT)
            break;
        }

        case ' ': {
            input.onArrowPressed(JUMP)
            break;
        }
    }
}

export const resolveCanvasGameKeyUp = (key: string) => {
    switch(key){
        case 'w':
        case 'W':
        case 'ArrowUp': {
            input.onArrowReleased(UP);
            break;
        }

        case 's':
        case 'S':
        case 'ArrowDown': {
            input.onArrowReleased(DOWN)
            break;
        }

        case 'a':
        case 'A':
        case 'ArrowLeft': {
            input.onArrowReleased(LEFT)
            break;
        }

        case 'd':
        case 'D':
        case 'ArrowRight': {
            input.onArrowReleased(RIGHT)
            break;
        }

        case ' ': {
            input.onArrowReleased(JUMP)
            break;
        }
    }
}