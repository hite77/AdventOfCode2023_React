// The engineer explains that an engine part seems to be
// missing from the engine, but nobody can figure out
// which one. If you can add up all the part numbers in
// the engine schematic, it should be easy to work out
// which part is missing.

import { group } from "console"
import { readFileSync } from "fs"

// The engine schematic (your puzzle input) consists of a
// visual representation of the engine. There are lots of
// numbers and symbols you don't really understand, but
// apparently any number adjacent to a symbol, even
// diagonally, is a "part number" and should be included
// in your sum. (Periods (.) do not count as a symbol.)

// Here is an example engine schematic:

// 467..114..
// ...*......
// ..35..633.
// ......#...
// 617*......
// .....+.58.
// ..592.....
// ......755.
// ...$.*....
// .664.598..
// In this schematic, two numbers are not part numbers
// because they are not adjacent to a symbol:
// 114 (top right) and 58 (middle right).
// Every other number is adjacent to a symbol and so is a
// part number; their sum is 4361.

// Of course, the actual engine schematic is much larger.
// What is the sum of all of the part numbers in the
// engine schematic?

// TODO: fix typescript, not so easy. (Don't need the replaceAll after all.)
// const replaceDotsWithSpaces = (input: string[]): string[] => {
//     return input.map((line) => line.replaceAll('.',' '))
// }

// Remve the dots....
// split on spaces will get numbers and characters....
// to get coords have the original string (or space string)
// and find index of each, with the row....
// key on non number characters and find entries that have correct
// coordinates (edges should not index off...)
// keys are coordinates...

// Cycle through numbers and should find 467 is included...
// key is number values are coordinates.

// [0,0, 1,0, 2,0] => 467
// [5,0, 6,0, 7,0] => 114

// [3,1] => '*'


const buildNumbersLocations = (input: string[]) => {

    let numberPositions : {parsedNum: number, coords: number[][]}[] = []
    input.forEach((line, index) => {
        let searchStart = 0
        line.trim().split(/[.]+/).forEach((grouping) => {
            let numberGroups: string[] = []
            if (grouping.match(/(\d+)[^\d](\d+)/)) {
                let groups = grouping.match(/(\d+)[^\d](\d+)/)
                numberGroups = [groups![1],groups![2]]
            } else if (grouping.match(/(\d+)/)) {
                numberGroups = [grouping.match(/(\d+)/)![0]]
            }
            numberGroups.forEach((number) =>  {
                searchStart = line.indexOf(number, searchStart)
                let coordinates: number[][] = []
                for (let i = searchStart; i < searchStart+number.length; i++) {
                    coordinates = coordinates.concat([[i,index]])
                }
                numberPositions = numberPositions.concat({parsedNum: +number,coords: coordinates})
                searchStart += number.length            })
        })
    })
   return numberPositions
}

const buildSymbols = (input: string[]) => {
    let symbolPositions = {}
    input.forEach((line, index) => {
        let searchStart = 0
        line.trim().split(/[.]+/).forEach((grouping) => {
            let matches = grouping.match(/[^\d]/)
            if (matches) {
                searchStart = line.indexOf(matches[0], searchStart)
                symbolPositions[searchStart.toString()+','+(index).toString()] = matches[0]
                searchStart += 1
            }
        })
    })
    return symbolPositions
}

const distanceWithinOne = (x1: number, y1: number, x2: number, y2: number): boolean => {
    if ((Math.abs(x1-x2) <= 1) && (Math.abs(y1-y2) <= 1)) {
        return true
    }
    return false
}

const extractGears = (symbols): number[][] => {
    let coordinates: number[][] = []
    Object.keys(symbols).forEach((coordString) => {
        if (symbols[coordString] === '*') {
            const splitString = coordString.split(',')
            const x: number = +splitString[0]
            const y: number = +splitString[1]
            coordinates = coordinates.concat([[x,y]])
        }
    })
    return coordinates
}

const extractSymbolPositions = (symbols): number[][] => {
    let coordinates: number[][] = []
    Object.keys(symbols).forEach((coordString) => {
        const splitString = coordString.split(',')
        const x: number = +splitString[0]
        const y: number = +splitString[1]
        coordinates = coordinates.concat([[x,y]])
    })
    return coordinates
}

const part1solution = () => {
    const file = readFileSync('src/days/given3.txt', 'utf-8')
    return totalUpPartNumbersNearSymbol(file.split('\n'))
}

const totalUpPartNumbersNearSymbol = (data: string[]) : number => {
    const numberPositions = buildNumbersLocations(data)
    const symbolPositions = buildSymbols(data)
    let total = 0
    const symbolCoords = extractSymbolPositions(symbolPositions)
    numberPositions.forEach((numberAndCoords) => {
        let closeEnough = false
        const {parsedNum, coords} = numberAndCoords
        coords.forEach(([x,y]) => {
            symbolCoords.forEach(([x2, y2]) => {
                if (distanceWithinOne(x,y,x2,y2)) {
                    closeEnough = true
                }
            })
        })
        if (closeEnough) {
            total += parsedNum
        }
    })
    return total
}

const part2solution = () => {
    const file = readFileSync('src/days/given3.txt', 'utf-8')
    return multiplyAndAddGears(file.split('\n'))
}

// find * symbols see if two numbers close to it.  Multiple and add together.
const multiplyAndAddGears = (data: string[]) => {
    const numberPositions = buildNumbersLocations(data)
    const symbolPositions = buildSymbols(data)
    let total = 0
    const gearCoords = extractGears(symbolPositions)
    gearCoords.forEach(([xgear,ygear]) => {
        let numbersAttached : number[] = []
        numberPositions.forEach((numberAndCoords) => {
            const {parsedNum, coords} = numberAndCoords
            let foundMatchForNumber = false
            coords.forEach(([x,y]) => {
                if (distanceWithinOne(xgear,ygear,x,y)) {
                    foundMatchForNumber = true
                }
            })
            if (foundMatchForNumber) {
                numbersAttached = numbersAttached.concat([parsedNum])
            }

        })
        if (numbersAttached.length === 2) {
            const multiplierToAdd = numbersAttached[0] * numbersAttached[1]
            total += multiplierToAdd
        }
    })
    return total
}

const exampleData: string[] = [
'467..114..',
'...*......',
'..35..633.',
'......#...',
'617*......',
'.....+.58.',
'..592.....',
'......755.',
'...$.*....',
'.664.598..'
]

test('All test', () => {
    expect(buildNumbersLocations(['467...123'])).toStrictEqual([{parsedNum: 467, coords:[[0, 0], [1, 0], [2, 0]]}, {parsedNum: 123, coords:[[6, 0], [7, 0], [8, 0]]}])
    expect(buildNumbersLocations(['.467....123'])).toStrictEqual([{parsedNum: 467, coords:[[1, 0], [2, 0], [3, 0]]}, {parsedNum: 123, coords:[[8, 0], [9, 0], [10, 0]]}])
    expect(buildNumbersLocations(['.467....467'])).toStrictEqual([{parsedNum: 467, coords: [[1, 0], [2, 0], [3, 0]]}, {parsedNum: 467, coords:[[8, 0], [9, 0], [10, 0]]}])
    expect(buildNumbersLocations(['','.467.*.?123'])).toStrictEqual([{parsedNum: 467, coords: [[1, 1], [2, 1], [3, 1]]}, {parsedNum: 123, coords:[[8, 1], [9, 1], [10, 1]]}])
    expect(buildNumbersLocations(['','.467.*.?123'])).toStrictEqual([{parsedNum: 467, coords: [[1, 1], [2, 1], [3, 1]]}, {parsedNum: 123, coords:[[8, 1], [9, 1], [10, 1]]}])
    expect(buildNumbersLocations(['12*34'])).toStrictEqual([{parsedNum: 12, coords:[[0,0], [1,0]]}, {parsedNum: 34, coords: [[3,0], [4,0]]}])
    expect(buildNumbersLocations(['*1234'])).toStrictEqual([{parsedNum: 1234, coords:[[1,0], [2,0],[3,0],[4,0]]}])
    expect(buildNumbersLocations(['1234*..*12..1*5'])).toStrictEqual([{parsedNum: 1234, coords:[[0,0], [1,0],[2,0],[3,0]]}, {parsedNum: 12, coords:[[8,0],[9,0]]}, {parsedNum: 1, coords:[[12,0]]}, {parsedNum: 5, coords:[[14,0]]}])
    expect(buildNumbersLocations(['12*3','..*.'])).toStrictEqual([{parsedNum: 12, coords:[[0,0],[1,0]]}, {parsedNum: 3, coords: [[3,0]]}])
    expect(buildNumbersLocations(['232.......*2'])).toStrictEqual([{parsedNum: 232, coords:[[0,0],[1,0],[2,0]]}, {parsedNum: 2, coords: [[11,0]]}])

    expect(buildSymbols(['','.467..*.?123'])).toStrictEqual({"6,1": "*","8,1": "?"})
    expect(buildSymbols(['.467..*.*123'])).toStrictEqual({"6,0": "*","8,0": "*"})
    expect(buildSymbols(['.467..*.123*'])).toStrictEqual({"6,0": "*","11,0": "*"})
    expect(buildSymbols(['.467*123..*'])).toStrictEqual({"4,0": "*","10,0": "*"})
    expect(buildSymbols(['.*467..*'])).toStrictEqual({"1,0": "*","7,0": "*"})
    expect(buildSymbols(['467*..*'])).toStrictEqual({"3,0": "*","6,0": "*"})
    expect(buildSymbols(['1234*..*12..1*5'])).toStrictEqual({"4,0": "*","7,0": "*","13,0": "*"})
    expect(buildSymbols(['12*3','..*.'])).toStrictEqual({"2,0": "*","2,1": "*"})

    expect(distanceWithinOne(1,1,2,2)).toBe(true)
    expect(distanceWithinOne(1,1,3,1)).toBe(false)
    expect(distanceWithinOne(1,1,-1,1)).toBe(false)
    expect(totalUpPartNumbersNearSymbol(
        ['....16?10.23',
         '22?.?.....1.',
         '.....7......']
        )).toBe(16+22+7+10)
    expect(totalUpPartNumbersNearSymbol(exampleData)).toBe(4361)
    expect(part1solution()).toBe(531932)
    // 174557 too low....
    // 312785 that is not right either...
    // 526195 not right either.

    expect(multiplyAndAddGears([
        '*2.....12*3.',
        '1..*363..*.',
        '.5*7.*.*.*..',
        '.....2*..'
    ])).toBe((2*1)+(12*3)+(363*2)+(5*7)+(363*7)+(12*3))
    expect(multiplyAndAddGears([
        '12?14.....',
        '1..#....17',
        '.......*..',
        '.....15..'
    ])).toBe((15*17))
    expect(multiplyAndAddGears([
        '*143......2*',
        '.1..?363.17',
        '.......#..345*226',
        '1..15.......',
        '...*.....?.43',
        '232.......*2'
    ])).toBe((143)+(15*232)+(2*17)+(43*2)+(345*226))
    expect(multiplyAndAddGears([
        '?143......2#',
        '.1..?363.17',
        '.......#..345$226',
        '1..15.......',
        '...#.....?.43',
        '232.......*2'
    ])).toBe((43*2))
    expect(multiplyAndAddGears([
        '1..15.......',
        '...#.....?.43',
        '232.......*2'
    ])).toBe((43*2))

    expect(multiplyAndAddGears(exampleData)).toBe(467835)
    expect(part2solution()).toBe(73646890)
    // 73616869 too low
    // 73646890
})