const modes = ['visible', 'half', 'invisible'];
let currentModeIndex = 0;
let verses = [
    "For the land is full of silver and gold, and there is no end to their treasures.",
    "Their land is also full of horses, and there is no end to their chariots."
];
let verseIndex = 0;

function updateDisplay() {
    const user_input = document.getElementById('user-input').value.replace(/\s+/g, '').toLowerCase();
    const words = verses[verseIndex].split(' ');
    const verseDisplay = document.getElementById('verse-display');
    verseDisplay.innerHTML = ''; // Clear current display

    words.forEach((word, i) => {
        const span = document.createElement('span');
        const firstLetter = user_input[i];
        if (firstLetter) {
            if (word[0].toLowerCase() === firstLetter) {
                span.className = 'correct';
            } else {
                span.className = 'incorrect';
            }
        }
        span.textContent = word + ' ';
        verseDisplay.appendChild(span);
    });
}

function nextVerse() {
    verseIndex = (verseIndex + 1) % verses.length;
    document.getElementById('user-input').value = ''; // Clear input
    updateDisplay();
}

function toggleMode() {
    currentModeIndex = (currentModeIndex + 1) % modes.length;
    const modeText = `Mode ${currentModeIndex + 1}`;
    // Update mode display or functionality as needed
    console.log(modeText); // Placeholder for mode update
}

function clearInput() {
    document.getElementById('user-input').value = '';
    updateDisplay();
}

// Initialize
updateDisplay();
