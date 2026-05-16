import { CrossTheRoadModule } from "../../games/CrossTheRoad/utils"
import { DonkeyKongModule } from "../../games/DonkeyKong/donkeyKong"
import { DoomModule } from "../../games/DOOM/doom1"
import { SpaceRabbitModule } from "../../games/SpaceRabbit/utils"
import { GamesType } from "../../types/games"

export const resolveInitTarget = (game: GamesType) => {
    switch(game){
        case "rabbit": return SpaceRabbitModule.renderTarget
        case "crosstheroad": return CrossTheRoadModule.renderTarget
        case "doom": return DoomModule.renderTarget
        case "donkeykong": return DonkeyKongModule.renderTarget
    }
}