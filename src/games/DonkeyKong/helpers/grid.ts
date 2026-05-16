export const gridCell = (n: number) => n * 8

export const isSpaceFree = (walls: Set<string>, x: number, y: number) => {
    
    const str = `${x},${y}`

    const isWall = walls.has(str)

    return !isWall
}