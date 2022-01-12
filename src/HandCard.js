import "./HandCard.css";
import CardImage from "./CardImage";

function HandCard(props) {
	return (
		<div className="hand-card"
			onClick={function(){ props.removeFromHand(props.cardValue) }}>
			<CardImage big={true} cardValue={props.cardValue} />
		</div>
	);
}

export default HandCard;