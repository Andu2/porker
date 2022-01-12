import { CARDS, CHAR_LINKS } from "./cards";

const MULTS = {
	"Royal Flush!!!": 2000,
	"Straight Flush!!": 1000,
	"Four of a Kind!!": 250,
	"Full House!": 100,
	"Flush!": 75,
	"Straight!": 50,
	"Three of a Kind": 25,
	"Two Pair": 15,
	"One Pair": 10,
	"No Pair": 1
}

const LINK_BONUS = 1000;

function memoize(fn) {
	let lookupTable = {};
	return function() {
		let argString = JSON.stringify(arguments);
		if (!lookupTable[argString]) {
			let result = fn.apply(null, arguments);
			lookupTable[argString] = result;
		}
		return lookupTable[argString];
	}
}

let combination = memoize(function(n, r) {
	let result = 1;
	for (let i = 1; i <= r; i++) {
		result = result * (n - i + 1) / i;
	}
	return result;
});

function getSuitCountObject() {
	return {
		"c": 0,
		"d": 0,
		"h": 0,
		"s": 0
	};
}

function getNumberCountObject() {
	return {
		1: 0,
		2: 0,
		3: 0,
		4: 0,
		5: 0,
		6: 0,
		7: 0,
		8: 0,
		9: 0,
		10: 0,
		11: 0,
		12: 0,
		13: 0
	};
}

function handHasOnePair(handObj) {
	let numberCounts = getNumberCountObject();
	for (let i = 0; i < handObj.length; i++) {
		numberCounts[handObj[i].number]++;
		if (numberCounts[handObj[i].number] >= 2) {
			return true;
		}
	}
}

function handHasTwoPair(handObj) {
	let numberCounts = getNumberCountObject();
	for (let i = 0; i < handObj.length; i++) {
		numberCounts[handObj[i].number]++;
	}
	let pairs = 0;
	for (let number in numberCounts) {
		if (numberCounts[number] >= 2) {
			pairs++;
			if (pairs >= 2) return true;
		}
	}
}

function handHasThreeOfAKind(handObj) {
	let numberCounts = getNumberCountObject();
	for (let i = 0; i < handObj.length; i++) {
		numberCounts[handObj[i].number]++;
		if (numberCounts[handObj[i].number] >= 3) {
			return true;
		}
	}
}

function handHasStraight(handObj) {
	let numberCounts = getNumberCountObject();
	for (let i = 0; i < handObj.length; i++) {
		numberCounts[handObj[i].number]++;
	}
	let streak = 0;
	for (let i = 1; i <= 13; i++) {
		if (numberCounts[i] >= 1) {
			streak++;
			// Special wraparound check
			if (i === 13 && numberCounts[1] >= 1) {
				streak++;
			}
			if (streak >= 5) return true;
		}
		else {
			streak = 0;
		}
	}
}

function handHasFlush(handObj) {
	let suitCounts = getSuitCountObject();
	for (let i = 0; i < handObj.length; i++) {
		suitCounts[handObj[i].suit]++;
		if (suitCounts[handObj[i].suit] >= 5) {
			return true;
		}
	}
}

function handHasFullHouse(handObj) {
	let numberCounts = getNumberCountObject();
	for (let i = 0; i < handObj.length; i++) {
		numberCounts[handObj[i].number]++;
	}
	let pair = 0;
	let three = 0;
	for (let number in numberCounts) {
		if (numberCounts[number] >= 3) {
			three++;
		}
		else if (numberCounts[number] >= 2) {
			pair++;
		}
	}
	if ((pair && three) || three >= 2) return true;
}

function handHasFourOfAKind(handObj) {
	let numberCounts = getNumberCountObject();
	for (let i = 0; i < handObj.length; i++) {
		numberCounts[handObj[i].number]++;
		if (numberCounts[handObj[i].number] >= 4) {
			return true;
		}
	}
}

function handHasStraightFlush(handObj) {
	// we don't need to check for the wraparound Ace value because it's already accounted for as royal flush
	let suitCounts = getSuitCountObject();
	for (let suit in suitCounts) {
		suitCounts[suit] = getNumberCountObject();
	}

	for (let i = 0; i < handObj.length; i++) {
		suitCounts[handObj[i].suit][handObj[i].number]++;
	}
	
	for (let suit in suitCounts) {
		let streak = 0;
		for (let i = 1; i <= 13; i++) {
			if (suitCounts[suit][i] >= 1) {
				streak++;
				if (streak >= 5) return true;
			}
			else {
				streak = 0;
			}
		}
	}
}

function handHasRoyalFlush(handObj) {
	let royalCounts = getSuitCountObject();
	for (let i = 0; i < handObj.length; i++) {
		if (handObj[i].number === 1 || handObj[i].number >= 10) {
			royalCounts[handObj[i].suit]++;
		}
		if (royalCounts[handObj[i].suit] >= 5) {
			return true;
		}
	}
}

export function getHandResult(hand) {
	let handObj = hand.map(function(cardValue) {
		return CARDS[cardValue];
	})

	if (handHasRoyalFlush(handObj)) {
		return "Royal Flush!!!"
	}
	else if (handHasStraightFlush(handObj)) {
		return "Straight Flush!!"
	}
	else if (handHasFourOfAKind(handObj)) {
		return "Four of a Kind!!"
	}
	else if (handHasFullHouse(handObj)) {
		return "Full House!"
	}
	else if (handHasFlush(handObj)) {
		return "Flush!"
	}
	else if (handHasStraight(handObj)) {
		return "Straight!"
	}
	else if (handHasThreeOfAKind(handObj)) {
		return "Three of a Kind"
	}
	else if (handHasTwoPair(handObj)) {
		return "Two Pair"
	}
	else if (handHasOnePair(handObj)) {
		return "One Pair"
	}
	else {
		return "No Pair"
	}
}

function getNumOnePair(handObj) {
	let numberCounts = getNumberCountObject();
	for (let i = 0; i < handObj.length; i++) {
		numberCounts[handObj[i].number]++;
		if (numberCounts[handObj[i].number] > 2) return 0;
	}

	let numDoubles = 0;

	let possibilities = 0;
	for (let number in numberCounts) {
		if (numberCounts[number] > 2) return 0;
		else if (numberCounts[number] === 2) numDoubles++;
		if (numDoubles > 1) return 0;
		let numNeeded = (2 - numberCounts[number]);
		let freeCards = 7 - handObj.length - numNeeded;
		if (freeCards >= 0) {
			let looseCards = 52 - 7 - (6 * 4);
			possibilities += combination(4 - numberCounts[number], numNeeded) * combination(looseCards + freeCards, freeCards)
		}
	}

	return possibilities;
}

function getNumTwoPair(handObj) {
	let numberCounts = getNumberCountObject();
	for (let i = 0; i < handObj.length; i++) {
		numberCounts[handObj[i].number]++;
		if (numberCounts[handObj[i].number] > 2) return 0;
	}

	let possibilities = 0;
	for (let number1 = 1; number1 <= 13; number1++) {
		for (let number2 = number1 + 1; number2 <= 13; number2++) {
			// 2-2
			let num1Needed = 2 - numberCounts[number1];
			let num2Needed = 2 - numberCounts[number2];
			let freeCards = 7 - handObj.length - num1Needed - num2Needed;
			if (freeCards >= 0) {
				possibilities += combination(4 - numberCounts[number1], num1Needed) * 
					combination(4 - numberCounts[number2], num2Needed) * 
					combination(37 + freeCards, freeCards)
			}
		}
	}

	return possibilities;
}

function getNumThreeOfAKind(handObj) {
	let numberCounts = getNumberCountObject();
	for (let i = 0; i < handObj.length; i++) {
		numberCounts[handObj[i].number]++;
	}

	let possibilities = 0;
	for (let number in numberCounts) {
		let numNeeded = (3 - numberCounts[number]);
		let freeCards = 7 - handObj.length - numNeeded;
		if (freeCards >= 0) {
			possibilities += combination(4 - numberCounts[number], numNeeded) * combination(45 + freeCards, freeCards)
		}
	}

	return possibilities;
}

// subtract out royal flushes and straight flushes later
function getNumStraight(handObj) {
	let numberCounts = getNumberCountObject();
	for (let i = 0; i < handObj.length; i++) {
		numberCounts[handObj[i].number]++;
	}

	let extraCards = 0;

	let straightCounts = getNumberCountObject();
	let straightFullCounts = getNumberCountObject();
	// Interpret these counts as "cards that are in a straight with this card as the low card"
	for (let i = 1; i <= 13; i++) {
		if (numberCounts[i] > 0) {
			extraCards += numberCounts[i] - 1;
			if (extraCards >= 3) return 0; // can't have a straight if 3 cards match another card
			let fillIn = i;
			if (fillIn === 1) {
				straightCounts[10]++;
				straightFullCounts[10] += numberCounts[i];
			}
			do {
				if (fillIn <= 10) {
					straightCounts[fillIn]++;
					straightFullCounts[fillIn] += numberCounts[i];
				}
				fillIn--;
			} while (i - fillIn < 5 && fillIn >= 1);
		}
	}

	let possibilities = 0;
	for (let number in straightCounts) {
		let numNeeded = (5 - straightCounts[number]);
		let freeCards = 7 - handObj.length - numNeeded;
		if (freeCards >= 0) {
			let looseCards = 52 - 7 - (5 * 4) + (3 - extraCards);
			possibilities += Math.pow(4, numNeeded) * combination(looseCards + freeCards, freeCards)
		}
	}

	return possibilities;
}

// subtract out royal flushes and straight flushes later
function getNumFlush(handObj) {
	let suitCounts = getSuitCountObject();
	for (let i = 0; i < handObj.length; i++) {
		suitCounts[handObj[i].suit]++;
	}

	let possibilities = 0;
	for (let suit in suitCounts) {
		// 5 of suit
		let numNeededScen1 = (5 - suitCounts[suit]);
		let freeCardsScen1 = 7 - handObj.length - numNeededScen1;
		if (freeCardsScen1 >= 0) {
			let looseCards = 52 - 7 - (13 - 5);
			possibilities += combination(13 - suitCounts[suit], numNeededScen1) * combination(looseCards + freeCardsScen1, freeCardsScen1)
		}
		// 6 of suit
		let numNeededScen2 = (6 - suitCounts[suit]);
		let freeCardsScen2 = 7 - handObj.length - numNeededScen2;
		if (freeCardsScen2 >= 0) {
			let looseCards = 52 - 7 - (13 - 6);
			possibilities += combination(13 - suitCounts[suit], numNeededScen2) * combination(looseCards + freeCardsScen2, freeCardsScen2)
		}
		// 7 of suit
		let numNeededScen3 = (7 - suitCounts[suit]);
		let freeCardsScen3 = 7 - handObj.length - numNeededScen3;
		if (freeCardsScen3 >= 0) {
			let looseCards = 52 - 7 - (13 - 7);
			possibilities += combination(13 - suitCounts[suit], numNeededScen3) * combination(looseCards + freeCardsScen3, freeCardsScen3)
		}
	}

	return possibilities;
}

function getNumFullHouse(handObj) {
	let numberCounts = getNumberCountObject();
	for (let i = 0; i < handObj.length; i++) {
		numberCounts[handObj[i].number]++;
		if (numberCounts[handObj[i].number] > 3) return 0;
	}

	let possibilities = 0;
	for (let number1 = 1; number1 <= 13; number1++) {
		for (let number2 = number1 + 1; number2 <= 13; number2++) {
			// 3-3
			let num1NeededScen1 = 3 - numberCounts[number1];
			let num2NeededScen1 = 3 - numberCounts[number2];
			let freeCardsScen1 = 7 - handObj.length - num1NeededScen1 - num2NeededScen1;
			if (freeCardsScen1 >= 0) {
				possibilities += combination(4 - numberCounts[number1], num1NeededScen1) * 
					combination(4 - numberCounts[number2], num2NeededScen1) * 
					combination(37 + freeCardsScen1, freeCardsScen1)
			}
			// 2-3
			let num1NeededScen2 = 2 - numberCounts[number1];
			let num2NeededScen2 = 3 - numberCounts[number2];
			let freeCardsScen2 = 7 - handObj.length - num1NeededScen2 - num2NeededScen2;
			if (freeCardsScen2 >= 0) {
				possibilities += combination(4 - numberCounts[number1], num1NeededScen2) * 
					combination(4 - numberCounts[number2], num2NeededScen2) * 
					combination(37 + freeCardsScen2, freeCardsScen2)
			}
			// 3-2
			let num1NeededScen3 = 3 - numberCounts[number1];
			let num2NeededScen3 = 2 - numberCounts[number2];
			let freeCardsScen3 = 7 - handObj.length - num1NeededScen3 - num2NeededScen3;
			if (freeCardsScen3 >= 0) {
				possibilities += combination(4 - numberCounts[number1], num1NeededScen3) * 
					combination(4 - numberCounts[number2], num2NeededScen3) * 
					combination(37 + freeCardsScen3, freeCardsScen3)
			}
			// SUBTRACT 3-2-2
		}
	}

	return possibilities;
}

// Four of a kind is easy because you can't have a four of a kind in a hand that beats four of a kind
function getNumFourOfAKind(handObj) {
	let numberCounts = getNumberCountObject();
	for (let i = 0; i < handObj.length; i++) {
		numberCounts[handObj[i].number]++;
	}

	let possibilities = 0;
	for (let number in numberCounts) {
		let numNeeded = (4 - numberCounts[number]);
		let freeCards = 7 - handObj.length - numNeeded;
		if (freeCards >= 0) {
			possibilities += combination(4 - numberCounts[number], numNeeded) * combination(45 + freeCards, freeCards)
		}
	}

	return possibilities;
}

function getNumStraightFlush(handObj) {
	let suitCounts = getSuitCountObject();
	for (let suit in suitCounts) {
		suitCounts[suit] = getNumberCountObject();
	}

	// Interpret these counts as "cards that are in a straight flush with this card as the low card"
	for (let i = 0; i < handObj.length; i++) {
		let fillIn = handObj[i].number;
		do {
			if (fillIn < 10) {
				suitCounts[handObj[i].suit][fillIn]++;
			}
			fillIn--;
		} while (handObj[i].number - fillIn < 5 && fillIn >= 1);
	}

	// need to exclude royal straight from "excess" cards, ex: 9 - K straight
	let possibilities = 0;
	for (let suit in suitCounts) {
		for (let number = 1; number < 10; number++) {
			let numNeeded = (5 - suitCounts[suit][number]);
			let freeCards = 7 - handObj.length - numNeeded;
			if (freeCards < 0) continue;
			else if (freeCards >= 0) {
				// the number to choose from is one lower because we can't choose the card below
				// the card this straight starts at. Otherwise we would double-count.
				possibilities += 1 * combination(44 + freeCards, freeCards)
			}
		}
	}

	return possibilities;
}

function getNumRoyalFlush(handObj) {
	let royalCounts = getSuitCountObject();
	for (let i = 0; i < handObj.length; i++) {
		if (handObj[i].number === 1 || handObj[i].number >= 10) {
			royalCounts[handObj[i].suit]++;
		}
	}

	let possibilities = 0;
	for (let suit in royalCounts) {
		let numNeeded = (5 - royalCounts[suit]);
		let freeCards = 7 - handObj.length - numNeeded;
		if (freeCards >= 0) {
			possibilities += 1 * combination(45 + freeCards, freeCards)
		}
	}

	return possibilities;
}

function getHandOdds_Smart(hand) {
	let handObj = hand.map(function(cardValue) {
		return CARDS[cardValue];
	})

	let possibleHands = combination(52 - hand.length, 7 - hand.length);

	let numRoyalFlush = getNumRoyalFlush(handObj);
	let numStraightFlush = getNumStraightFlush(handObj)
	let numFourOfAKind = getNumFourOfAKind(handObj);
	let numFullHouse = getNumFullHouse(handObj);
	let numFlush = getNumFlush(handObj) - numStraightFlush - numRoyalFlush;
	let numStraight = getNumStraight(handObj) - numRoyalFlush - numStraightFlush;
	let numThreeOfAKind = getNumThreeOfAKind(handObj);
	let numTwoPair = getNumTwoPair(handObj);
	let numOnePair = getNumOnePair(handObj);
	let numNoPair = possibleHands - numRoyalFlush - numStraightFlush - numFourOfAKind - numFullHouse - numFlush - numStraight - numThreeOfAKind - numTwoPair - numOnePair;

	return {
		numRoyalFlush: numRoyalFlush,
		numStraightFlush: numStraightFlush,
		numFourOfAKind: numFourOfAKind,
		numFullHouse: numFullHouse,
		numFlush: numFlush,
		numStraight: numStraight,
		numThreeOfAKind: numThreeOfAKind,
		numTwoPair: numTwoPair,
		numOnePair: numOnePair,
		numNoPair: numNoPair,
		possibleHands: possibleHands
	}
}

function getHandOdds_Dumb(hand) {
	let possibleHands = combination(52 - hand.length, 7 - hand.length);

	let counts = {
		"Royal Flush!!!": 0,
		"Straight Flush!!": 0,
		"Four of a Kind!!": 0,
		"Full House!": 0,
		"Flush!": 0,
		"Straight!": 0,
		"Three of a Kind": 0,
		"Two Pair": 0,
		"One Pair": 0,
		"No Pair": 0
	}

	let availableCards = Object.keys(CARDS).filter(function(cardValue) {
		return !hand.includes(cardValue);
	});

	if (hand.length > 2) {
		countHands(hand, availableCards);
	}

	function countHands(hand, availableCards) {
		if (hand.length < 7) {
			availableCards.forEach(function(card, i) {
				let nextHand = [...hand, card];
				let nextAvailableCards = availableCards.slice(i+1);
				countHands(nextHand, nextAvailableCards);
			});
		}
		else {
			counts[getHandResult(hand)]++;
		}
	}

	let totalMult = 0;
	for (let handName in counts) {
		totalMult += counts[handName] * MULTS[handName];
	}

	return {
		numRoyalFlush: counts["Royal Flush!!!"],
		numStraightFlush: counts["Straight Flush!!"],
		numFourOfAKind: counts["Four of a Kind!!"],
		numFullHouse: counts["Full House!"],
		numFlush: counts["Flush!"],
		numStraight: counts["Straight!"],
		numThreeOfAKind: counts["Three of a Kind"],
		numTwoPair: counts["Two Pair"],
		numOnePair: counts["One Pair"],
		numNoPair: counts["No Pair"],
		avgMult: totalMult / possibleHands,
		possibleHands: possibleHands
	}
}

export function getHandOdds(hand) {
	// return getHandOdds_Smart(hand);
	return getHandOdds_Dumb(hand);
}

export function getLinkBonuses(hand) {
	let chars = {};
	hand.forEach(function(cardValue) {
		if (CARDS[cardValue].char) {
			chars[CARDS[cardValue].char] = true;
		}
	})
	let linkBonuses = [];
	for (let linkName in CHAR_LINKS) {
		let hasAllChars = CHAR_LINKS[linkName].every(function(charName) {
			return chars[charName];
		})
		if (hasAllChars) {
			linkBonuses.push(linkName)
		}
	}
	return linkBonuses;
}
