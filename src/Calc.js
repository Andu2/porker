import "./Calc.css";
import { getHandOdds, getHandResult, getLinkBonuses } from "./poker";
import ProportionBar from "./ProportionBar";

// 133784560 hands from 7
// 2118760 from 50 choose 5... more manageable
// 
// make number red if 0

function roundPct(p) {
	return Math.round(p * 10000) / 100;
}

function round(p) {
	return Math.round(p * 100) / 100;
}

function Calc(props) {
	let odds = getHandOdds(props.hand);
	let linkBonuses = getLinkBonuses(props.hand)

	return (<div className="calc-wrap"><div className="calc">
		<div id="odds">
			<div className="hand-result">{getHandResult(props.hand)}</div>
			<table><tbody>
				<tr>
					<td>No Pair:</td>
					<td>{odds.numNoPair}</td>
					<td>{roundPct(odds.numNoPair / odds.possibleHands)}</td>
					<td><ProportionBar length={odds.numNoPair / odds.possibleHands} /></td>
				</tr>
				<tr>
					<td>One Pair:</td>
					<td>{odds.numOnePair}</td>
					<td>{roundPct(odds.numOnePair / odds.possibleHands)}</td>
					<td><ProportionBar length={odds.numOnePair / odds.possibleHands} /></td>
				</tr>
				<tr>
					<td>Two Pair:</td>
					<td>{odds.numTwoPair}</td>
					<td>{roundPct(odds.numTwoPair / odds.possibleHands)}</td>
					<td><ProportionBar length={odds.numTwoPair / odds.possibleHands} /></td>
				</tr>
				<tr>
					<td>Three of a Kind:</td>
					<td>{odds.numThreeOfAKind}</td>
					<td>{roundPct(odds.numThreeOfAKind / odds.possibleHands)}</td>
					<td><ProportionBar length={odds.numThreeOfAKind / odds.possibleHands} /></td>
				</tr>
				<tr>
					<td>Straight</td>
					<td>{odds.numStraight}</td>
					<td>{roundPct(odds.numStraight / odds.possibleHands)}</td>
					<td><ProportionBar length={odds.numStraight / odds.possibleHands} /></td>
				</tr>
				<tr>
					<td>Flush:</td>
					<td>{odds.numFlush}</td>
					<td>{roundPct(odds.numFlush / odds.possibleHands)}</td>
					<td><ProportionBar length={odds.numFlush / odds.possibleHands} /></td>
				</tr>
				<tr>
					<td>Full House:</td>
					<td>{odds.numFullHouse}</td>
					<td>{roundPct(odds.numFullHouse / odds.possibleHands)}</td>
					<td><ProportionBar length={odds.numFullHouse / odds.possibleHands} /></td>
				</tr>
				<tr>
					<td>Four of a Kind:</td>
					<td>{odds.numFourOfAKind}</td>
					<td>{roundPct(odds.numFourOfAKind / odds.possibleHands)}</td>
					<td><ProportionBar length={odds.numFourOfAKind / odds.possibleHands} /></td>
				</tr>
				<tr>
					<td>Straight Flush:</td>
					<td>{odds.numStraightFlush}</td>
					<td>{roundPct(odds.numStraightFlush / odds.possibleHands)}</td>
					<td><ProportionBar length={odds.numStraightFlush / odds.possibleHands} /></td>
				</tr>
				<tr>
					<td>Royal Flush:</td>
					<td>{odds.numRoyalFlush}</td>
					<td>{roundPct(odds.numRoyalFlush / odds.possibleHands)}</td>
					<td><ProportionBar length={odds.numRoyalFlush / odds.possibleHands} /></td>
				</tr>
			</tbody></table>
		</div>
		<div id="links">
			<div id="link-bonuses-header">Link Bonuses</div>
			<div className="hand-linkbonuses">
				{linkBonuses.map(function(linkName, i) {
					return <div key={i}>{linkName}</div>
				})}
			</div>
		</div>
		<div id="misc">
			Average Multiplier: {round(odds.avgMult)}
		</div>
	</div></div>)
}

export default Calc;