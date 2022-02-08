import "./ProportionBar.css";

const WIDTH = 120;

function ProportionBar(props) {
	return (<div className="proportion-bar-back" style={{width: WIDTH + "px"}}>
		<div className="proportion-bar" style={{width: props.length * WIDTH + "px"}} ></div>
	</div>)
}

export default ProportionBar;