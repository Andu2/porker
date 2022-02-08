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
			numOnePair:			16,
			numNoPair:			15
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
	}, {
		hand: ["8d", "2c", "8c", "4s"],
		expected: {
			numRoyalFlush:		0,
			numStraightFlush:	0,
			numFourOfAKind:		48,
			numFullHouse:		928,
			numFlush:			165,
			numStraight:		189,
			numThreeOfAKind:	1440,
			numTwoPair:			7155,
			numOnePair:			7371,
			numNoPair:			0
		}
	}, {
		hand: ["7s", "3c", "Ad"],
		expected: {
			numRoyalFlush:		1,
			numStraightFlush:	9,
			numFourOfAKind:		148,
			numFullHouse:		3168,
			numFlush:			1475,
			numStraight:		6017,
			numThreeOfAKind:	7920,
			numTwoPair:			43065,
			numOnePair:			101244,
			numNoPair:			48829
		}
	}, {
		hand: ["Qh", "Ac", "5d"],
		expected: {
			numRoyalFlush:		2,
			numStraightFlush:	8,
			numFourOfAKind:		148,
			numFullHouse:		3168,
			numFlush:			1475,
			numStraight:		6270,
			numThreeOfAKind:	7920,
			numTwoPair:			43065,
			numOnePair:			101244,
			numNoPair:			48576
		}
	}, {
		hand: ["Kd", "Jd", "9s"],
		expected: {
			numRoyalFlush:		46,
			numStraightFlush:	51,
			numFourOfAKind:		148,
			numFullHouse:		3168,
			numFlush:			6998,
			numStraight:		17046,
			numThreeOfAKind:	7656,
			numTwoPair:			41728,
			numOnePair:			92685,
			numNoPair:			42350
		}
	}, {
		hand: ["Qc", "Jc", "10c", "9c"],
		expected: {
			numRoyalFlush:		46,
			numStraightFlush:	2070,
			numFourOfAKind:		4,
			numFullHouse:		108,
			numFlush:			6041,
			numStraight:		3683,
			numThreeOfAKind:	259,
			numTwoPair:			1494,
			numOnePair:			2646,
			numNoPair:			945
		}
	}, {
		hand: ["Kd", "Jd", "9s", "9h"],
		expected: {
			numRoyalFlush:		1,
			numStraightFlush:	1,
			numFourOfAKind:		48,
			numFullHouse:		928,
			numFlush:			163,
			numStraight:		742,
			numThreeOfAKind:	1364,
			numTwoPair:			7056,
			numOnePair:			6993,
			numNoPair:			0
		}
	}, {
		hand: ["Jd", "9s", "9h", "Jc"],
		expected: {
			numRoyalFlush:		0,
			numStraightFlush:	0,
			numFourOfAKind:		92,
			numFullHouse:		4004,
			numFlush:			0,
			numStraight:		192,
			numThreeOfAKind:	0,
			numTwoPair:			13008,
			numOnePair:			0,
			numNoPair:			0
		}
	}, {
		hand: ["Ac", "Kc", "Qc"],
		expected: {
			numRoyalFlush:		1081,
			numStraightFlush:	1,
			numFourOfAKind:		148,
			numFullHouse:		3168,
			numFlush:			37153,
			numStraight:		12068,
			numThreeOfAKind:	7084,
			numTwoPair:			38340,
			numOnePair:			78624,
			numNoPair:			34209
		}
	}, {
		hand: ["Qc", "Jc", "10c", "9c", "8h"],
		expected: {
			numRoyalFlush:		1,
			numStraightFlush:	90,
			numFourOfAKind:		0,
			numFullHouse:		0,
			numFlush:			287,
			numStraight:		703,
			numThreeOfAKind:	0,
			numTwoPair:			0,
			numOnePair:			0,
			numNoPair:			0
		}
	}, {
		hand: ["Qc", "10c", "9c", "Kc"],
		expected: {
			numRoyalFlush:		46,
			numStraightFlush:	1036,
			numFourOfAKind:		4,
			numFullHouse:		108,
			numFlush:			7075,
			numStraight:		2026,
			numThreeOfAKind:	296,
			numTwoPair:			1692,
			numOnePair:			3528,
			numNoPair:			1485
		}
	}, {
		hand: ["8h", "9d", "Js", "7c"],
		expected: {
			numRoyalFlush:		0,
			numStraightFlush:	0,
			numFourOfAKind:		4,
			numFullHouse:		108,
			numFlush:			0,
			numStraight:		4676,
			numThreeOfAKind:	416,
			numTwoPair:			2412,
			numOnePair:			6480,
			numNoPair:			3200
		}
	}]

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
