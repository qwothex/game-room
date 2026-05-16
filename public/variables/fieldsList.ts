import PlayingFieldType from "../../src/types/playingField";

export const FieldsList: PlayingFieldType[] = [
    {x: 0, z: 0},
    {x: 1, z: 0},
    {x: 2, z: 0},
    {x: 3, z: 0},
    {x: 4, z: 0},
    {x: 5, z: 0},
    {x: 6, z: 0},

    {x: 6, z: -1},
    {x: 6, z: -2, specialField: 'bonus', fieldName: 'React', discovered: false},
    {x: 6, z: -3},

    {x: 6, z: 1},
    {x: 6, z: 2},
    {x: 6, z: 3 , specialField: 'bonus', fieldName: 'Redux', discovered: false},

    {x: 2, z: -1},
    {x: 2, z: 1},
    {x: 2, z: 2, specialField: 'wrong'},
    {x: 2, z: 3},
    {x: 2, z: 4},
    {x: 2, z: 5},
    {x: 2, z: 6, specialField: 'bonus', fieldName: 'Git', discovered: false},

    {x: 3, z: 3, specialField: 'bonus', fieldName: 'TS', discovered: false},
    {x: 4, z: 3},
    {x: 4, z: 2},
    {x: 4, z: 1},
    {x: 4, z: 0},

    {x: 2, z: -2},
    {x: 1, z: -2},
    {x: 0, z: -2},
    {x: -1, z: -2, specialField: 'wrong'},

    {x: 1, z: -3, specialField: 'wrong'},
    {x: 3, z: -2},
    {x: 3, z: -3, specialField: 'bonus', fieldName: 'NodeJS', discovered: false},
    {x: 3, z: -4},
    {x: 2, z: -4},
    {x: 1, z: -4},
    {x: 0, z: -4},
    {x: -1, z: -4},
    {x: -2, z: -4},
    {x: -2, z: -3, specialField: 'bonus', fieldName: 'Three', discovered: false},
    {x: -2, z: -2},
]