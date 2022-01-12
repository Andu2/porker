import "./CardImage.css";
import {CARDS} from "./cards";

function CardImage(props) {
	if (!props.cardValue) {
		return (<div className="card-image-wrap"><img className="cardbg" src="images/cards/cardback.png" /></div>)
	}
	else {
		let cardObj = CARDS[props.cardValue];
		return (<div className={"card-image-wrap " + cardObj.suit + (props.big ? " big" : "")}>
			<img className="cardbg" src="images/cards/cardfront.png" />
			<img className="card-image-char" src={"images/cards/" + props.cardValue + ".png"} />
			<div className="card-image-value">
				<div className="card-image-number">{cardObj.value}</div>
				<img className="card-image-suit" src={"images/cards/" + cardObj.suit + ".png"} />
			</div>
			<div className="card-image-value bottom">
				<div className="card-image-number">{cardObj.value}</div>
				<img className="card-image-suit" src={"images/cards/" + cardObj.suit + ".png"} />
			</div>
		</div>)
	}
}

export default CardImage;