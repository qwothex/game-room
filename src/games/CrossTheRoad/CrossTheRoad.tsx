import { FC, useEffect } from "react";
import { initializeGame, scene } from "./utils";
import * as THREE from 'three'
import { map } from "./Components/Map";
import { character } from "./Components/Character";

const CrossTheRoad:FC = () => {

    useEffect(() => {
            const ambientLight = new THREE.AmbientLight()
            scene.add(ambientLight)
            scene.add(character.character)
            scene.add(map)

            initializeGame()

            return () => {
                scene.remove(ambientLight)
                scene.remove(character.character)
                scene.remove(map)
            }
    }, [])
    
    return <></>
}

export default CrossTheRoad