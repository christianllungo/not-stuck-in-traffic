// Helper Funnctions
// NOTE: A move is allowed when the target position/space is not occupied.


/**
 * Ends the turn
 * @param {*} events 
 */
export function moveZero(events) {
    events.endTurn();
}

/**
 * If move forward one space is allowed then returns the position allowed, otherwise ends the turn
 * @param {*} G 
 * @param {*} ctx 
 * @param {*} events 
 */
export function moveOne(G, ctx, events) {
    if (isMoveQtyAvailable(G, ctx, 4)) {
        const allowedPosition = G.currentPlayerPositions[ctx.currentPlayer] + 4;
        return [allowedPosition];
    }
    G.cellsAllowed = [];
    events.endTurn();
}

/**
 * If move forward two spaces is allowed then returns the position allowed, otherwise ends the turn
 * @param {*} G 
 * @param {*} ctx 
 * @param {*} events 
 */
export function moveTwo(G, ctx, events) {
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

/**
 * If move diagonally forward one space is allowed then returns the position(s) allowed, otherwise ends the turn
 * @param {*} G 
 * @param {*} ctx 
 * @param {*} events 
 */
export function moveOneSide(G, ctx, events) {
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

/**
 * Returns true if moving 'qty' spaces from current player is allowed
 * @param {*} G 
 * @param {*} ctx 
 * @param {number} qty 
 */
export function isMoveQtyAvailable(G, ctx, qty) {
    const moveTo = G.currentPlayerPositions[ctx.currentPlayer] + qty;
    if (G.cells[moveTo] !== null) {
        return false;
    }
    return true;
}