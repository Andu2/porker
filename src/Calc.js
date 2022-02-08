import "./Calc.css";
import { getHandOdds, getHandResult, getLinkBonuses, HAND_PRIORITY } from "./poker";
import { useState } from "react";
import ProportionBar from "./ProportionBar";

// 133784560 hands from 7
// 2118760 from 50 choose 5... more manageable
// 
// make number red if 0

const ROUND_DECIMALS = 3;

function roundPct(p) {
	return Math.round(p * 100 * Math.pow(10, ROUND_DECIMALS)) / Math.pow(10, ROUND_DECIMALS);
}

function round(p) {
	return Math.round(p * Math.pow(10, ROUND_DECIMALS)) / Math.pow(10, ROUND_DECIMALS);
}

function Calc(props) {
	let odds = getHandOdds(props.hand);
	let linkBonuses = getLinkBonuses(props.hand)

	// percents / counts
	const [displayMode, setDisplayMode] = useState("percents");
	// 5 / 1
	const [voltage, setVoltage] = useState(5);
	const [coinsPerVoltage, setCoinsPerVoltage] = useState(400);

	function handleDisplayMode(e) {
		setDisplayMode(e.target.value);
	}
	function handleVoltage(e) {
		setVoltage(e.target.value * 1);
	}
	function handleCoinsPerVoltage(e) {
		setCoinsPerVoltage(e.target.value);
	}

	const displayOrder = [];
	for (let i = HAND_PRIORITY.length - 1; i >= 0; i--) {
		displayOrder.push(HAND_PRIORITY[i]);
	}

	return (<div className="calc-wrap"><div className="calc">
		<div id="odds">
			<div id="odds-control">
				<label>Display:</label>
				<select value={displayMode} onChange={handleDisplayMode}>
					<option value="percents">Percentages</option>
					<option value="counts">Counts</option>
				</select>
			</div>
			<table><thead>
				<tr>
					<th style={{width: "140px"}}>Hand</th>
					<th style={{width: "100px"}}>{displayMode === "counts" ? "Count" : "Odds"}</th>
					<th style={{width: "120px"}}></th>
				</tr>
			</thead><tbody>
				{displayOrder.map(function(handName) {
					return (<tr>
						<td>{handName}:</td>
						<td><span className="number">{displayMode === "counts" ? odds[handName] : roundPct(odds[handName] / odds.possibleHands) + "%"}</span></td>
						<td><ProportionBar length={odds[handName] / odds.possibleHands} /></td>
					</tr>)
				})}
			</tbody></table>
		</div>
		<div id="misc">
			<div id="misc-control">
				<label>Voltage:</label>
				<select value={voltage} onChange={handleVoltage}>
					<option value="5">5</option>
					<option value="1">1</option>
				</select>
				<label>Coins per Voltage:</label>
				<input type="number" min="0" max="1000" value={coinsPerVoltage} onChange={handleCoinsPerVoltage} />
			</div>
			Average Multiplier: <span className="number">{round(odds.avgMult)}</span>
			<div id="links">
				<div id="link-bonuses-header">Link Bonuses</div>
				<div className="hand-linkbonuses">
					{linkBonuses.map(function(link, i) {
						return (<div className="link" key={i}>
							<div className="link-name"><span className="link-bonus-amount">[{link.bonus}]</span> {link.linkName}</div>
							<div className="link-chars"> > {link.chars.join(", ")}</div>
						</div>)
					})}
				</div>
			</div>
		</div>
	</div></div>)
}

export default Calc;