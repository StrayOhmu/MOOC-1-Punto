const grid = document.getElementById('grid');
const currentPlayerDiv = document.getElementById('current-player');
const messageDiv = document.getElementById('message');

// Défi 1
// Create the grid
for (let row = 0; row < 11; row++) {
    for (let col = 0; col < 11; col++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.row = row;
        cell.dataset.col = col;

        if (row === 5 && col === 5) {
            cell.classList.add('center');
        } else if (Math.abs(row - 5) <= 1 && Math.abs(col - 5) <= 1) {
            cell.classList.add('near-center');
        }

        grid.appendChild(cell);
    }
}

// Défi 2
// Function to set the value of a cell
function setValue(row, col, value) {
    const cell = document.querySelector(`[data-row='${row}'][data-col='${col}']`);
    if (cell) {
        cell.textContent = value;
    }
}

// Défi 2
// Function to get the value of a cell
function getValue(row, col) {
    const cell = document.querySelector(`[data-row='${row}'][data-col='${col}']`);
    return cell ? cell.textContent : null;
}

// Défi 2
// Function to set the color of a cell
function setColor(row, col, color) {
    const cell = document.querySelector(`[data-row='${row}'][data-col='${col}']`);
    if (cell) {
        cell.style.backgroundColor = color;
    }
}

// Défi 2
// Function to get the color of a cell
function getColor(row, col) {
    const cell = document.querySelector(`[data-row='${row}'][data-col='${col}']`);
    return cell ? cell.style.backgroundColor : null;
}

// Défi 4
// Function to know if a cell is empty
function isEmpty(row, col) {
	return getValue(row, col) === '';
}

// Défi 5
// Function to check if a cell is adjacent to a used cell
function isCorrectAdjacency(row, col) {
    const directions = [
        { dr: -1, dc: 0 }, // Up
        { dr: 1, dc: 0 },  // Down
        { dr: 0, dc: -1 }, // Left
        { dr: 0, dc: 1 },  // Right
        { dr: -1, dc: -1 }, // Up-Left
        { dr: -1, dc: 1 },  // Up-Right
        { dr: 1, dc: -1 },  // Down-Left
        { dr: 1, dc: 1 }    // Down-Right
    ];

    for (const { dr, dc } of directions) {
        const newRow = row + dr;
        const newCol = col + dc;
        if (newRow >= 0 && newRow < 11 && newCol >= 0 && newCol < 11 && !isEmpty(newRow, newCol)) {
            return true;
        }
    }
    return false;
}

// Sets to track used rows and columns
const usedRows = new Set();
const usedCols = new Set();
usedRows.add(5);
usedCols.add(5);

// Défi 6
// Function to check if a placement is correct
function isCorrectPlacement(row, col, value) {
    const currentValue = getValue(row, col);

    // Check if the cell is already occupied and the new value is greater
    if (currentValue !== null && value <= currentValue) {
        return false;
    }

    // Check for correct adjacency
    if (!isCorrectAdjacency(row, col)) {
        return false;
    }

    // Check if adding this cell would exceed the 6x6 limit
    const newUsedRows = new Set(usedRows);
    const newUsedCols = new Set(usedCols);
    newUsedRows.add(row);
    newUsedCols.add(col);

    if (newUsedRows.size > 6 || newUsedCols.size > 6) {
        return false;
    }

    // Update the sets of used rows and columns
    usedRows.add(row);
    usedCols.add(col);

    return true;
}

// Défi 7
// Lists representing the card decks of the 4 players
const redlist = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9];
const greenlist = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9];
const yellowlist = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9];
const bluelist = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9];

// Défi 7
// Function to get and remove a random card from a list
function getAndRemoveRandomCard(list) {
    const randomIndex = Math.floor(Math.random() * list.length);
    const card = list.splice(randomIndex, 1)[0];
    return card;
}

// Défi 8
// Function to check if a player has won
function hasWin(color) {
    const directions = [
        { dr: 0, dc: 1 },  // Horizontal
        { dr: 1, dc: 0 },  // Vertical
        { dr: 1, dc: 1 },  // Diagonal down-right
        { dr: 1, dc: -1 }  // Diagonal down-left
    ];

    for (let row = 0; row < 11; row++) {
        for (let col = 0; col < 11; col++) {
            for (const { dr, dc } of directions) {
                let count = 0;
                for (let k = 0; k < 4; k++) {
                    const newRow = row + k * dr;
                    const newCol = col + k * dc;
                    if (newRow >= 0 && newRow < 11 && newCol >= 0 && newCol < 11 && getColor(newRow, newCol) === color) {
                        count++;
                    } else {
                        break;
                    }
                }
                if (count === 4) {
                    return true;
                }
            }
        }
    }
    return false;
}

// Défi 9
// Function to check if coordinates are within limits
function isWithinLimits(i, j) {
    if (i < 0 || i >= 11 || j < 0 || j >= 11) {
        return false;
    }

    let minRow = 11, maxRow = 0, minCol = 11, maxCol = 0;
    for (let row = 0; row < 11; row++) {
        for (let col = 0; col < 11; col++) {
            if (!isEmpty(row, col)) {
                if (row < minRow) minRow = row;
                if (row > maxRow) maxRow = row;
                if (col < minCol) minCol = col;
                if (col > maxCol) maxCol = col;
            }
        }
    }

    return (i >= minRow - 6 && i <= maxRow + 6 && j >= minCol - 6 && j <= maxCol + 6);
}

// Défi 2
// Test function for setValue
function testsetValue() {
    const row = Math.floor(Math.random() * 11);
    const col = Math.floor(Math.random() * 11);
    const value = '1';
    setValue(row, col, value);
    console.log(`setValue(${row}, ${col}, '${value}')`);
}

// Défi 2
// Test function for getValue
function testgetValue() {
    const row = Math.floor(Math.random() * 11);
    const col = Math.floor(Math.random() * 11);
    const value = getValue(row, col);
    console.log(`getValue(${row}, ${col}) = '${value}'`);
}

// Défi 2
// Test function for setColor
function testsetColor() {
    const row = Math.floor(Math.random() * 11);
    const col = Math.floor(Math.random() * 11);
    const color = 'red';
    setColor(row, col, color);
    console.log(`setColor(${row}, ${col}, '${color}')`);
}

// Défi 2
// Test function for getColor
function testgetColor() {
    const row = Math.floor(Math.random() * 11);
    const col = Math.floor(Math.random() * 11);
    const color = getColor(row, col);
    console.log(`getColor(${row}, ${col}) = '${color}'`);
}

// Défi 4
// Test function for isEmpty
function testisEmpty() {
	const row = Math.floor(Math.random() * 11);
	const col = Math.floor(Math.random() * 11);
	const empty = isEmpty(row, col);
	console.log(`isEmpty(${row}, ${col}) = '${empty}'`);
}

// Défi 5
// Test function for isCorrectAdjacency
function testIsCorrectAdjacency() {
    const row = Math.floor(Math.random() * 11);
    const col = Math.floor(Math.random() * 11);
    const result = isCorrectAdjacency(row, col);
    console.log(`isCorrectAdjacency(${row}, ${col}) = ${result}`);
}

// Défi 6
// Test function for isCorrectPlacement
function testIsCorrectPlacement() {
    const row = Math.floor(Math.random() * 11);
    const col = Math.floor(Math.random() * 11);
    const value = Math.floor(Math.random() * 10) + 1; // Random value between 1 and 10
    const result = isCorrectPlacement(row, col, value);
    console.log(`isCorrectPlacement(${row}, ${col}, ${value}) = ${result}`);
}

// Défi 7
// Test function for getAndRemoveRandomCard
function testGetAndRemoveRandomCard() {
    const lists = [redlist, greenlist, yellowlist, bluelist];
    lists.forEach(list => {
        const card = getAndRemoveRandomCard(list);
        console.log(`Drew card ${card} from list. Remaining cards: ${list}`);
    });
}

// Défi 8
// Test function for hasWin
function testHasWin() {
    // Set up a winning condition for testing
    setColor(0, 0, 'red');
    setColor(0, 1, 'red');
    setColor(0, 2, 'red');
    setColor(0, 3, 'red');
    const result = hasWin('red');
    console.log(`hasWin('red') = ${result}`);
}

// Défi 9
// Test function for isWithinLimits
function testIsWithinLimits() {
    const row = Math.floor(Math.random() * 11);
    const col = Math.floor(Math.random() * 11);
    const result = isWithinLimits(row, col);
    console.log(`isWithinLimits(${row}, ${col}) = ${result}`);
}

// Défi 3
// Function to handle cell click
function clickedOnCell(event) {
    const row = parseInt(event.target.dataset.row);
    const col = parseInt(event.target.dataset.col);

    if (isCorrectPlacement(row, col, currentCard) && isWithinLimits(row, col)) {
        setValue(row, col, currentCard);
        setColor(row, col, players[currentPlayerIndex]);

        if (hasWin(players[currentPlayerIndex])) {
            messageDiv.textContent = `Bravo ${colorNames[players[currentPlayerIndex]]}!`;
            return;
        }

        currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
        nextTurn();
    } else {
        alert("Placement incorrect. Essayez une autre case.");
    }
}

// Défi 3
// Function to set event listeners on all cells
function setListeners() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.addEventListener('click', clickedOnCell);
    });
}


// Fonctionnement jeu

// Game state variables
const players = ['rgb(234, 90, 90)', 'rgb(119, 229, 108)', 'rgb(239, 249, 86)', 'rgb(108, 181, 229)']; // Red, Green, Yellow, Blue in hex
const decks = { 'rgb(234, 90, 90)': redlist, 'rgb(119, 229, 108)': greenlist, 'rgb(239, 249, 86)': yellowlist, 'rgb(108, 181, 229)': bluelist };
const colorNames = { 'rgb(234, 90, 90)': 'red', 'rgb(119, 229, 108)': 'green', 'rgb(239, 249, 86)': 'yellow', 'rgb(108, 181, 229)': 'blue' };
let currentPlayerIndex = 0;
let currentCard = null;

// Function to start the game
function startGame() {
    // Shuffle players
    players.sort(() => Math.random() - 0.5);

    // Place the first card of the first player in the center
    currentCard = getAndRemoveRandomCard(decks[players[currentPlayerIndex]]);
    setValue(5, 5, currentCard);
    setColor(5, 5, players[currentPlayerIndex]);

    currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
    nextTurn();
}

// Function to handle the next turn
function nextTurn() {
    if (decks[players[currentPlayerIndex]].length === 0) {
        messageDiv.textContent = "Egalité, belle partie";
        return;
    }

    currentCard = getAndRemoveRandomCard(decks[players[currentPlayerIndex]]);
    const currentPlayerColor = colorNames[players[currentPlayerIndex]];
    currentPlayerDiv.textContent = `Joueur en cours: ${currentPlayerColor} avec la valeur ${currentCard}`;
}


// Main function to call test functions
function main() {
    setListeners();
    startGame();
}

// Call the main function
main();