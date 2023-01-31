import { Client } from "boardgame.io/client";
import { NotStuckInTraffic } from "./Game";

class NotStuckInTrafficClient {
    constructor(rootElement) {
        this.client = Client({ game: NotStuckInTraffic, numPlayers: 4, });
        this.client.start();
        this.rootElement = rootElement;
        this.createGameUI();
        this.attachListeners();
        this.client.subscribe(state => this.update(state));
    }

    createGameUI() {
        const rows = [];
        for (let i = 0; i < 13; i++) {
            const cells = [];
            for (let j = 0; j < 4; j++) {
                const id = 4 * i + j;
                cells.push(`<td class="cell" data-id="${id}"></td>`);
            }
            rows.push(`<tr>${cells.join('')}</tr>`);
        }

        // Add the HTML to our app <div>.
        // We’ll use the empty <p> to display the game winner later.
        this.rootElement.innerHTML = `
          <h2 class="main-title">Not Stuck in Traffic</h2>
          <div class="main-content">
            <div class="signature-box-big main-table-container">
                <table class="main-table">${rows.reverse().join('')}</table>
            </div>
            <div class="main-data-container">
                <div class="turn-message main-h2"></div>
                <div class="signature-box">
                    <button class="roll-dice primary-button">Roll Dice</button>
                    <div class="roll-result"></div>
                </div>
                <div class="section-subtitle">Game Data:</div>
                <div class="signature-box">
                    <div class="player-turn primary-box"></div>
                    <div class="total-moves primary-box"> Total Moves: 0</div>
                    <div class="winner primary-box">Winner: ??</div>
                </div>
            </div>
          </div>
        `;
    }

    attachListeners() {
        // This event handler will read the cell id from a cell’s
        // `data-id` attribute and make the `clickCell` move
        const handleCellClick = event => {
            const id = parseInt(event.target.dataset.id);
            this.client.moves.tryMove(id);
        };
        // Attach the event listener to each of the board cells
        const cells = this.rootElement.querySelectorAll('.cell');
        cells.forEach(cell => {
            cell.onclick = handleCellClick;
        });

        // This event handler will make the `rollDice` move
        const handleRollDice = event => {
            this.client.moves.rollDice();
        };
        // Attach the event listener to the dice button
        const rollDiceButton = this.rootElement.querySelector('.roll-dice');
        rollDiceButton.onclick = handleRollDice;
    }

    update(state) {
        if (state === null) return;
        // board (all cells)
        const cells = this.rootElement.querySelectorAll('.cell');
        cells.forEach(cell => {
            const cellId = parseInt(cell.dataset.id);
            const cellValue = state.G.cells[cellId];
            cell.textContent = cellValue !== null ? cellValue : '';
        });

        // your turn or not?
        const yourTurn = this.rootElement.querySelector('.turn-message');
        if (this.playerID == state.ctx.currentPlayer) {
            yourTurn.textContent = 'Your Turn!';
        } else {
            yourTurn.textContent = 'Wait';
        }

        // rollDice result
        const rollResult = this.rootElement.querySelector('.roll-result');
        switch (state.G.currentRoll) {
            case 1:
                rollResult.textContent = 'Move 0';
                break;
            case 2:
                rollResult.textContent = 'Move 1 Forward';
                break;
            case 3:
                rollResult.textContent = 'Move 1 Diagonally';
                break;
            case 4:
                rollResult.textContent = 'Move 2 Forward';
                break;
            case 5:
                rollResult.textContent = 'Place a red light!';
                break;
            default:
                rollResult.textContent = ' ';
                break;
        }

        // current player turn
        const playerTurn = this.rootElement.querySelector('.player-turn');
        playerTurn.textContent = 'Turn: Player ' + state.ctx.currentPlayer;

        // total moves
        const totalMoves = this.rootElement.querySelector('.total-moves');
        totalMoves.textContent = 'Total Moves: ' + state.G.totalMoves;

        // winner
        const messageWinner = this.rootElement.querySelector('.winner');
        if (state.ctx.gameover) {
            messageWinner.textContent = 'Winner: Player ' + state.ctx.gameover.winner;
        } else {
            messageWinner.textContent = 'Winner: ??';
        }
    }
}

const appElement = document.getElementById('app');
const app = new NotStuckInTrafficClient(appElement);