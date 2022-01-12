import CardOption from "./CardOption";

import './CardSelect.css';

function CardSelect(props) {
	let cardValues = [];
	const suits = ["c", "d", "h", "s"];
	const values = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"]
	suits.forEach(function(suit) {
		let suitValues = [];
		values.forEach(function(value){
			suitValues.push(value + suit);
		});
		cardValues.push(suitValues);
	});
	return (<div className="card-select">
		{cardValues.map(function(suitValues, i) {
			return (<div key={suits[i]} className="card-select-suit">
				{suitValues.map(function(cardValue) {
					return <CardOption 
						key={cardValue} 
						cardValue={cardValue} 
						selected={props.hand.includes(cardValue)} 
						addToHand={props.addToHand} />
				})}
			</div>);
		})}
	</div>)
}

export default CardSelect;