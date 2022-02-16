import { getHandResult, getHandOdds, getLinkBonuses } from "./poker";

let testHands = [
	{
		hand: [],
		expected: {
			"Royal Flush":		4324,
			"Straight Flush":	37260,
			"Four of a Kind":	224848,
			"Full House":		3473184,
			"Flush":			4047644,
			"Straight":			6180020,
			"Three of a Kind":	6461620,
			"Two Pair":			31433400,
			"One Pair":			58627800,
			"No Pair":			23294460
		}
	}, {
		hand: ["10c", "Jc", "Qc", "Kc", "2s", "3d"],
		expected: {
			"Royal Flush":		1,
			"Straight Flush":	1,
			"Four of a Kind":	0,
			"Full House":		0,
			"Flush":			7,
			"Straight":			6,
			"Three of a Kind":	0,
			"Two Pair":			0,
			"One Pair":			16,
			"No Pair":			15
		}
	}, {
		hand: ["5s", "6s", "8s", "9s", "7d", "9d"],
		expected: {
			"Royal Flush":		0,
			"Straight Flush":	1,
			"Four of a Kind":	0,
			"Full House":		0,
			"Flush":			8,
			"Straight":			37,
			"Three of a Kind":	0,
			"Two Pair":			0,
			"One Pair":			0,
			"No Pair":			0
		}
	}, {
		hand: ["8d", "2c", "8c", "4s"],
		expected: {
			"Royal Flush":		0,
			"Straight Flush":	0,
			"Four of a Kind":	48,
			"Full House":		928,
			"Flush":			165,
			"Straight":			189,
			"Three of a Kind":	1440,
			"Two Pair":			7155,
			"One Pair":			7371,
			"No Pair":			0
		}
	}, {
		hand: ["7s", "3c", "Ad"],
		expected: {
			"Royal Flush":		1,
			"Straight Flush":	9,
			"Four of a Kind":	148,
			"Full House":		3168,
			"Flush":			1475,
			"Straight":			6017,
			"Three of a Kind":	7920,
			"Two Pair":			43065,
			"One Pair":			101244,
			"No Pair":			48829
		}
	}, {
		hand: ["Qh", "Ac", "5d"],
		expected: {
			"Royal Flush":		2,
			"Straight Flush":	8,
			"Four of a Kind":	148,
			"Full House":		3168,
			"Flush":			1475,
			"Straight":			6270,
			"Three of a Kind":	7920,
			"Two Pair":			43065,
			"One Pair":			101244,
			"No Pair":			48576
		}
	}, {
		hand: ["Kd", "Jd", "9s"],
		expected: {
			"Royal Flush":		46,
			"Straight Flush":	51,
			"Four of a Kind":	148,
			"Full House":		3168,
			"Flush":			6998,
			"Straight":			17046,
			"Three of a Kind":	7656,
			"Two Pair":			41728,
			"One Pair":			92685,
			"No Pair":			42350
		}
	}, {
		hand: ["Qc", "Jc", "10c", "9c"],
		expected: {
			"Royal Flush":		46,
			"Straight Flush":	2070,
			"Four of a Kind":	4,
			"Full House":		108,
			"Flush":			6041,
			"Straight":			3683,
			"Three of a Kind":	259,
			"Two Pair":			1494,
			"One Pair":			2646,
			"No Pair":			945
		}
	}, {
		hand: ["Kd", "Jd", "9s", "9h"],
		expected: {
			"Royal Flush":		1,
			"Straight Flush":	1,
			"Four of a Kind":	48,
			"Full House":		928,
			"Flush":			163,
			"Straight":			742,
			"Three of a Kind":	1364,
			"Two Pair":			7056,
			"One Pair":			6993,
			"No Pair":			0
		}
	}, {
		hand: ["Jd", "9s", "9h", "Jc"],
		expected: {
			"Royal Flush":		0,
			"Straight Flush":	0,
			"Four of a Kind":	92,
			"Full House":		4004,
			"Flush":			0,
			"Straight":			192,
			"Three of a Kind":	0,
			"Two Pair":			13008,
			"One Pair":			0,
			"No Pair":			0
		}
	}, {
		hand: ["Ac", "Kc", "Qc"],
		expected: {
			"Royal Flush":		1081,
			"Straight Flush":	1,
			"Four of a Kind":	148,
			"Full House":		3168,
			"Flush":			37153,
			"Straight":			12068,
			"Three of a Kind":	7084,
			"Two Pair":			38340,
			"One Pair":			78624,
			"No Pair":			34209
		}
	}, {
		hand: ["Qc", "Jc", "10c", "9c", "8h"],
		expected: {
			"Royal Flush":		1,
			"Straight Flush":	90,
			"Four of a Kind":	0,
			"Full House":		0,
			"Flush":			287,
			"Straight":			703,
			"Three of a Kind":	0,
			"Two Pair":			0,
			"One Pair":			0,
			"No Pair":			0
		}
	}, {
		hand: ["Qc", "10c", "9c", "Kc"],
		expected: {
			"Royal Flush":		46,
			"Straight Flush":	1036,
			"Four of a Kind":	4,
			"Full House":		108,
			"Flush":			7075,
			"Straight":			2026,
			"Three of a Kind":	296,
			"Two Pair":			1692,
			"One Pair":			3528,
			"No Pair":			1485
		}
	}, {
		hand: ["8h", "9d", "Js", "7c"],
		expected: {
			"Royal Flush":		0,
			"Straight Flush":	0,
			"Four of a Kind":	4,
			"Full House":		108,
			"Flush":			0,
			"Straight":			4676,
			"Three of a Kind":	416,
			"Two Pair":			2412,
			"One Pair":			6480,
			"No Pair":			3200
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
