import { getHandOdds_Dumb } from "./poker.mjs";
import { CARDS, SUITS, VALUES } from "./cards.mjs";

let possibleHands_OneCard = VALUES.map(function(value) {
	return [value + "s"];
});

let possibleHands_TwoCards = [];
VALUES.forEach(function(value1, i) {
	VALUES.forEach(function(value2, j) {
		// high card comes first in hand name
		if (i >= j) {
			if (i === j) {
				// only unsuited
				possibleHands_TwoCards.push([value1 + "s", value2 + "h"])
			}
			else {
				// suited / unsuited
				possibleHands_TwoCards.push([value1 + "s", value2 + "s"])
				possibleHands_TwoCards.push([value1 + "s", value2 + "h"])
			}
		}
	});
});

possibleHands_TwoCards.forEach(function(hand) {
	console.log(hand.join(" "));
	console.log(getHandOdds_Dumb(hand, 0));
})

console.log("Done")

