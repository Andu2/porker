import { getHandResult, getHandOdds, getLinkBonuses } from "./poker";

let testHands = [
	{
		hand: [],
		expected: {
			numRoyalFlush:		4324,
			numStraightFlush:	37260,
			numFourOfAKind:		224848,
			numFullHouse:		3473184,
			numFlush:			4047644,
			numStraight:		6180020,
			numThreeOfAKind:	6461620,
			numTwoPair:			31433400,
			numOnePair:			58627800,
			numNoPair:			23294460
		}
	}, {
		hand: ["10c", "Jc", "Qc", "Kc", "2s", "3d"],
		expected: {
			numRoyalFlush:		1,
			numStraightFlush:	1,
			numFourOfAKind:		0,
			numFullHouse:		0,
			numFlush:			7,
			numStraight:		6,
			numThreeOfAKind:	0,
			numTwoPair:			0,
			numOnePair:			18,
			numNoPair:			13
		}
	}, {
		hand: ["5s", "6s", "8s", "9s", "7d", "9d"],
		expected: {
			numRoyalFlush:		0,
			numStraightFlush:	1,
			numFourOfAKind:		0,
			numFullHouse:		0,
			numFlush:			8,
			numStraight:		37,
			numThreeOfAKind:	0,
			numTwoPair:			0,
			numOnePair:			0,
			numNoPair:			0
		}
	}
]

testHands.forEach(function(test) {
	let testName = test.hand.join(" ") || "(no cards)";
	it(testName, function() {
		let handOdds = getHandOdds(test.hand);
		let simplifiedHandOdds = {} // only whatever is expected
		for (let num in test.expected) {
			simplifiedHandOdds[num] = handOdds[num];
		}
		expect(simplifiedHandOdds).toEqual(test.expected)
	})
})
