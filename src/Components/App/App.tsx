import { useState } from "react"
import CrossTheRoad from "../../games/CrossTheRoad/CrossTheRoad"
import WorkingPlace from "../WorkingPlace/WorkingPlace"
import { GamesType } from "../../types/games"
import Overlay from "../Overlay/Overlay"
import Modal from "../Modal/Modal"

const App = () => {

    const [currentGame, setCurrentGame] = useState<GamesType>('donkeykong')

    return(
        <>
            <Modal />
            <Overlay />
            <WorkingPlace game={currentGame} setGame={setCurrentGame} />
            {currentGame === 'crosstheroad' && <CrossTheRoad />}
        </>
    )
}

export default App