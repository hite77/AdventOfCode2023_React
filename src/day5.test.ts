// The almanac (your puzzle input) lists all of the seeds that need to be planted.
// It also lists what type of soil to use with each kind of seed, what type of fertilizer to use with each kind of soil,
// what type of water to use with each kind of fertilizer, and so on.
// Every type of seed, soil, fertilizer and so on is identified with a number, but numbers are reused by each category -
// that is, soil 123 and fertilizer 123 aren't necessarily related to each other.

import { readFileSync } from "fs"

// For example:
// Starts next line vvvvvvvvvvv
// seeds: 79 14 55 13

// seed-to-soil map:
// 50 98 2
// 52 50 48

// soil-to-fertilizer map:
// 0 15 37
// 37 52 2
// 39 0 15

// fertilizer-to-water map:
// 49 53 8
// 0 11 42
// 42 0 7
// 57 7 4

// water-to-light map:
// 88 18 7
// 18 25 70

// light-to-temperature map:
// 45 77 23
// 81 45 19
// 68 64 13

// temperature-to-humidity map:
// 0 69 1
// 1 0 69

// humidity-to-location map:
// 60 56 37
// 56 93 4
// The almanac starts by listing which seeds need to be planted: seeds 79, 14, 55, and 13.

// The rest of the almanac contains a list of maps which describe how to convert numbers from a source category into numbers
// in a destination category. That is, the section that starts with seed-to-soil map: describes how to convert a seed number
// (the source) to a soil number (the destination). This lets the gardener and his team know which soil to use with which seeds,
// which water to use with which fertilizer, and so on.

// Rather than list every source number and its corresponding destination number one by one, the maps describe entire ranges
// of numbers that can be converted.
// Each line within a map contains three numbers: the destination range start, the source range start, and the range length.

// Consider again the example seed-to-soil map:

// 50 98 2
// 52 50 48
// The first line has a destination range start of 50, a source range start of 98, and a range length of 2.
// This line means that the source range starts at 98 and contains two values: 98 and 99.
// The destination range is the same length, but it starts at 50, so its two values are 50 and 51.
// With this information, you know that seed number 98 corresponds to soil number 50 and that seed number 99
// corresponds to soil number 51.

// The second line means that the source range starts at 50 and contains 48 values: 50, 51, ..., 96, 97.
// This corresponds to a destination range starting at 52 and also containing 48 values: 52, 53, ..., 98, 99.
// So, seed number 53 corresponds to soil number 55.

// Any source numbers that aren't mapped correspond to the same destination number.
// So, seed number 10 corresponds to soil number 10.

// So, the entire list of seed numbers and their corresponding soil numbers looks like this:

// seed  soil
// 0     0
// 1     1
// ...   ...
// 48    48
// 49    49
// 50    52
// 51    53
// ...   ...
// 96    98
// 97    99
// 98    50
// 99    51
// With this map, you can look up the soil number required for each initial seed number:

// Seed number 79 corresponds to soil number 81.
// Seed number 14 corresponds to soil number 14.
// Seed number 55 corresponds to soil number 57.
// Seed number 13 corresponds to soil number 13.
// The gardener and his team want to get started as soon as possible, so they'd like to know the closest location that needs a seed.
// Using these maps, find the lowest location number that corresponds to any of the initial seeds.
// To do this, you'll need to convert each seed number through other categories until you can find its corresponding location number.
// In this example, the corresponding types are:

// Seed 79, soil 81, fertilizer 81, water 81, light 74, temperature 78, humidity 78, location 82.
// Seed 14, soil 14, fertilizer 53, water 49, light 42, temperature 42, humidity 43, location 43.
// Seed 55, soil 57, fertilizer 57, water 53, light 46, temperature 82, humidity 82, location 86.
// Seed 13, soil 13, fertilizer 52, water 41, light 34, temperature 34, humidity 35, location 35.
// So, the lowest location number in this example is 35.

// What is the lowest location number that corresponds to any of the initial seed numbers?

// destination source count
const example = [
    'seeds: 79 14 55 13',
    ' ',
    'seed-to-soil map:',
    '50 98 2',
    '52 50 48',
    ' ',
    'soil-to-fertilizer map:',
    '0 15 37',
    '37 52 2',
    '39 0 15',
    ' ',
    'fertilizer-to-water map:',
    '49 53 8',
    '0 11 42',
    '42 0 7',
    '57 7 4',
    ' ',
    'water-to-light map:',
    '88 18 7',
    '18 25 70',
    ' ',
    'light-to-temperature map:',
    '45 77 23',
    '81 45 19',
    '68 64 13',
    ' ',
    'temperature-to-humidity map:',
    '0 69 1',
    '1 0 69',
    ' ',
    'humidity-to-location map:',
    '60 56 37',
    '56 93 4'
]

interface transitionMap {
    destination: number
    source: number
    count: number
}

const parse = (lines: string[]) : {seeds: number[], maps: transitionMap[][]} => {
    let seeds: number[] = []
    let maps: transitionMap[][] = []
    let currentMap: transitionMap[] = []
    lines.forEach((line) => {
        if (line.includes('seeds')) {
            seeds = line.split('seeds:')[1].trim().split(' ').map((seed) => +seed)
        } else if (line.trim() === '') {
            if (currentMap.length > 0) {
                maps.push(currentMap)
                currentMap = []
            }
        } else if (!line.includes('map:')) {
            const numbers = line.split(' ').map((item) => +item)
            currentMap.push({destination: numbers[0], source: numbers[1], count: numbers[2]})
        }
    })
    if (currentMap.length > 0) {
        maps.push(currentMap)
    }
    return {seeds, maps}
}

const apply_map = (map: transitionMap[], currentNumber: number) : number => {
    let return_value : number = currentNumber
    map.forEach((translation) => {
        if (translation.source <= currentNumber && (translation.source + translation.count) > currentNumber) {
            return_value = currentNumber - translation.source + translation.destination
        }
    })
    return return_value
}

const part1 = (lines: string[]) : number => {
    const {seeds, maps} = parse(lines)
    let lowest
    seeds.forEach((seed) => {
        let currentValue = seed
        maps.forEach((map) => {
            currentValue = apply_map(map, currentValue)
        })
        if (lowest === undefined || currentValue < lowest) {
            lowest = currentValue
        }
    })
    return lowest
}

const solvePart1 = () => {
    const file = readFileSync('src/days/given5.txt', 'utf-8')
    return part1(file.split('\n'))
}

test('parsing seeds', () => {
    expect(parse(example)['seeds']).toStrictEqual([79, 14, 55, 13])
})

test('parsing maps', () => {
    const expectedMaps : transitionMap[][] = [
        [
            {destination: 50, source: 98, count: 2},
            {destination: 52, source: 50, count: 48}
        ],
        [
            {destination: 0, source: 15, count: 37},
            {destination: 37, source: 52, count: 2},
            {destination: 39, source: 0, count: 15}
        ],
        [
            {destination: 49, source: 53, count: 8},
            {destination: 0, source: 11, count: 42},
            {destination: 42, source: 0, count: 7},
            {destination: 57, source: 7, count: 4}
        ],
        [
            {destination: 88, source: 18, count: 7},
            {destination: 18, source: 25, count: 70}
        ],
        [
            {destination: 45, source: 77, count: 23},
            {destination: 81, source: 45, count: 19},
            {destination: 68, source: 64, count: 13}
        ],
        [
            {destination: 0, source: 69, count: 1},
            {destination: 1, source: 0, count: 69}
        ],
        [
            {destination: 60, source: 56, count: 37},
            {destination: 56, source: 93, count: 4}
        ]
    ]
    expect(parse(example)['maps']).toStrictEqual(expectedMaps)
})

test('apply map', () => {
    const exampleMap = [{destination: 50, source: 98, count: 2},
                        {destination: 52, source: 50, count: 48}]
    expect(apply_map(exampleMap, 10)).toBe(10)
    expect(apply_map(exampleMap, 96)).toBe(98)
    expect(apply_map(exampleMap, 97)).toBe(99)
    expect(apply_map(exampleMap, 98)).toBe(50)
    expect(apply_map(exampleMap, 99)).toBe(51)
    expect(apply_map(exampleMap, 99)).toBe(51)
    expect(apply_map(exampleMap, 50)).toBe(52)
    expect(apply_map(exampleMap, 51)).toBe(53)
    expect(apply_map(exampleMap, 53)).toBe(55)
})

test('part1 example', () => {
    expect(part1(example)).toBe(35)
})

test('part1 solution', () => {
    expect(solvePart1()).toBe(261668924)
})
