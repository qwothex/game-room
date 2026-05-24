import { CrossTheRoadModule } from "../../games/CrossTheRoad/utils"
import { DonkeyKongModule } from "../../games/DonkeyKong/donkeyKong"
import { DoomModule } from "../../games/DOOM/doom1"
import { GamesType } from "../../types/games"

export const resolveInitTarget = (game: GamesType) => {
    switch(game){
        case "crosstheroad": return CrossTheRoadModule.renderTarget
        case "doom": return DoomModule.renderTarget
        case "donkeykong": return DonkeyKongModule.renderTarget
    }
}