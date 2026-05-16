import { useState } from "react"
import CrossTheRoad from "../../games/CrossTheRoad/CrossTheRoad"
import SpaceRabbit from "../../games/SpaceRabbit/SpaceRabbit"
import WorkingPlace from "../WorkingPlace/WorkingPlace"
import { GamesType } from "../../types/games"

const App = () => {

    const [currentGame, setCurrentGame] = useState<GamesType>('donkeykong')

    return(
        <>
            <WorkingPlace game={currentGame} setGame={setCurrentGame} />
            {currentGame === 'rabbit' && <SpaceRabbit />}
            {currentGame === 'crosstheroad' && <CrossTheRoad />}
        </>
    )
}

export default App