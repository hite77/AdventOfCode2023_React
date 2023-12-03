import { match } from 'assert';
import { readFileSync } from 'fs';

// The newly-improved calibration document consists of lines of text; each line originally contained a specific
// calibration value that the Elves now need to recover. On each line, the calibration value can be found by combining
// the first digit and the last digit (in that order) to form a single two-digit number.

// For example:

// 1abc2
// pqr3stu8vwx
// a1b2c3d4e5f
// treb7uchet
// In this example, the calibration values of these four lines are 12, 38, 15, and 77. Adding these together produces 142.

// Consider your entire calibration document. What is the sum of all of the calibration values?


const totalLines = (lines: string[]): number => {
    return lines.reduce((acc, line) => acc += parseCalibration(line), 0)
}

const totalLinesPart2 = (lines: string[]): number => {
    return lines.reduce((acc, line) => acc += parseCalibrationPart2(line), 0)
}

const matches = {
    'one': '1',
    'two': '2',
    'three': '3',
    'four': '4',
    'five': '5',
    'six': '6',
    'seven': '7',
    'eight': '8',
    'nine': '9'
                }

const firstNumber = (line: string): string => {
    const firstChar = line.substring(0,1)
    if (firstChar >= '0' && firstChar <= '9') {
        return firstChar
    }
    return firstNumber(line.substring(1))
}

const firstNumberPart2 = (line: string): string => {
    const firstChar = line.substring(0,1)
    if (firstChar >= '0' && firstChar <= '9') {
        return firstChar
    } else {
        let matchOrNo = 'no'
        Object.keys(matches).forEach((numberString) => {
            if (line.indexOf(numberString) == 0) {
                matchOrNo = matches[numberString]
            }
        })
        if (matchOrNo != 'no') {
            return matchOrNo
        }
    }
    return firstNumberPart2(line.substring(1))
}

const lastNumber = (line: string): string => {
    const lastchar = line.substring(line.length-1)
    if (lastchar >= '0' && lastchar <= '9') {
        return lastchar
    }
    return lastNumber(line.substring(0,line.length-1))
}

const reversematches = {
    'eno': '1',
    'owt': '2',
    'eerht': '3',
    'ruof': '4',
    'evif': '5',
    'xis': '6',
    'neves': '7',
    'thgie': '8',
    'enin': '9'
                }

const reverse = (line: string) : string => {
    return line.split('').reverse().join('')
}

const lastNumberPart2 = (line: string): string => {
    const lastchar = line.substring(0,1)
    if (lastchar >= '0' && lastchar <= '9') {
        return lastchar
    }
    else {
        let matchOrNo = 'no'
        Object.keys(reversematches).forEach((numberString) => {
            if (line.indexOf(numberString) == 0) {
                matchOrNo = reversematches[numberString]
            }
        })
        if (matchOrNo != 'no') {
            return matchOrNo
        }
    }
    return lastNumberPart2(line.substring(1))
}

const parseCalibration = (line: string) : number => {
    const stringVersion = firstNumber(line) + lastNumber(line)
    return +stringVersion
}

const parseCalibrationPart2 = (line: string) : number => {
    const stringVersion = firstNumberPart2(line) + lastNumberPart2(reverse(line))
    return +stringVersion
}

const calculatePart1 = () : number => {
    const file = readFileSync('src/days/given1.txt', 'utf-8')
    return totalLines(file.split('\n'))
}

const calculatePart2 = () : number => {
    const file = readFileSync('src/days/given1.txt', 'utf-8')
    return totalLinesPart2(file.split('\n'))
}

  test('part 1 tests', () => {
    expect(parseCalibration('1abc2')).toBe(12)
    expect(parseCalibration('pqr3stu8vwx')).toBe(38)
    expect(parseCalibration('a1b2c3d4e5f')).toBe(15)
    expect(parseCalibration('treb7uchet')).toBe(77)
    expect(totalLines(['1abc2','pqr3stu8vwx','a1b2c3d4e5f','treb7uchet'])).toBe(142)
    expect(calculatePart1()).toBe(54630)
  })

//   Your calculation isn't quite right. It looks like some of the digits are actually spelled out with letters:
//   one, two, three, four, five, six, seven, eight, and nine also count as valid "digits".

//   Equipped with this new information, you now need to find the real first and last digit on each line.
//   For example:

//   two1nine
//   eightwothree
//   abcone2threexyz
//   xtwone3four
//   4nineeightseven2
//   zoneight234
//   7pqrstsixteen
//   In this example, the calibration values are 29, 83, 13, 24, 42, 14, and 76. Adding these together produces 281.

test('part 2 tests', () => {
    expect(parseCalibrationPart2('oneone')).toBe(11)
    expect(parseCalibrationPart2('twotwo')).toBe(22)
    expect(parseCalibrationPart2('threethree')).toBe(33)
    expect(parseCalibrationPart2('fourfour')).toBe(44)
    expect(parseCalibrationPart2('fivefive')).toBe(55)
    expect(parseCalibrationPart2('sixsix')).toBe(66)
    expect(parseCalibrationPart2('sevenseven')).toBe(77)
    expect(parseCalibrationPart2('eighteight')).toBe(88)
    expect(parseCalibrationPart2('nine11nine')).toBe(99)

    expect(parseCalibrationPart2('two1nine')).toBe(29)
    expect(parseCalibrationPart2('eightwothree')).toBe(83)
    expect(parseCalibrationPart2('abcone2threexyz')).toBe(13)
    expect(parseCalibrationPart2('xtwone3four')).toBe(24)
    expect(parseCalibrationPart2('4nineeightseven2')).toBe(42)
    expect(parseCalibrationPart2('zoneight234')).toBe(14)
    expect(parseCalibrationPart2('7pqrstsixteen')).toBe(76)
    expect(totalLinesPart2(['two1nine','eightwothree','abcone2threexyz','xtwone3four','4nineeightseven2','zoneight234','7pqrstsixteen'])).toBe(281)
    expect(calculatePart2()).toBe(54770)
  })