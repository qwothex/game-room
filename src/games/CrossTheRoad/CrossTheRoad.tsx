import { FC, useEffect } from "react";
import { initializeGame, scene } from "./utils";
import * as THREE from 'three'
import { map } from "./Components/Map";
import { character } from "./Components/Character";
import { camera } from "./Components/Camera";

const CrossTheRoad:FC = () => {

    useEffect(() => {

            const ambientLight = new THREE.AmbientLight()
            scene.add(ambientLight)
            
            character.character.add(camera)
            
            scene.add(character.character)
            
            scene.add(map)
            
            initializeGame()

    }, [])
    
    return <></>
}

export default CrossTheRoad