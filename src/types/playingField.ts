// type Dependant<A extends string, B extends string, C extends string> = 
//     | { [K in A]?: undefined } & { [K in B]?: undefined }
//     | { [K in A]: 'wrong' } & { [K in B]?: typeof techSkills[number] }
//     | { [K in A]: 'bonus' } & { [K in B]: typeof techSkills[number] } & { [K in C]: boolean };

// type baseFields = {
//     x: number,
//     z: number
// }
// type PlayingFieldType = baseFields & Dependant<'specialField', 'fieldName', 'discovered'>

// export default PlayingFieldType