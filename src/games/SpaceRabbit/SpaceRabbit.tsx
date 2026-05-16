import * as THREE from 'three'
import { FieldsList } from '../../../public/variables/fieldsList';
import PlayingFieldType from '../../types/playingField';
import { FC, useEffect } from 'react';
import { rabbitScreenScene as screenScene } from './utils';
import { confetti2D } from '../../utils/confettiBurst';

const SpaceRabbit:FC = () => {

    useEffect(() => {

        const init = () => {

            confetti2D.init()

            const screenDirectionalLight = new THREE.DirectionalLight(0xFFFFFF, 1)
                screenDirectionalLight.position.set(1,1,4)
                screenScene.add(screenDirectionalLight)

            screenScene.add(new THREE.AmbientLight(0xffffff, 0.3));

            const unknownMaterial = [
                new THREE.MeshBasicMaterial({ color: 0x696868 }),
                new THREE.MeshBasicMaterial({ color: 0xababab }),
                new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('images/unknown.png'), color: 0xc3c3c3 }),
                new THREE.MeshBasicMaterial({ color: 0xababab }),
                new THREE.MeshBasicMaterial({ color: 0xababab}),
                new THREE.MeshBasicMaterial({ color: 0xababab })
            ];

            const defaultMaterial = [
                new THREE.MeshBasicMaterial({ color: 0x696868 }), // right
                new THREE.MeshBasicMaterial({ color: 0xababab }), // left
                new THREE.MeshBasicMaterial({ color: 0x737373 }), // top
                new THREE.MeshBasicMaterial({ color: 0xababab }), // bottom
                new THREE.MeshBasicMaterial({ color: 0xababab}),  // front
                new THREE.MeshBasicMaterial({ color: 0xababab })  // back
            ];

            const meshInstance = ({x, z, specialField}: PlayingFieldType) => {
                const mesh = new THREE.Mesh(
                    new THREE.BoxGeometry(0.9, 0.1, 0.9),
                    specialField === 'bonus' || specialField === 'wrong'
                        ? unknownMaterial
                        : defaultMaterial
                );

                mesh.position.set(x,0,z)
                mesh.name = `${x}${z}`

                screenScene.add(mesh)
            }

            // screenScene.add(new THREE.AxesHelper(3));
            // screenScene.add(new THREE.GridHelper(20, 10));

            const createFields = (coords: PlayingFieldType[]) => {
                coords.forEach((entry) => {
                    meshInstance({...entry});
                })
            }
            
            createFields(FieldsList)
        }

        init()

        return () => confetti2D.destroy()

    }, [])

    return <></>
}

export default SpaceRabbit