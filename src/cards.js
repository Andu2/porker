export const suits = ["c", "d", "h", "s"];
export const values = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"]

// https://d4dj.fandom.com/wiki/D4DJ_Groovy_Mix/Titles/Event#Poker_Event
export const CHAR_LINKS = {
	"DJ Mash & Link": {
		chars: ["Rinku", "Maho"],
		bonus: 1000
	},
	"Peaceful Tea Time": {
		chars: ["Rei", "Esora"],
		bonus: 1000
	},
	"Cousins": {
		chars: ["Shinobu", "Nagisa"],
		bonus: 1000
	},
	"Sun and Moon": {
		chars: ["Rika", "Tsubaki"],
		bonus: 1000
	},
	"Maid Tutor": {
		chars: ["Saori", "Miyu"],
		bonus: 1000
	},
	"Authentic Curry": {
		chars: ["Muni", "Rei"],
		bonus: 1000
	},
	"Peaky & Peaky": {
		chars: ["Kyoko", "Shinobu"],
		bonus: 1000
	},
	"Power of Cooking": {
		chars: ["Nagisa", "Hiiro"],
		bonus: 1000
	},
	"Our Destiny Forever": {
		chars: ["Tsubaki", "Aoi"],
		bonus: 1000
	},
	"Enjoy & Relax": {
		chars: ["Rika", "Marika"],
		bonus: 1000
	},
	"Prank Master": {
		chars: ["Kurumi", "Miiko"],
		bonus: 1000
	},
	"The More We Fight": {
		chars: ["Towa", "Noa"],
		bonus: 1000
	},
	"Muscle Union": {
		chars: ["Yuka", "Ibuki", "Dalia"],
		bonus: 2000
	},
	"Cosplay Buddy": {
		chars: ["Muni", "Towa", "Noa", "Hiiro", "Haruna"],
		bonus: 5000
	},
	"Remix Contest!!": {
		chars: ["Maho", "Shinobu", "Saki"],
		bonus: 2000
	},
	"Childhood Friend's Duo": {
		chars: ["Rinku", "Muni"],
		bonus: 1000
	},
	"Happy Around!": {
		chars: ["Rinku", "Maho", "Muni", "Rei"],
		bonus: 4000
	},
	"Absolute Peak": {
		chars: ["Kyoko", "Shinobu", "Yuka", "Esora"],
		bonus: 4000
	},
	"Colored Universe": {
		chars: ["Saki", "Ibuki", "Towa", "Noa"],
		bonus: 4000
	},
	"Hyped-Up Mermaids": {
		chars: ["Rika", "Marika", "Saori", "Dalia"],
		bonus: 4000
	},
	"Soaring Phosphorus Fire": {
		chars: ["Tsubaki", "Nagisa", "Hiiro", "Aoi"],
		bonus: 4000
	},
	"May I Have Your Attention?": {
		chars: ["Miyu", "Haruna", "Kurumi", "Miiko"],
		bonus: 4000
	},
	"Karate Punch!": {
		chars: ["Maho", "Dalia"],
		bonus: 1000
	},
	"Fellow Pupils": {
		chars: ["Kyoko", "Tsubaki"],
		bonus: 1000
	},
	"Choir": {
		chars: ["Tsubaki", "Miyu"],
		bonus: 1000
	},
	"Best Moment": {
		chars: ["Yuka", "Towa"],
		bonus: 1000
	},
	"Memorable School Festival": {
		chars: ["Saori", "Nagisa"],
		bonus: 1000
	},
	"Cat Tamer": {
		chars: ["Saki", "Ibuki", "Dalia"],
		bonus: 2000
	},
	"Demure Beauty": {
		chars: ["Rei", "Marika"],
		bonus: 1000
	},
	"The DJ of Dreams": {
		chars: ["Aoi", "Haruna"],
		bonus: 1000
	},
	"Watching Party": {
		chars: ["Noa", "Kurumi"],
		bonus: 1000
	},
	"Lovely Beam": {
		chars: ["Esora", "Miiko"],
		bonus: 1000
	},
	"Most Important Thing": {
		chars: ["Rinku", "Rei"],
		bonus: 1000
	},
	"HapiAra Parent Association": {
		chars: ["Maho", "Muni"],
		bonus: 1000
	},
	"Morning Call": {
		chars: ["Tsubaki", "Hiiro"],
		bonus: 1000
	},
	"Popcorn Union": {
		chars: ["Aoi", "Nagisa"],
		bonus: 1000
	},
	"overDress": {
		chars: ["Miyu", "Aoi"],
		bonus: 1000
	},
	"Persona Ride": {
		chars: ["Shinobu", "Haruna"],
		bonus: 1000
	},
	"You Really Love It": {
		chars: ["Hiiro", "Shinobu"],
		bonus: 1000
	},
	"The Art of Food Stall Tour": {
		chars: ["Miiko", "Nagisa"],
		bonus: 1000
	},
	"Midnight Tag": {
		chars: ["Dalia", "Saori"],
		bonus: 1000
	},
	"I'm not afraid of being alone!": {
		chars: ["Yuka", "Ibuki"],
		bonus: 1000
	},
}

// CLUBS/HEARTS   DIAMONDS/SPADES
// A - Muni           Rinku
// 2 - Yuka           Kyoko
// 3 - Towa           Saki
// 4 - Saori          Rika
// 5 - Hiiro          Tsubaki
// 6 - Kurumi         Miyu
// 7 - Rei            Maho
// 8 - Esora          Shinobu
// 9 - Noa            Ibuki
// 10 - Dalia         Marika
// J - Aoi            Nagisa
// Q - Miiko          Haruna
// K - [Event members in costume]

const CARD_CHARS = {
	"Ac":	"Muni",		"Ah":	"Muni",		"Ad":	"Rinku",	"As":	"Rinku",
	"2c":	"Yuka",		"2h":	"Yuka",		"2d":	"Kyoko",	"2s":	"Kyoko",
	"3c":	"Towa",		"3h":	"Towa",		"3d":	"Saki",		"3s":	"Saki",
	"4c":	"Saori",	"4h":	"Saori",	"4d":	"Rika",		"4s":	"Rika",
	"5c":	"Hiiro",	"5h":	"Hiiro",	"5d":	"Tsubaki",	"5s":	"Tsubaki",
	"6c":	"Kurumi",	"6h":	"Kurumi",	"6d":	"Miyu",		"6s":	"Miyu",
	"7c":	"Rei",		"7h":	"Rei",		"7d":	"Maho",		"7s":	"Maho",
	"8c":	"Esora",	"8h":	"Esora",	"8d":	"Shinobu",	"8s":	"Shinobu",
	"9c":	"Noa",		"9h":	"Noa",		"9d":	"Ibuki",	"9s":	"Ibuki",
	"10c":	"Dalia",	"10h":	"Dalia",	"10d":	"Marika",	"10s":	"Marika",
	"Jc":	"Aoi",		"Jh":	"Aoi",		"Jd":	"Nagisa",	"Js":	"Nagisa",
	"Qc":	"Miiko",	"Qh":	"Miiko",	"Qd":	"Haruna",	"Qs":	"Haruna",
	"Kc":	"",			"Kh":	"",			"Kd":	"",			"Ks":	""
}

function getNumberValue(numberString) {
	if (numberString === "A") return 1;
	else if (numberString === "J") return 11;
	else if (numberString === "Q") return 12;
	else if (numberString === "K") return 13;
	else return numberString * 1;
}

// Build cards object for quick value/suit lookup without having to parse string
export let CARDS = {};
for (let cardValue in CARD_CHARS) {
	let suit = cardValue.slice(-1);
	let value = cardValue.slice(0, -1);
	let number = getNumberValue(value);
	CARDS[cardValue] = {
		suit: suit,
		value: value,
		number: number,
		char: CARD_CHARS[cardValue]
	}
}
