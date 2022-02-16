import { CARDS, CHAR_LINKS, SUITS, VALUES } from "./cards";
import { PRECALCULATED_HANDS } from "./precalculated";

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

// for debugging calculation
if (typeof window !== "undefined") {
	window.combination = combination;
}

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

function getCardCounts(hand) {
	let handObj = hand.map(function(cardValue) {
		return CARDS[cardValue];
	});

	let numberCounts = getNumberCountObject();
	let suitCounts = getSuitCountObject();
	let suitNumberCounts = getSuitCountObject();
	const STRAIGHT_HIGH_VALUES = [1, 5, 6, 7, 8, 9, 10, 11, 12, 13];
	let straightCounts = getNumberCountObject(); // distinct values that are in a straight with this value as the HIGH value
	let straightFlushCounts = getSuitCountObject(); // distinct values that are in a straight flush with this value as the HIGH value
	for (let suit of SUITS) {
		suitNumberCounts[suit] = getNumberCountObject();
		straightFlushCounts[suit] = getNumberCountObject();
	}
	for (let i = 0; i < handObj.length; i++) {
		numberCounts[handObj[i].number]++;
		suitCounts[handObj[i].suit]++;
		suitNumberCounts[handObj[i].suit][handObj[i].number]++;
	}
	for (let value of VALUES) {
		for (let suit of SUITS) {
			if (suitNumberCounts[suit][value] > 0) {
				let fillIn = value;
				if (fillIn >= 10) {
					straightFlushCounts[suit][1]++;
				}
				do {
					if (fillIn >= 5) {
						straightFlushCounts[suit][fillIn]++;
					}
					fillIn++;
				} while (fillIn - value < 5 && fillIn <= 13);
			}
		}
		if (numberCounts[value] > 0) {
			let fillIn = value;
			if (fillIn >= 10) {
				straightCounts[1]++;
			}
			do {
				if (fillIn >= 5) {
					straightCounts[fillIn]++;
				}
				fillIn++;
			} while (fillIn - value < 5 && fillIn <= 13);
		}
	}

	let setCounts = {
		0: 0,
		1: 0,
		2: 0,
		3: 0,
		4: 0
	}
	for (let number in numberCounts) {
		setCounts[numberCounts[number]]++;
	}

	return {
		numberCounts,
		suitCounts,
		suitNumberCounts,
		straightCounts,
		straightFlushCounts,
		setCounts
	}
}

// const handHas = {};
// handHas["One Pair"] = function(counts) {
// 	if (counts.setCounts[2] >= 1) return true;
// }

// handHas["Two Pair"] = function(counts) {
// 	// No need to count 3-2, 3-3, or 4-2 because those are higher hands anyway
// 	if (counts.setCounts[2] >= 2) return true;
// }

// handHas["Three of a Kind"] = function(counts) {
// 	if (counts.setCounts[3] >= 1) return true;
// }

// handHas["Straight"] = function(counts) {
// 	if (counts.straightCounts[1] >= 5) return true;
// 	for (let highVal = 5; highVal <= 13; highVal++) {
// 		if (counts.straightCounts[highVal] >= 5) return true;
// 	}
// }

// handHas["Flush"] = function(counts) {
// 	for (let suit in counts.suitCounts) {
// 		if (counts.suitCounts[suit] >= 5) return true;
// 	}
// }

// handHas["Full House"] = function(counts) {
// 	if (counts.setCounts[3] >= 1 && (counts.setCounts[3] + counts.setCounts[2] >= 2)) return true;
// }

// handHas["Four of a Kind"] = function(counts) {
// 	if (counts.setCounts[4] >= 1) return true;
// }

// handHas["Straight Flush"] = function(counts) {
// 	for (let suit in counts.straightFlushCounts) {
// 		for (let highVal = 5; highVal <= 13; highVal++) {
// 			if (counts.straightFlushCounts[suit][highVal] >= 5) return true;
// 		}
// 	}
// }

// handHas["Royal Flush"] = function(counts) {
// 	for (let suit in counts.straightFlushCounts) {
// 		if (counts.straightFlushCounts[suit][1] >= 5) return true;
// 	}
// }

// handHas["No Pair"] = function() {
// 	return true;
// }

const handHas = {};
handHas["One Pair"] = function(handObj) {
	let numberCounts = getNumberCountObject();
	for (let i = 0; i < handObj.length; i++) {
		numberCounts[handObj[i].number]++;
		if (numberCounts[handObj[i].number] >= 2) {
			return true;
		}
	}
}

handHas["Two Pair"] = function(handObj) {
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

handHas["Three of a Kind"] = function(handObj) {
	let numberCounts = getNumberCountObject();
	for (let i = 0; i < handObj.length; i++) {
		numberCounts[handObj[i].number]++;
		if (numberCounts[handObj[i].number] >= 3) {
			return true;
		}
	}
}

handHas["Straight"] = function(handObj) {
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

handHas["Flush"] = function(handObj) {
	let suitCounts = getSuitCountObject();
	for (let i = 0; i < handObj.length; i++) {
		suitCounts[handObj[i].suit]++;
		if (suitCounts[handObj[i].suit] >= 5) {
			return true;
		}
	}
}

handHas["Full House"] = function(handObj) {
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

handHas["Four of a Kind"] = function(handObj) {
	let numberCounts = getNumberCountObject();
	for (let i = 0; i < handObj.length; i++) {
		numberCounts[handObj[i].number]++;
		if (numberCounts[handObj[i].number] >= 4) {
			return true;
		}
	}
}

handHas["Straight Flush"] = function(handObj) {
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

handHas["Royal Flush"] = function(handObj) {
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

handHas["No Pair"] = function() {
	return true;
}

export function getHandResult(hand) {
	// let counts = getCardCounts(hand);
	
	let handObj = hand.map(function(cardValue) {
		return CARDS[cardValue];
	});

	// sorting actually makes it slower
	// let valueSortedHandObj = [...handObj].sort(function(a, b) {
	// 	if (b.value > a.value) return 1;
	// 	else if (b.value < a.value) return -1;
	// 	else return 0;
	// });

	// let suitSortedHandObj = [...handObj].sort(function(a, b) {
	// 	let aSuitIndex = SUITS.indexOf(a.suit);
	// 	let bSuitIndex = SUITS.indexOf(b.suit);
	// 	if (bSuitIndex > aSuitIndex) return 1;
	// 	else if (bSuitIndex < aSuitIndex) return -1;
	// 	else return 0;
	// });

	for (let handName of HAND_PRIORITY) {
		if (handHas[handName](handObj)) {
			return handName;
		}
	}

	return "???"
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
	let suitCounts = getSuitCountObject();
	let existingPairs = [];
	for (let i = 0; i < handObj.length; i++) {
		numberCounts[handObj[i].number]++;
		suitCounts[handObj[i].suit]++;
		if (numberCounts[handObj[i].number] === 2) {
			existingPairs.push(handObj[i].number);
			if (existingPairs.length > 1) {
				// not possible to get three of a kind; 3 of a kind must be 3-1-1-1-1
				return 0;
			}
		}
		if (numberCounts[handObj[i].number] > 3) return 0;
	}

	let possibilities = 0;
	for (let number in numberCounts) {
		// If there is an existing pair then that is the only number we need to consider
		if (existingPairs.length > 0 && number !== existingPairs[0]) {
			continue;
		}

		// need to subtract out straights and flushes

		let numNeeded = (3 - numberCounts[number]);
		let freeCards = 7 - handObj.length - numNeeded;
		if (freeCards >= 0) {
			let usedExtraValues = handObj.length - numberCounts[number];
			let waysToChooseExtraValues = combination(13 - 1 - usedExtraValues, freeCards) * 4;
			possibilities += combination(4 - numberCounts[number], numNeeded) * waysToChooseExtraValues;
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

	// Need to subtract flush hands that are also straights but are not straight flushes

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

getNum["Straight with Flush"] = function(handObj) {

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

export function getHandOdds_Dumb(hand, minHandLength = 3) {
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

	let loops = 0;

	let availableCards = Object.keys(CARDS).filter(function(cardValue) {
		return !hand.includes(cardValue);
	});

	if (hand.length >= minHandLength) {
		countHands(hand, availableCards);
	}

	function countHands(hand, availableCards) {
		loops++;
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

	// console.log("getHandOdds_Dumb: " + loops + " loops")

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

	let loops = 0;

	countHands(hand, availableCards, 1);

	function countHands(hand, availableCards, mult) {
		loops++;
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
						primary: suit,
						secondary: []
					}
				}
				else {
					suitGroups[suitSignatures[suit]].count++;
					suitGroups[suitSignatures[suit]].secondary.push(suit);
				}
				suitSuitGroups[suit] = suitGroups[suitSignatures[suit]];
			}

			availableCards.forEach(function(card, i) {
				let suit = card.slice(-1);
				if (suitSuitGroups[suit].primary === suit) {
					let nextHand = [...hand, card];
					let extraAccountedFor = suitSuitGroups[suit].secondary.map(function(subSuit) {
						return subSuit + card.slice(0, -1);
					});
					let nextAvailableCards = availableCards.slice(i+1).filter(function(cardValue) {
						return !extraAccountedFor.includes(cardValue);
					});
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

	console.log("getHandOdds_LessDumb: " + loops + " loops")

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

function getHandOdds_OneDimensionDumb(hand) {
	let possibleHands = combination(52 - hand.length, 7 - hand.length);

	let loops = 0;

	let numericCounts = {
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

	let numberCounts = getNumberCountObject();
	hand.forEach(function(cardValue) {
		numberCounts[CARDS[cardValue].number]++;
	})

	countNumericHands(numberCounts, 7 - hand.length);

	// cardsLeft is kept so we don't have to recalculate from currentNumberCounts every time
	// countFrom is the min value to start counting from so we don't count twice
	function countNumericHands(currentNumberCounts, cardsLeft, countFrom = 1, currentCombinations = 1) {
		loops++;
		if (cardsLeft > 0) {
			for (let number = countFrom; number <= 13; number++) {
				let numberLeft = 4 - currentNumberCounts[number];
				for (let choose = Math.min(numberLeft, cardsLeft); choose > 0; choose--) {
					let newCombinations = currentCombinations * combination(numberLeft, choose);
					let newNumberCounts = {...currentNumberCounts};
					newNumberCounts[number] += choose;
					countNumericHands(newNumberCounts, cardsLeft - choose, number + 1, newCombinations);
				}
			}
		}
		else {
			// This destroys currentNumberCounts
			const DUMMY_SUITS = ["s", "d", "h", "c", "s", "d", "h"];
			let numOn = 1;
			let dummyHand = [];
			for (let i = 0; i < 7; i++) {
				while (!currentNumberCounts[numOn]) {
					numOn++;
					if (numOn > 13) {
						console.log("countNumericHands end didn't have 7 cards", dummyHand);
						break;
					}
				}
				let value = VALUES[numOn - 1];
				dummyHand.push(value + DUMMY_SUITS[i]);
				currentNumberCounts[numOn]--;
			}

			numericCounts[getHandResult(dummyHand)] += currentCombinations;
		}
	}

	let suitedCounts = {
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

	let suitCounts = getSuitCountObject();
	hand.forEach(function(cardValue) {
		suitCounts[CARDS[cardValue].suit]++;
	})

	countSuitHands(suitCounts, 7 - hand.length);

	// cardsLeft is kept so we don't have to recalculate from currentNumberCounts every time
	// countFrom is the min value to start counting from so we don't count twice
	function countSuitHands(currentSuitCounts, cardsLeft, countFrom = 0, currentCombinations = 1) {
		loops++;
		if (cardsLeft > 0) {
			for (let suitId = countFrom; suitId < SUITS.length; suitId++) {
				let suit = SUITS[suitId];
				let suitsLeft = 13 - currentSuitCounts[suit];
				for (let choose = Math.min(suitsLeft, cardsLeft); choose > 0; choose--) {
					let newCombinations = currentCombinations * combination(suitsLeft, choose);
					let newSuitCounts = {...currentSuitCounts};
					newSuitCounts[suit] += choose;
					countSuitHands(newSuitCounts, cardsLeft - choose, suitId + 1, newCombinations);
				}
			}
		}
		else {
			// This destroys currentSuitCounts
			const DUMMY_VALUES = ["A", "J", "9", "7", "5", "3", "8"];
			let suitIdOn = 0;
			let dummyHand = [];
			for (let i = 0; i < 7; i++) {
				while (!currentSuitCounts[SUITS[suitIdOn]]) {
					suitIdOn++;
					if (suitIdOn > SUITS.length) {
						console.log("countSuitHands end didn't have 7 cards", dummyHand);
						break;
					}
				}
				let suit = SUITS[suitIdOn];
				dummyHand.push(DUMMY_VALUES[i] + suit);
				currentSuitCounts[suit]--;
			}

			suitedCounts[getHandResult(dummyHand)] += currentCombinations;
		}
	}

	let totalMult = 0;
	for (let handName in suitedCounts) {
		totalMult += suitedCounts[handName] * MULTS[handName];
	}

	console.log("getHandOdds_OneDimensionDumb: " + loops + " loops")
	console.log(numericCounts, suitedCounts)

	let handObj = hand.map(function(cardValue) {
		return CARDS[cardValue];
	});

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

	counts["Royal Flush"] = getNum["Royal Flush"](handObj);
	counts["Straight Flush"] = getNum["Straight Flush"](handObj) - counts["Royal Flush"];
	counts["Four of a Kind"] = numericCounts["Four of a Kind"];
	counts["Full House"] = numericCounts["Full House"];
	counts["Flush"] = suitedCounts["Flush"] - counts["Straight Flush"] - counts["Royal Flush"];
	counts["Straight"] = numericCounts["Straight"] - counts["Straight Flush"] - counts["Royal Flush"];
	counts["Three of a Kind"] = numericCounts["Three of a Kind"];
	counts["Two Pair"] = numericCounts["Two Pair"];
	counts["One Pair"] = numericCounts["One Pair"];
	counts["No Pair"] = numericCounts["No Pair"];

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

function getHandOdds_DistinctRanksMethod(hand) {
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

	let rankCounts = {
		"4-1-1-1": 0, // four of a kind
		"4-2-1": 0, // four of a kind
		"4-3": 0, // four of a kind
		"3-1-1-1-1": 0, // royal flush, straight flush, straight, flush, 3 of a kind
		"3-2-1-1": 0, // full house
		"3-2-2": 0, // full house
		"3-3-1": 0, // full house
		"2-1-1-1-1-1": 0, // royal flush, straight flush, straight, flush, one pair
		"2-2-1-1-1": 0, // royal flush, straight flush, straight, two pair, flush
		"2-2-2-1": 0, // two pair
		"1-1-1-1-1-1-1": 0, // royal flush, straight flush, straight, flush, no pair
	}

	let handObj = hand.map(function(cardValue) {
		return CARDS[cardValue];
	})

	let numberCounts = getNumberCountObject();
	let suitCounts = getSuitCountObject();
	let suitNumberCounts = getSuitCountObject();
	const STRAIGHT_HIGH_VALUES = [1, 5, 6, 7, 8, 9, 10, 11, 12, 13];
	let straightCounts = getNumberCountObject(); // distinct values that are in a straight with this value as the HIGH value
	let straightFlushCounts = getSuitCountObject(); // distinct values that are in a straight flush with this value as the HIGH value
	for (let suit of SUITS) {
		suitNumberCounts[suit] = getNumberCountObject();
		straightFlushCounts[suit] = getNumberCountObject();
	}
	for (let i = 0; i < handObj.length; i++) {
		numberCounts[handObj[i].number]++;
		suitCounts[handObj[i].suit]++;
		suitNumberCounts[handObj[i].suit][handObj[i].number]++;
	}
	for (let value of VALUES) {
		for (let suit of SUITS) {
			if (suitNumberCounts[suit][value] > 0) {
				let fillIn = value;
				if (fillIn >= 10) {
					straightFlushCounts[suit][1]++;
				}
				do {
					if (fillIn >= 5) {
						straightFlushCounts[suit][fillIn]++;
					}
					fillIn++;
				} while (fillIn - value < 5 && fillIn <= 13);
			}
		}
		if (numberCounts[value] > 0) {
			let fillIn = value;
			if (fillIn >= 10) {
				straightCounts[1]++;
			}
			do {
				if (fillIn >= 5) {
					straightCounts[fillIn]++;
				}
				fillIn++;
			} while (fillIn - value < 5 && fillIn <= 13);
		}
	}

	let currentRankCounts = {
		0: 0,
		1: 0,
		2: 0,
		3: 0,
		4: 0
	}
	for (let number in numberCounts) {
		currentRankCounts[numberCounts[number]]++;
	}

	let cardsLeft = 7 - hand.length;

	function countSets(currentRankCounts, setsOf) {
		let cardsLeft = 7;
		for (let count in currentRankCounts) {
			cardsLeft -= count * currentRankCounts[count];
		}

		let setsFrom = getValidSetsFrom([], setsOf);
		// console.log(setsOf, setsFrom);
		let totalCombinations = 0;
		setsFrom.forEach(function(sets) {
			let setCombinations = 1;
			sets.forEach(function(set) {
				if (set.get - set.from > 0) {
					setCombinations *= Math.pow(combination(4 - set.from, set.get - set.from), set.choices) * combination(set.options, set.choices);
				}
			});
			totalCombinations += setCombinations;
		});
		return totalCombinations;

		function countRanksLeft(rankCounts, sets) {
			let ranksLeft = {...rankCounts};
			sets.forEach(function(set) {
				ranksLeft[set.from]--;
			});
			return ranksLeft;
		}

		// [{
		// 	get: 3,
		// 	from: 2,
		// 	options: 1,
		// 	choices: 1
		// }]
		function getValidSetsFrom(currentSetsFrom, remainingSets) {
			if (remainingSets.length === 0) {
				// remove dupes
				let setsSignatures = {}; // g3f3-g1f1...
				let uniqueSetsFrom = [];
				currentSetsFrom.forEach(function(setsFrom) {
					let setsSig = setsFrom.map(function(set) {
						return "g" + set.get + "f" + set.from;
					}).sort().join("-");
					if (!setsSignatures[setsSig]) {
						setsSignatures[setsSig] = true;
						uniqueSetsFrom.push(setsFrom);
					}
				});
				// combine choices
				let groupedSetsFrom = [];
				uniqueSetsFrom.forEach(function(setsFrom) {
					let groupedSets = {};
					setsFrom.forEach(function(set) {
						let setName = "g" + set.get + "f" + set.from;
						if (!groupedSets[setName]) {
							groupedSets[setName] = {
								get: set.get,
								from: set.from,
								options: set.options,
								choices: 1
							}
						}
						else {
							if (set.options > groupedSets[setName].options) {
								groupedSets[setName].options = set.options;
							}
							groupedSets[setName].choices++;
						}
					});
					let groupedSetsList = [];
					for (let setName in groupedSets) {
						groupedSetsList.push(groupedSets[setName]);
					}
					groupedSetsFrom.push(groupedSetsList);
				});

				return groupedSetsFrom;
			}
			else {
				let nextSetCount = remainingSets[0];
				let nextSetsFrom = [];
				for (let setFrom = nextSetCount; setFrom >= 0; setFrom--) {
					if (currentSetsFrom.length === 0) {
						let rankCounts = currentRankCounts;
						if (!rankCounts[setFrom]) continue;
						let cardsNeeded = nextSetCount - setFrom;
						if (cardsNeeded > cardsLeft) continue;
						nextSetsFrom.push([{
							get: nextSetCount,
							from: setFrom,
							options: rankCounts[setFrom]
						}]);
					}
					else {
						currentSetsFrom.forEach(function(currentSets) {
							let rankCounts = countRanksLeft(currentRankCounts, currentSets);
							if (!rankCounts[setFrom]) return;
							let cardsNeeded = nextSetCount - setFrom;
							currentSets.forEach(function(set) {
								cardsNeeded += set.get - set.from;
							});
							if (cardsNeeded > cardsLeft) return;
							let newSets = [...currentSets, {
								get: nextSetCount,
								from: setFrom,
								options: rankCounts[setFrom]
							}];
							nextSetsFrom.push(newSets);
						});
					}
				}
				if (nextSetsFrom.length > 0) {
					return getValidSetsFrom(nextSetsFrom, remainingSets.slice(1));
				}
				else {
					return [];
				}
			}
		}
	}

	rankCounts["4-1-1-1"] = countSets(currentRankCounts, [4, 1, 1, 1]);
	rankCounts["4-2-1"] = countSets(currentRankCounts, [4, 2, 1]);
	rankCounts["4-3"] = countSets(currentRankCounts, [4, 3]);
	rankCounts["3-1-1-1-1"] = countSets(currentRankCounts, [3, 1, 1, 1, 1]);
	rankCounts["3-2-1-1"] = countSets(currentRankCounts, [3, 2, 1, 1]);
	rankCounts["3-2-2"] = countSets(currentRankCounts, [3, 2, 2]);
	rankCounts["3-3-1"] = countSets(currentRankCounts, [3, 3, 1]);
	rankCounts["2-1-1-1-1-1"] = countSets(currentRankCounts, [2, 1, 1, 1, 1, 1]);
	rankCounts["2-2-1-1-1"] = countSets(currentRankCounts, [2, 2, 1, 1, 1]);
	rankCounts["2-2-2-1"] = countSets(currentRankCounts, [2, 2, 2, 1]);
	rankCounts["1-1-1-1-1-1-1"] = countSets(currentRankCounts, [1, 1, 1, 1, 1, 1, 1]);

	console.log(rankCounts);

	let possibleHands = 0;
	for (let rankSet in rankCounts) {
		possibleHands += rankCounts[rankSet];
	}

	// console.log(possibleHands);

	counts["Four of a Kind"] = rankCounts["4-1-1-1"] + rankCounts["4-2-1"] + rankCounts["4-3"];
	counts["Full House"] = rankCounts["3-2-1-1"] + rankCounts["3-2-2"] + rankCounts["3-3-1"];
	counts["Two Pair"] = rankCounts["2-2-2-1"];

	// Royal flush, straight flush, straight, flush, 3 of a kind
	function breakdown31111() {

	}
	breakdown31111();

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
	return getHandOdds_Precalculated([]);
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

function getHandOdds_Precalculated(hand) {
	let counts = {}

	// Rules for hand order for lookup: All spades, unless same value, then 2nd is hearts
	// Cards go from high to low, ace is low
	// Join with space
	if (hand.length === 0) {
		counts = PRECALCULATED_HANDS[""];
	}
	else if (hand.length === 1) {
		let precalcHand = CARDS[hand[0]].value + "s";
		counts = PRECALCULATED_HANDS[precalcHand];
	}
	else if (hand.length === 2) {
		let precalcValues = [...hand].sort(function(a, b) {
			return CARDS[b].number - CARDS[a].number;
		}).map(function(cardValue) {
			return CARDS[cardValue].value + "s";
		});
		if (precalcValues[0] === precalcValues[1]) {
			precalcValues[1] = CARDS[precalcValues[0]].value + "h";
		}
		// console.log(precalcValues.join(" "))
		counts = PRECALCULATED_HANDS[precalcValues.join(" ")];
	}
	else {
		throw Error("Hands not precalculated for hand length " + hand.length);
	}

	let possibleHands = combination(52 - hand.length, 7 - hand.length);

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

export function getHandOdds(hand) {
	if (hand.length <= 2) {
		// hard-coded to avoid long calculation
		return getHandOdds_Precalculated(hand)
	}
	else {
		// countStraights(hand);
		// return getHandOdds_Smart(hand);
		// return getHandOdds_DistinctRanksMethod(hand);
		// getHandOdds_LessDumb(hand);
		return getHandOdds_Dumb(hand);
		// return getHandOdds_OneDimensionDumb(hand);
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
