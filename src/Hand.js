import HandCard from "./HandCard";
import "./Hand.css";

function Hand(props) {
	let handSlots = [];
	for (let i = 0; i < 7; i++) {
		let classes = (i < 2 ? "in-hand" : "on-the-board");
		if (props.hand.length > i) {
			handSlots.push(<div className={classes}><HandCard key={i} cardValue={props.hand[i]} removeFromHand={props.removeFromHand} /></div>)
		}
		else {
			handSlots.push(<div className={classes}><HandCard className={classes} key={i} cardValue={""} removeFromHand={props.removeFromHand} /></div>)
		}
	}
	return (<div className="hand">
		{handSlots}
	</div>)
}

export default Hand;