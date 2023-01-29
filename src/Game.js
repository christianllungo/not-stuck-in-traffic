import { INVALID_MOVE } from 'boardgame.io/core';

export const NotStuckInTraffic = {
    setup: () => {
        let cells = Array(52).fill(null);
        cells[0] = 0;
        cells[1] = 1;
        cells[2] = 2;
        cells[3] = 3;
        let currentPlayerPositions = [0, 1, 2, 3];
        let currentRoll;
        let cellsAllowed = [];
        let redLights = [];
        let isRolled = false;
        let totalMoves = 0;

        return {
            cells: cells,
            currentRoll: currentRoll,
            cellsAllowed: cellsAllowed,
            currentPlayerPositions: currentPlayerPositions,
            /* redLights: [ {placedBy: 0, turnsLeft: 2, position: 11}, {placedBy: 1, turnsLeft: 1, position: 28} ], */
            redLights: redLights,
            isRolled: isRolled,
            totalMoves: totalMoves,
        }
    },

    turn: {
        minMoves: 1,
        onEnd: UpdateRedLights,
    },

    moves: { RollDice, TryMove, ChooseCell, PlaceRedLight },

    endIf: ({ G, ctx }) => {
        if (isVictory(G, ctx)) {
            return { winner: ctx.currentPlayer };
        }
    }
};

// moves
function RollDice({G, ctx, random, events}) {
    if (!G.isRolled) {
        const moveCode = random.Die(5);
        G.currentRoll = moveCode;
        let cellsAllowed = [];
        switch (moveCode) {
            case 1:
                moveZero(events);
                break;
            case 2:
                cellsAllowed = moveOne(G, ctx, events);
                break;
            case 3:
                cellsAllowed = moveOneSide(G, ctx, events);
                break;
            case 4:
                cellsAllowed = moveTwo(G, ctx, events);
                break;
            case 5:
                break;
            default:
                break;
        }
        G.cellsAllowed = cellsAllowed;
        G.isRolled = true;
    }
}

function TryMove({G, ctx, events}, id) {
    if (G.currentRoll == 2 || G.currentRoll == 3 || G.currentRoll == 4) {
        ChooseCell(G, ctx, events, id);
    } else if (G.currentRoll == 5) {
        PlaceRedLight(G, ctx, events, id);
    }
}

function ChooseCell(G, ctx, events, id) {
    G.cellsAllowed.forEach(e => {
        if (id == e) {
            if (G.cells[id] !== null) {
                return INVALID_MOVE;
            }
            G.currentPlayerPositions[ctx.currentPlayer] = id;
            repaintCells(G);
            G.cellsAllowed = [];
            events.endTurn();
        }
    });
}

function PlaceRedLight(G, ctx, events, id) {
    if (G.cells[id] !== null || id == 0 || id == 1 || id == 2 || id == 3 || id == 44 || id == 45 || id == 46 || id == 47 || id == 48 || id == 49 || id == 50 || id == 51) {
        return INVALID_MOVE;
    }
    const placedBy = parseInt(ctx.currentPlayer);
    const position = parseInt(id);
    G.redLights.push({ placedBy: placedBy, turnsLeft: 3, position: position });
    repaintCells(G);
    G.currentRoll = undefined;
    G.cellsAllowed = [];
    events.endTurn();
}

// helper functions

function moveZero(events) {
    events.endTurn();
}

function moveOne(G, ctx, events) {
    if (isMoveQtyAvailable(G, ctx, 4)) {
        const allowedPosition = G.currentPlayerPositions[ctx.currentPlayer] + 4;
        return [allowedPosition];
    }
    G.cellsAllowed = [];
    events.endTurn();
}

function moveTwo(G, ctx, events) {
    if (!isMoveQtyAvailable(G, ctx, 4)) {
        G.cellsAllowed = [];
        events.endTurn();
    } else if (!isMoveQtyAvailable(G, ctx, 8)) {
        const allowedPosition = G.currentPlayerPositions[ctx.currentPlayer] + 4;
        return [allowedPosition];
    } else {
        const allowedPosition = G.currentPlayerPositions[ctx.currentPlayer] + 8;
        return [allowedPosition];
    }
}

// Checks if moving qty spaces from current player is available
function isMoveQtyAvailable(G, ctx, qty) {
    const moveTo = G.currentPlayerPositions[ctx.currentPlayer] + qty;
    if (G.cells[moveTo] !== null) {
        return false;
    }
    return true;
}

function moveOneSide(G, ctx, events) {
    const leftSquares = [0, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40];
    const rightSquares = [3, 7, 11, 15, 19, 23, 27, 31, 35, 39, 43];
    const currentPlayerPosition = G.currentPlayerPositions[ctx.currentPlayer];

    if (leftSquares.includes(currentPlayerPosition)) {
        if (isMoveQtyAvailable(G, ctx, 5)) {
            const allowedPosition = G.currentPlayerPositions[ctx.currentPlayer] + 5;
            return [allowedPosition];
        }
        G.cellsAllowed = [];
        events.endTurn();
    } else if (rightSquares.includes(currentPlayerPosition)) {
        if (isMoveQtyAvailable(G, ctx, 3)) {
            const allowedPosition = G.currentPlayerPositions[ctx.currentPlayer] + 3;
            return [allowedPosition];
        }
        G.cellsAllowed = [];
        events.endTurn();
    } else {
        let allowedPosition = [];
        if (isMoveQtyAvailable(G, ctx, 3)) {
            allowedPosition.push(G.currentPlayerPositions[ctx.currentPlayer] + 3);
        }
        if (isMoveQtyAvailable(G, ctx, 5)) {
            allowedPosition.push(G.currentPlayerPositions[ctx.currentPlayer] + 5);
        }
        if (allowedPosition.length != 0) {
            return allowedPosition;
        } else {
            G.cellsAllowed = [];
            events.endTurn();
        }
    }
}

function repaintCells(G) {
    G.cells = Array(52).fill(null);
    const pos0 = G.currentPlayerPositions[0];
    const pos1 = G.currentPlayerPositions[1];
    const pos2 = G.currentPlayerPositions[2];
    const pos3 = G.currentPlayerPositions[3];
    G.cells[pos0] = 0;
    G.cells[pos1] = 1;
    G.cells[pos2] = 2;
    G.cells[pos3] = 3;

    for (let i = 0; i < G.redLights.length; i++) {
        const redLight = G.redLights[i];

        // generate redLightContent code. Could be function
        let redLightContent;
        if (redLight.turnsLeft == 3) {
            redLightContent = '(' + redLight.placedBy + ')RRR';
        } else if (redLight.turnsLeft == 2) {
            redLightContent = '(' + redLight.placedBy + ')RR';
        } else if (redLight.turnsLeft == 1) {
            redLightContent = '(' + redLight.placedBy + ')R';
        }

        G.cells[redLight.position] = redLightContent;
    }
}

// moves: onEnd
function UpdateRedLights({G, ctx}) {
    for (let i = 0; i < G.redLights.length; i++) {
        const redLight = G.redLights[i];
        if (redLight.placedBy == ctx.currentPlayer) {
            redLight.turnsLeft = redLight.turnsLeft - 1;
            if (redLight.turnsLeft == 0) {
                G.redLights.splice(i, 1);
            }
            repaintCells(G);
        }
    }
    G.isRolled = false;
    G.totalMoves = G.totalMoves + 1;
}

function isVictory(G, ctx) {
    const winningSquares = [44, 45, 46, 47, 48, 49, 50, 51];
    if (winningSquares.includes(G.currentPlayerPositions[ctx.currentPlayer])) {
        return true;
    }
}
