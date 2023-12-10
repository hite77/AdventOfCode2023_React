// The Elf leads you over to the pile of colorful cards. There, you discover dozens of scratchcards, all with their opaque
// covering already scratched off. Picking one up, it looks like each card has two lists of numbers separated by a
// vertical bar (|): a list of winning numbers and then a list of numbers you have. You organize the information into a
// table (your puzzle input).

import { readFileSync } from "fs"

// As far as the Elf has been able to figure out, you have to figure out which of the numbers you have appear in the list of
// winning numbers. The first match makes the card worth one point and each match after the first doubles the point value of that
// card.

// For example:

// Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
// Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
// Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
// Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
// Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
// Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11
// In the above example, card 1 has five winning numbers (41, 48, 83, 86, and 17) and eight numbers
// you have (83, 86, 6, 31, 17, 9, 48, and 53).
// Of the numbers you have, four of them (48, 83, 17, and 86) are winning numbers!
// That means card 1 is worth 8 points (1 for the first match, then doubled three times for each of the three matches after the
//     first).

// Card 2 has two winning numbers (32 and 61), so it is worth 2 points.
// Card 3 has two winning numbers (1 and 21), so it is worth 2 points.
// Card 4 has one winning number (84), so it is worth 1 point.
// Card 5 has no winning numbers, so it is worth no points.
// Card 6 has no winning numbers, so it is worth no points.
// So, in this example, the Elf's pile of scratchcards is worth 13 points.

// Take a seat in the large pile of colorful cards. How many points are they worth in total?

interface card {
    card_number: number
    winners: number[]
    myNumbers: number[]
}

const parseLine = (lineText: string) : card => {
    const cardwordAndNumber = lineText.split(':')[0]
    const card_number = cardwordAndNumber.split('Card')[1]
    const afterColon = lineText.split(':')[1]
    const winnersString = afterColon.split('|')[0]
    const winners = winnersString.trim().split(/[ ]+/).map((item) => (+item))
    const myNumbers = lineText.split('|')[1].trim().split(/[ ]+/).map((item) => (+item))
    return {card_number:+card_number, winners, myNumbers}
}

const scoreCard = ({winners, myNumbers} : card) : number => {
    let points = 0
    myNumbers.forEach((myNumber) => {
        if (winners.includes(myNumber)) {
            if (points === 0) {
                points = 1
            } else {
                points *= 2
            }
        }
    })
    return points
}

const howManyCardsFromCard = ({winners, myNumbers} : card) : number => {
    let cardsCreated = 0
    myNumbers.forEach((myNumber) => {
        if (winners.includes(myNumber)) {
            cardsCreated += 1
        }
    })
    return cardsCreated
}

const scoreAll = (cardsText: string[]) : number => {
    const cards: card[] = cardsText.map((line) => parseLine(line))
    const score: number = cards.map((card) => scoreCard(card)).reduce((accum, score) => accum += score,0)
    return score
}

interface counts {
    [cardNumber: number]: number
}

const countCreatedCards = (cardsText: string[]) : number => {
    const cards: card[] = cardsText.map((line) => parseLine(line))
    let cardCounts: counts = {}
    cards.forEach((card) => {
        cardCounts[card.card_number] = 1
    })
    cards.forEach((card) => {
        const countMatches = howManyCardsFromCard(card)
        const currentCardCount = cardCounts[card.card_number]
        for(let loopcount: number = 1; loopcount <= countMatches; loopcount++) {
            cardCounts[card.card_number+loopcount] += currentCardCount
        }
    })
    let totalCounts = 0
    Object.values(cardCounts).forEach((count) => {
        totalCounts += count
    })
    return totalCounts
}

const part1 = () => {
    const file = readFileSync('src/days/given4.txt', 'utf-8')
    return scoreAll(file.split('\n'))
}

const part2 = () => {
    const file = readFileSync('src/days/given4.txt', 'utf-8')
    return countCreatedCards(file.split('\n'))
}

test('parsing test', () => {
    expect(parseLine('Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53')).toStrictEqual({card_number: 1, winners: [41,48,83,86,17], myNumbers: [83,86,6,31,17,9,48,53]})
    expect(parseLine('Card   1: 91 73 74 57 24 99 31 70 60  8 | 89 70 43 24 62 30 91 87 60 57 90  2 27  3 31 25 39 83 64 73 99  8 74 37 49')).toStrictEqual({card_number: 1, winners: [91, 73, 74, 57, 24, 99, 31, 70, 60, 8], myNumbers: [89, 70, 43, 24, 62, 30, 91, 87, 60, 57, 90, 2, 27, 3, 31, 25, 39, 83, 64, 73, 99, 8, 74, 37, 49]})
})

test('score a card', () => {
    expect(scoreCard({card_number: 1, winners: [41,48,83,86,17], myNumbers: [83,86,6,31,17,9,48,53]})).toBe(8)
})

test('scoreAll totals all', () => {
    expect(scoreAll([
        'Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53',
        'Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19'
    ])).toBe(10)
})

test('part 1', () => {
    expect(part1()).toBe(20855)
})

test('part 2', () => {
    expect(part2()).toBe(5489600)
})

test('how many cards for card', () => {
    expect(howManyCardsFromCard({card_number: 1, winners: [41,48,83,86,17], myNumbers: [83,86,6,31,17,9,48,53]})).toBe(4)
})

test('count cards after creating for example', () => {
    expect(countCreatedCards(
        [
            'Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53',
            'Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19',
            'Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1',
            'Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83',
            'Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36',
            'Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11'
        ])).toBe(30)
})

// There's no such thing as "points". Instead, scratchcards only cause you to win more scratchcards equal to the number of
// winning numbers you have.

// Specifically, you win copies of the scratchcards below the winning card equal to the number of matches. So, if card 10 were
// to have 5 matching numbers, you would win one copy each of cards 11, 12, 13, 14, and 15.

// Copies of scratchcards are scored like normal scratchcards and have the same card number as the card they copied.
// So, if you win a copy of card 10 and it has 5 matching numbers,
// it would then win a copy of the same cards that the original card 10 won: cards 11, 12, 13, 14, and 15.
// This process repeats until none of the copies cause you to win any more cards.
// (Cards will never make you copy a card past the end of the table.)

// This time, the above example goes differently:

// Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
// Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
// Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
// Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
// Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
// Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11

// Card 1 has four matching numbers, so you win one copy each of the next four cards: cards 2, 3, 4, and 5. (8 points 4 matches)
// Your original card 2 has two matching numbers, so you win one copy each of cards 3 and 4.(2 matches)
// Your copy of card 2 also wins one copy each of cards 3 and 4. (2 matches to copy)
// Your four instances of card 3 (one original and three copies) have two matching numbers,
// so you win four copies each of cards 4 and 5. (2 matches)
// Your eight instances of card 4 (one original and seven copies) have one matching number, so you win eight copies of card 5.
// Your fourteen instances of card 5 (one original and thirteen copies) have no matching numbers and win no more cards.
// Your one instance of card 6 (one original) has no matching numbers and wins no more cards.

// Once all of the originals and copies have been processed, you end up with 1 instance of card 1, 2 instances of card 2,
// 4 instances of card 3, 8 instances of card 4, 14 instances of card 5, and 1 instance of card 6.

// In total, this example pile of scratchcards causes you to ultimately have 30 scratchcards!

// Process all of the original and copied scratchcards until no more scratchcards are won.
// Including the original set of scratchcards, how many total scratchcards do you end up with?

// Matches earn that many copies 4 from card 1 builds a copy of 2, 3, 4, 5

// Card number: number, copies: number

// At the end total them all up for the answer.

