import { Game, Grid } from "../game-logic/game.js";
import { PortalTile } from "../game-logic/tiles.js";
import { diceRoll, Point } from "../game-logic/utils.js";
/**
 * Constants
 */
const ROLL_SIZE = 6;
const GRID_W = 10;
const GRID_H = 10;

/**
 * Received Data
 */
const players = ["Momo", "ZoZ", "Andrew", "Haneen"];

// Build game
const playerIds = [];
for (let i in players){ // NOTE!!!: js for ... in returns index only i.e [0,1,2,3]
	playerIds.push(i);
}
let grid = new Grid(GRID_W,GRID_H);

// grid.addTile(new PortalTile(new Point(2,3),new Point(0,0)));
// grid.addTile(new PortalTile(new Point(1,3),new Point(0,0)));

let game = new Game(playerIds,grid);

/**
 * DOM REFERENCES (Static Elements)
 */
const rollButton = document.getElementById("rollDiceButton");
const diceImage = document.getElementById("diceIcon");
const activeTurnDisplay = document.getElementById("activeTurnPlayerName");

// Containers
const leaderboardContainer = document.getElementById("playersLeaderboard");
const logContainer = document.getElementById("gameLogPlayersList");
const playerMarkerContainer = document.getElementById("playerMarkerContainer");

// Templates
const cardTemplate = document.getElementById("playerInfo");
const logTemplate = document.getElementById("gameLogPlayers");
const playerMarkerTemplate = document.getElementById("playerMarker");

/**
 * UI REFERENCES (Dynamic Elements)
 * stored in arrays so we never have to use querySelector again
 */
const uiSquareValues = [];
const uiCardContainers = [];
const uiLogs = [];
const uiPlayerMarkers = [];

/**
 * INITIALIZATION: setUpPlayers
 */
function setUpPlayers() {
	// Clear containers in case of a game reset
	leaderboardContainer.innerHTML = "";
	logContainer.innerHTML = "";

	players.forEach((name, index) => {
		// 1. Create Leaderboard Card
		const cardFragment = cardTemplate.content.cloneNode(true);

		const cardContainer = cardFragment.firstElementChild;
		const nameHeading = cardFragment.querySelector("h5");
		const positionSpan = cardFragment.querySelector(".currentPlayerSquareNumber");

		nameHeading.textContent = name;
		positionSpan.textContent = "0";
		if (index === 0) {
			cardContainer.classList.add("PickedPlayerTurn");
		}

		// Store reference so we can update it later by index
		uiCardContainers.push(cardContainer);
		uiSquareValues.push(positionSpan);
		leaderboardContainer.appendChild(cardFragment);

		// 2. Create Player Markers
		const markerFragment = playerMarkerTemplate.content.cloneNode(true);
		const markerItem = markerFragment.firstElementChild;

		// marker.style.color = playerColors[index];

		// Store reference to the log item
		uiPlayerMarkers.push(markerItem);
		playerMarkerContainer.appendChild(markerFragment);

		// 3. Create Game Log Entry
		const logFragment = logTemplate.content.cloneNode(true);
		const logItem = logFragment.firstElementChild;

		logItem.textContent = `${name} rolled a 0 and moved to Square 0`;

		// Store reference to the log item
		uiLogs.push(logItem);
		logContainer.appendChild(logFragment);
	});

	players.forEach((_,index)=>{
		updateMarkerPosition(index,true);
	});


	// Set initial turn text
	updateTurnDisplay();
}

function updateMarkerPosition(index,instant=false){
	//TODO:implement animations
	if (instant||true/*currently defaults to instant */){

		// currently alternating left position visually
		// and flipping y direction (advance up)
		const pos = game.players.get(game.current).position;
		const yIndex = (GRID_H-pos.y-1);
		let xIndex = pos.x;
		if (pos.y%2!==0){
			xIndex = (GRID_W-pos.x-1);
		}

		const xPx = xIndex*80+10;
		const yPx = yIndex*80+10;
		uiPlayerMarkers[index].style.left = `${xPx}px`;
		uiPlayerMarkers[index].style.top = `${yPx}px`;
	}
}

function updateTurnDisplay() {
	activeTurnDisplay.textContent = `${players[game.current]}'s Turn`;
}

// Execute setup on script load
setUpPlayers();

/**
 * advances player and displays the changes along the way
 * @param {number} result
 */
function updatePositionsUI(result) {
	// TODO: currently a player wins even if they roll too high
	// if that needs to change update the advance function in grid

	// advance player
	let effects = game.advancePlayer(game.current,result);

	updateMarkerPosition(game.current);

	// process roll result
	game.processEffects(game.current,effects);

	updateMarkerPosition(game.current);

	// Update visual square number using our array reference
	let pos = game.players.get(game.current).position;
	let distance = pos.y*GRID_W+pos.x+1;
	uiSquareValues[game.current].textContent = `Square ${distance}`;

	// Update the game log text using our array reference
	uiLogs[game.current].textContent = `${players[game.current]} rolled a ${result} and moved to Square ${distance}`;
}

/**
 * TURN MANAGEMENT: activePlayerLeaderboardHighlight
 * Manages the CSS classes on the player card containers.
 */
function activePlayerLeaderboardHighlight() {
	// 1. Target the .playerInfo container of the player who just moved
	uiCardContainers[game.current].classList.remove("PickedPlayerTurn");

	// 2. Increment index
	game.updateQueues();

	// 3. Highlight the new player
	uiCardContainers[game.current].classList.add("PickedPlayerTurn");

	updateTurnDisplay();
}

/**
 * EVENT LISTENERS
 */
rollButton.addEventListener("click", () => {
	// Check win condition
	if (game.winQueue.length > 0) {return;}

	rollButton.disabled = true;
	diceImage.src = "../assets/images/dice-animation.gif";


	let result = diceRoll(ROLL_SIZE);

	setTimeout(() => {
		diceImage.src = `../assets/images/dice-${result}.png`;

		updatePositionsUI(result);
		activePlayerLeaderboardHighlight();

		rollButton.disabled = false;
	}, 1000);
});