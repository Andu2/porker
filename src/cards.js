export const suits = ["c", "d", "h", "s"];
export const values = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"]

// https://d4dj.fandom.com/wiki/D4DJ_Groovy_Mix/Titles/Event#Poker_Event
export const CHAR_LINKS = {
	"DJ Mash & Link": 					["Rinku", "Maho"],
	"Peaceful Tea Time": 				["Rei", "Esora"],
	"Cousins": 							["Shinobu", "Nagisa"],
	"Sun and Moon": 					["Rika", "Tsubaki"],
	"Maid Tutor": 						["Saori", "Miyu"],
	"Authentic Curry": 					["Muni", "Rei"],
	"Peaky & Peaky": 					["Kyoko", "Shinobu"],
	"Power of Cooking": 				["Nagisa", "Hiiro"],
	"Our Destiny Forever": 				["Tsubaki", "Aoi"],
	"Enjoy & Relax": 					["Rika", "Marika"],
	"Prank Master": 					["Kurumi", "Miiko"],
	"The More We Fight": 				["Towa", "Noa"],
	"Muscle Union": 					["Yuka", "Ibuki", "Dalia"],
	"Cosplay Buddy": 					["Muni", "Towa", "Noa", "Hiiro", "Haruna"],
	"Remix Contest!!": 					["Maho", "Shinobu", "Saki"],
	"Childhood Friend's Duo": 			["Rinku", "Muni"],
	"Happy Around!": 					["Rinku", "Maho", "Muni", "Rei"],
	"Absolute Peak": 					["Kyoko", "Shinobu", "Yuka", "Esora"],
	"Colored Universe": 				["Saki", "Ibuki", "Towa", "Noa"],
	"Hyped-Up Mermaids": 				["Rika", "Marika", "Saori", "Dalia"],
	"Soaring Phosphorus Fire": 			["Tsubaki", "Nagisa", "Hiiro", "Aoi"],
	"May I Have Your Attention?": 		["Miyu", "Haruna", "Kurumi", "Miiko"],
	"Karate Punch!": 					["Maho", "Dalia"],
	"Fellow Pupils": 					["Kyoko", "Tsubaki"],
	"Choir": 							["Tsubaki", "Miyu"],
	"Best Moment": 						["Yuka", "Towa"],
	"Memorable School Festival": 		["Saori", "Nagisa"],
	"Cat Tamer": 						["Saki", "Ibuki", "Dalia"],
	"Demure Beauty": 					["Rei", "Marika"],
	"The DJ of Dreams": 				["Aoi", "Haruna"],
	"Watching Party": 					["Noa", "Kurumi"],
	"Lovely Beam": 						["Esora", "Miiko"],
	"Most Important Thing": 			["Rinku", "Rei"],
	"HapiAra Parent Association": 		["Maho", "Muni"],
	"Morning Call": 					["Tsubaki", "Hiiro"],
	"Popcorn Union": 					["Aoi", "Nagisa"],
	"overDress": 						["Miyu", "Aoi"],
	"Persona Ride": 					["Shinobu", "Haruna"],
	"You Really Love It": 				["Hiiro", "Shinobu"],
	"The Art of Food Stall Tour": 		["Miiko", "Nagisa"],
	"Midnight Tag": 					["Dalia", "Saori"],
	"I'm not afraid of being alone!": 	["Yuka", "Ibuki"]
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
