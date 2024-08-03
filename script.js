const numRows = 6;
const numCols = 6;
let table = [];
let studentCount = 0;
let cards = [];
let drawnCards = new Set();
let isCardOn = 0; // 0 = cards hidden, 1 = cards shown
let count = 0; // Initialize count to keep track of drawn cards
let isDrawing = false; // Flag to prevent multiple draws

function createTable() {
    const tableElement = document.querySelector('.table');
    table = [];
    
    // Create table cells
    for (let j = 0; j < numCols; j++) {
        table[j] = [];
        for (let i = 0; i < numRows; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = i;
            cell.dataset.col = j;
            cell.dataset.index = j * numRows + i + 1; // Index numbering from 1, vertical fill
            cell.textContent = '';
            tableElement.appendChild(cell);
            table[j][i] = cell;
        }
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function createCards() {
    const cardContainer = document.getElementById('cardContainer');
    cardContainer.innerHTML = ''; // Clear previous cards
    cards = [];
    
    const cardNumbers = Array.from({ length: studentCount }, (_, i) => i + 1);
    shuffleArray(cardNumbers); // Shuffle card numbers

    // Create cards
    cardNumbers.forEach((number) => {
        if (!drawnCards.has(number)) { // Only create cards that haven't been drawn
            const card = document.createElement('div');
            card.classList.add('card');
            card.textContent = ''; // Initially hidden
            card.dataset.number = number;
            card.classList.add('hidden');
            card.addEventListener('click', () => handleCardClick(number)); // Add event listener
            cardContainer.appendChild(card);
            cards.push(card);
        }
    });

    // Show the card container if isCardOn is 1
    if (isCardOn === 1) {
        document.getElementById('cardContainer').style.display = 'flex';
    }
}

function handleCardClick(cardNumber) {
    if (isDrawing) return; // Prevent multiple draws at the same time

    isDrawing = true;
    const studentName = document.getElementById('studentName').value.trim();
    if (!studentName) {
        alert('Please enter a valid student name.');
        isDrawing = false;
        return;
    }

    if (drawnCards.has(cardNumber)) {
        alert('Card has already been used.');
        isDrawing = false;
        return;
    }

    drawnCards.add(cardNumber);
    count++; // Increment count when a card is drawn

    // Show the selected card
    const selectedCard = document.querySelector(`.card[data-number="${cardNumber}"]`);
    selectedCard.classList.remove('hidden');
    selectedCard.classList.add('show');
    selectedCard.textContent = cardNumber;

    // Find the cell corresponding to the card number
    let matchedCell = null;
    for (let j = 0; j < numCols; j++) {
        for (let i = 0; i < numRows; i++) {
            if (parseInt(table[j][i].dataset.index) === cardNumber) {
                matchedCell = table[j][i];
                break;
            }
        }
        if (matchedCell) break;
    }

    // Randomly assign student name to the matched cell
    if (matchedCell) {
        matchedCell.textContent = studentName;
        matchedCell.style.backgroundColor = '#cfc';
    }

    // Hide all cards and show the form again
    setTimeout(() => {
        cards.forEach(card => {
            card.classList.remove('show');
            card.classList.add('hidden');
        });
        document.getElementById('cardContainer').style.display = 'none';
        document.getElementById('formContainer').style.display = 'flex';
        isCardOn = 0; // Reset isCardOn to hide cards
        isDrawing = false;

        // Update cards for the next student
        createCards();
    }, 2000); // 2 seconds delay to allow users to see the selected card
}

function assignSeat() {
    studentCount = parseInt(document.getElementById('totalStudents').value);
    if (isNaN(studentCount) || studentCount <= 0) {
        alert('Please enter a valid number of students.');
        return;
    }

    // Create the table only if it doesn't exist already
    if (document.querySelector('.table').children.length === 0) {
        createTable();
    }

    // Show the card container
    isCardOn = 1;
    createCards();

    // Hide the form container
    document.getElementById('formContainer').style.display = 'none';
}

document.addEventListener('DOMContentLoaded', () => {
    createTable(); // Create the table when the page loads
});
