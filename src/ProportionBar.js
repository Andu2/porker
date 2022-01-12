import "./ProportionBar.css";

function ProportionBar(props) {
	return (<div className="proportion-bar" style={{width: props.length * 100 + "px"}} ></div>)
}

export default ProportionBar;