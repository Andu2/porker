import './CardOption.css';
import CardImage from "./CardImage";

function CardOption(props) {
	let classes = "card-option";
	if (props.selected) {
		classes += " selected"
	}
	return (
		<div className={classes} 
			onClick={function(){ props.addToHand(props.cardValue) }}>
			<CardImage cardValue={props.cardValue} />
		</div>
	);
}

export default CardOption;