import { CARDS, CHAR_LINKS } from "./cards";

export const MULTS = {
	"Royal Flush": 2000,
	"Straight Flush": 1000,
	"Four of a Kind": 250,
	"Full House": 100,
	"Flush": 75,
	"Straight": 50,
	"Three of a Kind": 25,
	"Two Pair": 15,
	"One Pair": 10,
	"No Pair": 1
}

export const HAND_PRIORITY = [
	"Royal Flush", "Straight Flush", "Four of a Kind", "Full House", 
	"Flush", "Straight", "Three of a Kind", "Two Pair", "One Pair", "No Pair"
]

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
	let pairs = 0;
	for (let i = 0; i < handObj.length; i++) {
		numberCounts[handObj[i].number]++;
		if (numberCounts[handObj[i].number] === 2) {
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
	let pair = 0;
	let three = 0;
	for (let i = 0; i < handObj.length; i++) {
		numberCounts[handObj[i].number]++;
		if (numberCounts[handObj[i].number] === 3) {
			three++;
			pair--;
		}
		else if (numberCounts[handObj[i].number] === 2) {
			pair++;
		}
		if (pair && three) return true;
	}
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
		return "Royal Flush"
	}
	else if (handHasStraightFlush(handObj)) {
		return "Straight Flush"
	}
	else if (handHasFourOfAKind(handObj)) {
		return "Four of a Kind"
	}
	else if (handHasFullHouse(handObj)) {
		return "Full House"
	}
	else if (handHasFlush(handObj)) {
		return "Flush"
	}
	else if (handHasStraight(handObj)) {
		return "Straight"
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

const getNum = {};
getNum["One Pair"] = function(handObj) {
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

// If you have two pair, you cannot get three of a kind without it becoming a full house
// No df with straight/flush overlap
getNum["Two Pair"] = function(handObj) {
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

// No df with straight/flush overlap
getNum["Three of a Kind"] = function(handObj) {
	let numberCounts = getNumberCountObject();
	let existingPairs = [];
	for (let i = 0; i < handObj.length; i++) {
		numberCounts[handObj[i].number]++;
		if (numberCounts[handObj[i].number] === 2) {
			existingPairs.push(handObj[i].number);
		}
		if (numberCounts[handObj[i].number] > 3) return 0;
	}

	let possibilities = 0;
	for (let number in numberCounts) {
		// If there is an existing pair that is not this number then this is a full house
		let notExistingPair = false;
		for (let pairNum of existingPairs) {
			if (pairNum !== number) {
				notExistingPair = true;
				break;
			}
		}
		if (notExistingPair) continue;

		let numNeeded = (3 - numberCounts[number]);
		let freeCards = 7 - handObj.length - numNeeded;
		if (freeCards >= 0) {
			possibilities += combination(4 - numberCounts[number], numNeeded) * combination(45 + freeCards, freeCards)
		}
	}

	return possibilities;
}

// subtract out royal flushes and straight flushes later
getNum["Straight"] = function(handObj) {
	let numberCounts = getNumberCountObject();
	let suitCounts = getSuitCountObject();
	for (let i = 0; i < handObj.length; i++) {
		numberCounts[handObj[i].number]++;
		suitCounts[handObj[i].suit]++;
	}
	// Need to subtract flushes NOW in fact

	let extraCards = 0;
	let straightCounts = getNumberCountObject();
	// Interpret these counts as "cards that are in a straight with this card as the low card"
	for (let i = 1; i <= 13; i++) {
		if (numberCounts[i] > 0) {
			extraCards += numberCounts[i] - 1;
			if (extraCards >= 3) return 0; // can't have a straight if 3 cards match another card
			let fillIn = i;
			if (fillIn === 1) {
				straightCounts[10]++;
			}
			do {
				if (fillIn <= 10) {
					straightCounts[fillIn]++;
				}
				fillIn--;
			} while (i - fillIn < 5 && fillIn >= 1);
		}
	}
	console.log(straightCounts)

	let possibilities = 0;
	for (let number = 1; number <= 10; number++) {
		// If we already have the number below then we already counted
		if (numberCounts[number - 1]) continue;
		let numNeeded = (5 - straightCounts[number]);
		let freeCards = 7 - handObj.length - numNeeded;
		if (freeCards >= 0) {
			let looseCards = 45;
			// can't choose the number below this straight because that would be counted as the lower straight
			if (number > 1) {
				looseCards -= 4;
			}
			let extraHandledCards = numNeeded * 3;
			let straightPoss = Math.pow(4, numNeeded) * combination(looseCards + freeCards - extraHandledCards, freeCards);
			if (freeCards >= 1) {
				// consider 2
				straightPoss += combination(4, 2) * Math.pow(4, numNeeded - 1) * numNeeded * combination(looseCards + freeCards - extraHandledCards, freeCards - 1);
			}
			if (freeCards === 2) {
				// consider 3 and 2-2
				straightPoss += combination(4, 3) * Math.pow(4, numNeeded - 1) * numNeeded;
				if (numNeeded >= 2) {
					straightPoss += combination(4, 2) * combination(numNeeded, 2) * Math.pow(4, numNeeded - 2);
				}
			}
			
			console.log("Low " + number + " straight: " + straightPoss);
			possibilities += straightPoss;
		}
	}

	return possibilities;
}

// subtract out royal flushes and straight flushes later
getNum["Flush"] = function(handObj) {
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

// You may get four of a kind in a full house hand
getNum["Full House"] = function(handObj) {
	let numberCounts = getNumberCountObject();
	let existingPairs = [];
	for (let i = 0; i < handObj.length; i++) {
		numberCounts[handObj[i].number]++;
		if (numberCounts[handObj[i].number] === 2) {
			existingPairs.push(handObj[i].number);
		}
		if (numberCounts[handObj[i].number] > 3) return 0;
	}

	let possibilities = 0;
	// console.log("FULL HOUSE--------------------")

	// 3-2
	for (let numberTriple = 1; numberTriple <= 13; numberTriple++) {
		for (let numberDouble = 1; numberDouble <= 13; numberDouble++) {
			if (numberTriple === numberDouble) continue;
			if (numberCounts[numberDouble] > 2) continue;

			// If there is an existing pair that is neither of these numbers then this is a 3-2-2
			let notExistingPair = false;
			for (let pairNum of existingPairs) {
				if (pairNum !== numberDouble && pairNum !== numberTriple) {
					notExistingPair = true;
					break;
				}
			}
			if (notExistingPair) continue;

			let numNeededTriple = 3 - numberCounts[numberTriple];
			let numNeededDouble = 2 - numberCounts[numberDouble];
			let freeCards = 7 - handObj.length - numNeededTriple - numNeededDouble;
			if (freeCards >= 0) {
				let looseCards = 45 - 3;
				// SUBTRACT 3-2-2
				if (freeCards === 1) {
					looseCards -= 3;
				}
				let looseCombos = combination(looseCards + freeCards, freeCards);
				// SUBTRACT 3-2-2 
				if (freeCards === 2) {
					looseCombos -= combination(4, 2) * 11;
				}
				let poss32 = combination(4 - numberCounts[numberTriple], numNeededTriple) * 
					combination(4 - numberCounts[numberDouble], numNeededDouble) * 
					looseCombos;
				possibilities += poss32;
				// console.log("3-2 " + numberTriple + " over " + numberDouble + ": " + poss32)
			}
		}
	}

	// 3-2-2
	for (let numberTriple = 1; numberTriple <= 13; numberTriple++) {
		for (let numberDouble1 = 1; numberDouble1 <= 13; numberDouble1++) {
			for (let numberDouble2 = numberDouble1 + 1; numberDouble2 <= 13; numberDouble2++) {
				if (numberTriple === numberDouble1 || numberTriple === numberDouble2) continue;
				if (numberCounts[numberDouble1] > 2) continue;
				if (numberCounts[numberDouble2] > 2) continue;
				let numNeededTriple = 3 - numberCounts[numberTriple];
				let numNeededDouble1 = 2 - numberCounts[numberDouble1];
				let numNeededDouble2 = 2 - numberCounts[numberDouble2];
				let freeCards = 7 - handObj.length - numNeededTriple - numNeededDouble1 - numNeededDouble2;
				if (freeCards >= 0) {
					let poss322 = combination(4 - numberCounts[numberTriple], numNeededTriple) * 
						combination(4 - numberCounts[numberDouble1], numNeededDouble1) * 
						combination(4 - numberCounts[numberDouble2], numNeededDouble2);
					possibilities += poss322;
					// console.log("3-2-2 " + numberTriple + " over " + numberDouble1 + " and " + numberDouble2 + ": " + poss322)
				}
			}
		}
	}

	// 3-3
	for (let number1 = 1; number1 <= 13; number1++) {
		for (let number2 = number1 + 1; number2 <= 13; number2++) {
			let numNeeded1 = 3 - numberCounts[number1];
			let numNeeded2 = 3 - numberCounts[number2];
			let freeCards = 7 - handObj.length - numNeeded1 - numNeeded2;
			if (freeCards >= 0) {
				let looseCards = 45 - 2;
				let poss33 = combination(4 - numberCounts[number1], numNeeded1) * 
					combination(4 - numberCounts[number2], numNeeded2) * 
					combination(looseCards + freeCards, freeCards);
				possibilities += poss33;
				// console.log("3-3 " + number1 + " and " + number2 + ": " + poss33) 
			}
		}
	}

	return possibilities;
}

// Four of a kind is easy because you can't have a four of a kind in a hand that beats four of a kind
getNum["Four of a Kind"] = function(handObj) {
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

// Will subtract out royal flushes later
getNum["Straight Flush"] = function(handObj) {
	let straightCounts = getSuitCountObject();
	let numberCounts = getSuitCountObject();
	for (let suit in straightCounts) {
		straightCounts[suit] = getNumberCountObject();
		numberCounts[suit] = getNumberCountObject();
	}

	// Interpret these counts as "cards that are in a straight flush with this card as the low card"
	for (let i = 0; i < handObj.length; i++) {
		numberCounts[handObj[i].suit][handObj[i].number]++;
		let fillIn = handObj[i].number;
		if (fillIn === 1) {
			straightCounts[handObj[i].suit][10]++;
		}
		do {
			if (fillIn <= 10) {
				straightCounts[handObj[i].suit][fillIn]++;
			}
			fillIn--;
		} while (handObj[i].number - fillIn < 5 && fillIn >= 1);
	}

	let possibilities = 0;
	for (let suit in straightCounts) {
		for (let number = 1; number <= 10; number++) {
			// If we already have the card one below this then we already counted
			if (numberCounts[suit][number - 1]) continue;
			let numNeeded = (5 - straightCounts[suit][number]);
			let freeCards = 7 - handObj.length - numNeeded;
			if (freeCards >= 0) {
				let looseCards = 45;
				// the number to choose from is one lower because we can't choose the card below
				// the card this straight starts at. Otherwise we would double-count.
				if (number > 1) looseCards--;
				possibilities += 1 * combination(looseCards + freeCards, freeCards);
				// console.log(suit + " - " + number + ": " + combination(looseCards + freeCards, freeCards))
			}
		}
	}

	return possibilities;
}

getNum["Royal Flush"] = function(handObj) {
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
			let looseCards = 45;
			possibilities += 1 * combination(looseCards + freeCards, freeCards)
		}
	}

	return possibilities;
}

getNum["No Pair"] = function(handObj) {
	return 0;
}

function getHandOdds_Smart(hand) {
	let handObj = hand.map(function(cardValue) {
		return CARDS[cardValue];
	})

	let possibleHands = combination(52 - hand.length, 7 - hand.length);
	let minHand = getHandResult(hand);

	let counts = {
		"Royal Flush": 0,
		"Straight Flush": 0,
		"Four of a Kind": 0,
		"Full House": 0,
		"Flush": 0,
		"Straight": 0,
		"Three of a Kind": 0,
		"Two Pair": 0,
		"One Pair": 0,
		"No Pair": 0
	}

	let handsLeft = possibleHands;
	for (let i = 0; i <= HAND_PRIORITY.indexOf(minHand); i++) {
		let handName = HAND_PRIORITY[i];
		if (i === HAND_PRIORITY.indexOf(minHand)) {
			counts[handName] = handsLeft;
		}
		else {
			let num = getNum[handName](handObj);
			if (handName == "Straight Flush") {
				num = Math.max(0, num - counts["Royal Flush"])
			}
			else if (handName == "Flush") {
				num = Math.max(0, num - counts["Royal Flush"] - counts["Straight Flush"])
			}
			else if (handName == "Straight") {
				num = Math.max(0, num - counts["Royal Flush"] - counts["Straight Flush"])
			}
			counts[handName] = num;
			handsLeft -= num;
		}
	}

	let totalMult = 0;
	for (let handName in counts) {
		totalMult += counts[handName] * MULTS[handName];
	}

	return {
		"Royal Flush": counts["Royal Flush"],
		"Straight Flush": counts["Straight Flush"],
		"Four of a Kind": counts["Four of a Kind"],
		"Full House": counts["Full House"],
		"Flush": counts["Flush"],
		"Straight": counts["Straight"],
		"Three of a Kind": counts["Three of a Kind"],
		"Two Pair": counts["Two Pair"],
		"One Pair": counts["One Pair"],
		"No Pair": counts["No Pair"],
		avgMult: totalMult / possibleHands,
		possibleHands: possibleHands
	}
}

function getHandOdds_Dumb(hand) {
	let possibleHands = combination(52 - hand.length, 7 - hand.length);

	let counts = {
		"Royal Flush": 0,
		"Straight Flush": 0,
		"Four of a Kind": 0,
		"Full House": 0,
		"Flush": 0,
		"Straight": 0,
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
		"Royal Flush": counts["Royal Flush"],
		"Straight Flush": counts["Straight Flush"],
		"Four of a Kind": counts["Four of a Kind"],
		"Full House": counts["Full House"],
		"Flush": counts["Flush"],
		"Straight": counts["Straight"],
		"Three of a Kind": counts["Three of a Kind"],
		"Two Pair": counts["Two Pair"],
		"One Pair": counts["One Pair"],
		"No Pair": counts["No Pair"],
		avgMult: totalMult / possibleHands,
		possibleHands: possibleHands
	}
}

// As it turns out, this is more dumb
function getHandOdds_LessDumb(hand) {
	let possibleHands = combination(52 - hand.length, 7 - hand.length);

	let counts = {
		"Royal Flush": 0,
		"Straight Flush": 0,
		"Four of a Kind": 0,
		"Full House": 0,
		"Flush": 0,
		"Straight": 0,
		"Three of a Kind": 0,
		"Two Pair": 0,
		"One Pair": 0,
		"No Pair": 0
	}

	let availableCards = Object.keys(CARDS).filter(function(cardValue) {
		return !hand.includes(cardValue);
	});

	if (hand.length > 2) {
		countHands(hand, availableCards, 1);
	}

	function countHands(hand, availableCards, mult) {
		if (hand.length < 7) {
			// Simplify a little bit by collapsing identical suits
			let suitSignatures = {
				"c": "",
				"d": "",
				"h": "",
				"s": ""
			}
			hand.forEach(function(cardValue) {
				suitSignatures[cardValue.slice(-1)] += cardValue.slice(0, -1) + ",";
			});
			let suitGroups = {};
			let suitSuitGroups = {};
			for (let suit in suitSignatures) {
				if (!suitGroups[suitSignatures[suit]]) {
					suitGroups[suitSignatures[suit]] = {
						count: 1,
						primary: suit
					}
				}
				else {
					suitGroups[suitSignatures[suit]].count++;
				}
				suitSuitGroups[suit] = suitGroups[suitSignatures[suit]];
			}

			availableCards.forEach(function(card, i) {
				let suit = card.slice(-1);
				if (suitSuitGroups[suit].primary === suit) {
					let nextHand = [...hand, card];
					let nextAvailableCards = availableCards.slice(i+1);
					countHands(nextHand, nextAvailableCards, mult * suitSuitGroups[suit].count);
				}
			});
		}
		else {
			counts[getHandResult(hand)] += mult;
		}
	}

	let totalMult = 0;
	for (let handName in counts) {
		totalMult += counts[handName] * MULTS[handName];
	}

	return {
		"Royal Flush": counts["Royal Flush"],
		"Straight Flush": counts["Straight Flush"],
		"Four of a Kind": counts["Four of a Kind"],
		"Full House": counts["Full House"],
		"Flush": counts["Flush"],
		"Straight": counts["Straight"],
		"Three of a Kind": counts["Three of a Kind"],
		"Two Pair": counts["Two Pair"],
		"One Pair": counts["One Pair"],
		"No Pair": counts["No Pair"],
		avgMult: totalMult / possibleHands,
		possibleHands: possibleHands
	}
}

export function getHandOdds_Base() {
	let possibleHands = combination(52, 7);
	let counts = {
		"Royal Flush": 4324,
		"Straight Flush": 37260,
		"Four of a Kind": 224848,
		"Full House": 3473184,
		"Flush": 4047644,
		"Straight": 6180020,
		"Three of a Kind": 6461620,
		"Two Pair": 31433400,
		"One Pair": 58627800,
		"No Pair": 23294460
	}

	let totalMult = 0;
	for (let handName in counts) {
		totalMult += counts[handName] * MULTS[handName];
	}

	return {
		"Royal Flush": counts["Royal Flush"],
		"Straight Flush": counts["Straight Flush"],
		"Four of a Kind": counts["Four of a Kind"],
		"Full House": counts["Full House"],
		"Flush": counts["Flush"],
		"Straight": counts["Straight"],
		"Three of a Kind": counts["Three of a Kind"],
		"Two Pair": counts["Two Pair"],
		"One Pair": counts["One Pair"],
		"No Pair": counts["No Pair"],
		avgMult: totalMult / possibleHands,
		possibleHands: possibleHands
	}
}

// for debugging
function countFullHouses(hand) {
	console.log("COUNTING FULL HOUSES--------------")
	let possibleHands = combination(52 - hand.length, 7 - hand.length);
	let availableCards = Object.keys(CARDS).filter(function(cardValue) {
		return !hand.includes(cardValue);
	});

	let fullCounts = {};
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
			if (getHandResult(hand) === "Full House") {
				let triples = [];
				let pairs = [];
				let numberCounts = getNumberCountObject();
				hand.forEach(function(cardValue) {
					numberCounts[CARDS[cardValue].number]++;
				});
				for (let number in numberCounts) {
					if (numberCounts[number] === 2) {
						pairs.push(number);
					}
					else if (numberCounts[number] === 3) {
						triples.push(number);
					}
				}
				let fullHouseName = triples.join(", ") + " over " + pairs.join(", ");
				if (!fullCounts[fullHouseName]) {
					fullCounts[fullHouseName] = 0;
				}
				fullCounts[fullHouseName]++;
			}
		}
	}

	for (let fullType in fullCounts) {
		console.log(fullType + ": " + fullCounts[fullType]);
	}
}

// for debugging
function countStraightFlushes(hand) {
	console.log("COUNTING HANDS--------------")
	let possibleHands = combination(52 - hand.length, 7 - hand.length);
	let availableCards = Object.keys(CARDS).filter(function(cardValue) {
		return !hand.includes(cardValue);
	});

	let handCounts = {};
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
			if (getHandResult(hand) === "Straight Flush") {
				let numberCounts = getNumberCountObject();
				let suitCounts = getSuitCountObject();
				let flushSuit = "";
				hand.forEach(function(cardValue) {
					suitCounts[CARDS[cardValue].suit]++;
					if (suitCounts[CARDS[cardValue].suit] >= 5) {
						flushSuit = CARDS[cardValue].suit;
					}
				});
				hand.forEach(function(cardValue) {
					if (CARDS[cardValue].suit === flushSuit) {
						numberCounts[CARDS[cardValue].number]++;
					}
				});
				let streakStart = 0;
				let currentStreak = 0;
				for (let number = 1; number <= 13; number++) {
					if (numberCounts[number] > 0) {
						if (currentStreak === 0) {
							streakStart = number;
						}
						currentStreak++;
						if (number === 13 && numberCounts[1] > 0) {
							currentStreak++;
						}
						if (currentStreak >= 5) break;
					}
					else {
						currentStreak = 0;
					}
				}
				let handName = streakStart;
				if (!handCounts[handName]) {
					handCounts[handName] = 0;
				}
				handCounts[handName]++;
			}
		}
	}

	for (let handName in handCounts) {
		console.log(handName + ": " + handCounts[handName]);
	}
	console.log("DONE COUNTING HANDS--------------")
}

// for debugging
function countStraights(hand) {
	console.log("COUNTING HANDS--------------")
	let possibleHands = combination(52 - hand.length, 7 - hand.length);
	let availableCards = Object.keys(CARDS).filter(function(cardValue) {
		return !hand.includes(cardValue);
	});

	let handCounts = {};
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
			if (getHandResult(hand) === "Straight") {
				let numberCounts = getNumberCountObject();
				hand.forEach(function(cardValue) {
					numberCounts[CARDS[cardValue].number]++;
				});
				let streakStart = 0;
				let currentStreak = 0;
				for (let number = 1; number <= 13; number++) {
					if (numberCounts[number] > 0) {
						if (currentStreak === 0) {
							streakStart = number;
						}
						currentStreak++;
						if (number === 13 && numberCounts[1] > 0) {
							currentStreak++;
						}
						if (currentStreak >= 5) break;
					}
					else {
						currentStreak = 0;
					}
				}
				let handName = streakStart;
				if (!handCounts[handName]) {
					handCounts[handName] = 0;
				}
				handCounts[handName]++;
			}
		}
	}

	for (let handName in handCounts) {
		console.log(handName + ": " + handCounts[handName]);
	}
	console.log("DONE COUNTING HANDS--------------")
}

export function getHandOdds(hand) {
	if (hand.length === 0) {
		// hard-coded to avoid long calculation
		return getHandOdds_Base();
	}
	else {
		// countStraights(hand);
		// return getHandOdds_Smart(hand);
		// return getHandOdds_LessDumb(hand);
		return getHandOdds_Dumb(hand);
	}
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
		let hasAllChars = CHAR_LINKS[linkName].chars.every(function(charName) {
			return chars[charName];
		})
		if (hasAllChars) {
			linkBonuses.push({
				linkName: linkName,
				chars: CHAR_LINKS[linkName].chars,
				bonus: CHAR_LINKS[linkName].bonus
			});
		}
	}
	return linkBonuses;
}
