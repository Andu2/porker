import { useState } from "react";

import CardSelect from "./CardSelect";
import Hand from "./Hand";
import Calc from "./Calc";
import { CARDS } from "./cards";
import { MULTS, getHandResult } from "./poker";

import logo from "./logo.svg";
import "./App.css";

const MAX_CARDS = 7;

function App() {
	const [hand, setHand] = useState([]);

	function addToHand(card) {
		// convenience: If card is already in hand, actually remove the card instead
		if (hand.includes(card)) {
			removeFromHand(card);
		}
		else if (hand.length < MAX_CARDS) {
			setHand([...hand, card]);
		}
	}

	function removeFromHand(card) {
		setHand(hand.filter(function(handCard) {
			return handCard !== card;
		}));
	}

	function clear() {
		setHand([]);
	}

	function getRandom(hand) {
		let availableCards = Object.keys(CARDS).filter(function(cardValue) {
			return !hand.includes(cardValue);
		});
		let chosenCard = Math.floor(Math.random() * availableCards.length);
		return availableCards[chosenCard];
	}

	function addRandom() {
		if (hand.length < 7) {
			let tempHand = [...hand];
			tempHand.push(getRandom(tempHand));
			if (hand.length === 0) {
				// pick first two cards at once
				tempHand.push(getRandom(tempHand));
			}
			setHand([...tempHand]);
		}
	}

	function randomAll() {
		let tempHand = [];
		if (hand.length < 7) {
			tempHand = [...hand];
		}
		while (tempHand.length < 7) {
			tempHand.push(getRandom(tempHand));
		}
		setHand([...tempHand]);
	}

	function getStyledHandResult(hand) {
		let result = getHandResult(hand);
		if (MULTS[result] >= 2000) return result + "!!!";
		else if (MULTS[result] >= 250) return result + "!!";
		else if (MULTS[result] >= 50) return result + "!";
		else return result;
	}

	return (
		<div className="App">
			<header className="App-header">
				<img className="header-image" src="images/rika-2.png" />
				<img className="header-image" src="images/marika-1.png" />
				<div className="header-text">
					<div className="header-text-primary">Porker</div>
					<div className="header-text-subtitle">D4DJ Poker Odds</div>
				</div>
				<img className="header-image" src="images/dalia-3.png" />
				<img className="header-image" src="images/saori-4.png" />
			</header>
			<CardSelect hand={hand} addToHand={addToHand} />
			<Hand hand={hand} removeFromHand={removeFromHand} />
			<div id="control">
				<div id="control-buttons">
					<div className="button" onClick={addRandom}>Random Next</div>
					<div className="button" onClick={randomAll}>Random All</div>
					<div className="button" onClick={clear}>Clear</div>
				</div>
				<div id="control-handresult">
					{getStyledHandResult(hand)}
				</div>
			</div>
			<Calc hand={hand} />
		</div>
	);
}

export default App;
