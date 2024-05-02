document.addEventListener('DOMContentLoaded', function() {
    updateDisplay();  // Initialize display when the document is ready

    document.addEventListener('keydown', function(event) {
        if (event.key === "Escape") {
            // If the Escape key is pressed, run the clearInput function
            clearInput();
        } else if (event.key === "ArrowLeft") {  // Check for the left arrow key
            // If the left arrow key is pressed, run the prevVerse function
            prevVerse();
        } else if (event.key === "Enter" || event.key === "ArrowRight") {
            // If the Enter key is pressed, run the nextVerse function
            nextVerse();
        }
    
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const chapterData = books["Isaiah"]["Chapter 1"]; // Assuming data.js is already included
    const chapterTitle = document.getElementById('chapter-title');
    const versesContainer = document.getElementById('verses-container');

    chapterTitle.textContent = "Chapter 1"; // Set the chapter title dynamically if needed

    chapterData.forEach((verse, index) => {
        const box = document.createElement('div');
        box.className = 'verse-box';
        box.textContent = `Verse ${index + 1}`;
        box.addEventListener('click', () => {
            window.location.href = `verse.html?chapter=1&verse=${index + 1}`; // Assuming verse.html handles individual verse display
        });
        versesContainer.appendChild(box);
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const bookName = "Isaiah"; // Example book
    const chapterNumber = "1"; // Example chapter

    const verses = books[bookName]["Chapter " + chapterNumber];
    const chapterTitle = document.getElementById('chapter-title');
    const versesContainer = document.getElementById('verses-container');

    chapterTitle.textContent = `${bookName} - Chapter ${chapterNumber}`;

    verses.forEach((verse, index) => {
        const verseBox = document.createElement('div');
        verseBox.className = 'verse-box';
        verseBox.textContent = extractFirstLetters(verse);
        verseBox.onclick = () => {
            window.location.href = `verse.html?book=${bookName}&chapter=${chapterNumber}&verse=${index + 1}`;
        };
        versesContainer.appendChild(verseBox);
    });

    function extractFirstLetters(verse) {
        return verse.split(/\s+/).map(word => word[0]).join('');
    }
});

const modes = ['visible', 'half', 'invisible'];
let currentModeIndex = 0;
let hideEvenWords = true; // Randomly decide to hide even or odd words
let verseIndex = 0;

// Accessing the verses array from "Chapter 1" of "Isaiah" in the books object
let verses = books["Isaiah"]["Chapter 1"];

function updateDisplay() {
    const user_input = document.getElementById('user-input').value.replace(/\s+/g, '').toLowerCase();
    const verseDisplay = document.getElementById('verse-display');
    verseDisplay.innerHTML = ''; // Clear current display

    // Check if the current verse index is within the bounds of the verses array
    if (verseIndex >= verses.length) {
        verseIndex = 0; // Reset to first verse if out of bounds
    }

    // Splitting the current verse into words based on spaces
    const words = verses[verseIndex].split(' ');

    words.forEach((word, i) => {
        const span = document.createElement('span');
        const firstLetter = user_input[i] || '';

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
        span.className = 'hidden';
    } else if (currentModeIndex === 2) { // All hidden mode
        span.className = 'hidden';
    } else {
        span.className = ''; // Make visible if not in hidden mode
    }

    if (firstLetter) {
        if (word[0].toLowerCase() === firstLetter) {
            span.className = 'correct';
        } else {
            span.className = 'incorrect';
        }
    }
}

function nextVerse() {
    verseIndex = (verseIndex + 1) % verses.length; // Cycle through verses
    document.getElementById('user-input').value = ''; // Clear input
    updateDisplay();
}

function prevVerse() {
    if (verseIndex > 0) {
        verseIndex--;  // Move to the previous verse
    } else {
        verseIndex = verses.length - 1;  // Optional: Wrap around to the last verse
    }
    document.getElementById('user-input').value = '';  // Clear input
    updateDisplay();
}


function toggleMode() {
    clearInput();
    currentModeIndex = (currentModeIndex + 1) % modes.length; // Cycle through modes
    console.log(`Mode: ${modes[currentModeIndex]}, Even Hidden: ${hideEvenWords}`);
    updateDisplay();
}

function clearInput() {
    document.getElementById('user-input').value = '';
    if (currentModeIndex === 1) {
        hideEvenWords = !hideEvenWords; // Toggle hiding even or odd words
    }
    updateDisplay();
}

// Initialize
updateDisplay();
