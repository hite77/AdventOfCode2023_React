import { readFileSync } from "fs"

const parse = (line: string): {gameNumber: number, blue: number, red: number, green: number} => {
    const splitUp = line.split(/[,:;]+/)
    const gameNumber = +splitUp[0].split('Game ')[1]
    let blue = 0,red= 0, green= 0
    splitUp.forEach((possibleColor) => {
        if (possibleColor.indexOf('green') != -1) {
            const currentValueGreen: number = +possibleColor.split('green')[0]
            if (currentValueGreen > green) {
                green = +currentValueGreen
            }
        }
        if (possibleColor.indexOf('blue') != -1) {
            const currentValueBlue: number = +possibleColor.split('blue')[0]
            if (currentValueBlue > blue) {
                blue = currentValueBlue
            }
        }
        if (possibleColor.indexOf('red') != -1) {
            const currentValueRed: number = +possibleColor.split('red')[0]
            if (currentValueRed > red) {
                red = currentValueRed
            }
        }
    })
    return {gameNumber, blue, red, green}
}

const part1Example = [
    'Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green',
'Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue',
'Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red',
'Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red',
'Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green'
]

const totalUpPossibleGames = (games: string[]) => {
    // only 12 red cubes, 13 green cubes, and 14 blue cubes
    let total = 0
    games.forEach((game) => {
        const {gameNumber, blue, red, green } = parse(game)
        if (red <= 12 && green <= 13 && blue <= 14) {
            total += gameNumber
        }
    })
    return total
}

const calculatePower = (games: string[]) => {
    let power = 0
    games.forEach((game) => {
        const {blue, red, green } = parse(game)
        power += (blue * red * green)
    })
    return power
}

const part1solution = () => {
    const file = readFileSync('src/days/given2.txt', 'utf-8')
    return totalUpPossibleGames(file.split('\n'))
}

const part2solution = () => {
    const file = readFileSync('src/days/given2.txt', 'utf-8')
    return calculatePower(file.split('\n'))
}

test('part1 test', () => {
    expect(parse('Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green')).toStrictEqual({gameNumber:1, blue: 6, red: 4, green: 2})
    expect(parse('Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue')).toStrictEqual({gameNumber:2, blue: 4, red: 1, green: 3})
    expect(totalUpPossibleGames(part1Example)).toBe(8)
    expect(part1solution()).toBe(3059)
})

test('part2 test', () => {
    expect(calculatePower(part1Example)).toBe(2286)
    expect(part2solution()).toBe(65371)
})