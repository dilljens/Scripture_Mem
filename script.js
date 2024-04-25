const modes = ['visible', 'half', 'invisible'];
let currentModeIndex = 0;
let hideEvenWords = true; // Randomly decide to hide even or odd words
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

        span.textContent = word + ' ';
        span.className = 'hidden';  // Start with all text hidden

        // Apply visibility and color based on the current mode and user input
        applyVisibilityMode(span, i, firstLetter, word);
        verseDisplay.appendChild(span);
    });
}

function applyVisibilityMode(span, index, firstLetter, word) {
    const evenOrOdd = hideEvenWords ? index % 2 === 0 : index % 2 !== 0;

    if (currentModeIndex === 1 && evenOrOdd) { // Half visible mode
        // Conditionally apply hidden class based on even or odd setting
        span.className = 'hidden';
    } else if (currentModeIndex === 2) { // All hidden mode
        span.className = 'hidden';
    } else {
        span.className = ''; // Make visible if not in hidden mode
    }

    // Adjust color based on correctness of input
    if (firstLetter) {
        if (word[0].toLowerCase() === firstLetter) {
            span.className = 'correct';
        } else {
            span.className = 'incorrect';
        }
    }
}

function nextVerse() {
    verseIndex = (verseIndex + 1) % verses.length;
    document.getElementById('user-input').value = ''; // Clear input
    updateDisplay();
}

function toggleMode() {
    clearInput();
    currentModeIndex = (currentModeIndex + 1) % modes.length;
    if (currentModeIndex === 1) { // Only change random state when entering 'half' mode
        hideEvenWords = Math.random() < 0.5; // Randomly choose true or false
    }
    console.log(`Mode: ${modes[currentModeIndex]}, Even Hidden: ${hideEvenWords}`);
    updateDisplay();
}

function clearInput() {
    document.getElementById('user-input').value = '';
    updateDisplay();
}

// Initialize
updateDisplay();
