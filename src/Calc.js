import "./Calc.css";
import { getHandOdds, getHandResult, getLinkBonuses, HAND_PRIORITY, getHandOdds_Base } from "./poker";
import { useState } from "react";
import ProportionBar from "./ProportionBar";

// make number red if 0

const ROUND_DECIMALS = 3;
const baseOdds = getHandOdds_Base();

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

	let cardsPlayed = Math.max(props.hand.length - 2, 0);
	let investment = coinsPerVoltage * voltage * cardsPlayed;
	let linkBonusInvestment = 0;
	linkBonuses.forEach(function(link) {
		linkBonusInvestment += link.bonus;
	});
	investment += linkBonusInvestment;

	let playValue = 0;
	let resetValue = 0;
	let playCost = voltage;
	let resetCost = voltage + 1;
	let decision = "Play next"
	if (odds.avgMult > 0 && cardsPlayed < 5) {
		let nextInvestment = coinsPerVoltage * voltage; // TODO: link bonus
		playValue = (investment + nextInvestment) * odds.avgMult / playCost;
		resetValue = (investment + nextInvestment * baseOdds.avgMult) / resetCost;
	}
	if (resetValue > playValue) {
		decision = "Reset"
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
			<div id="analysis">
				<div>Average Multiplier: <span className="number">{round(odds.avgMult)}</span></div>
				<div>Investment: <span className="number">{investment}</span></div>
				{(function() {
					if (cardsPlayed < 5) {
						return (<div>
							<div>Play coins per voltage: <span className="number">{round(playValue)}</span></div>
							<div>Reset coins per voltage: <span className="number">{round(resetValue)}</span></div>
							<div>Decision: <span className="decision">{decision}</span></div>
						</div>)
					}
					else {
						return (<div>
							<div>Payout: <span className="number">{round(investment * odds.avgMult)}</span></div>
						</div>)
					}
				})()}
				
			</div>
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