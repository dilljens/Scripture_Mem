document.addEventListener('DOMContentLoaded', function() {
    // Fetch URL parameters and set default chapter if none is provided
    const urlParams = new URLSearchParams(window.location.search);
    const bookName = urlParams.get('book') || "Isaiah";  // Allows dynamic book selection, defaults to Isaiah
    const chapterNumber = urlParams.get('chapter') || "1";  // Defaults to Chapter 1 if no parameter

    // Safely access chapter data, fallback to an empty array if data is missing
    const verses = (books[bookName] && books[bookName]["Chapter " + chapterNumber]) || [];
    const chapterTitle = document.getElementById('chapter-title');
    const versesContainer = document.getElementById('verses-container');
    const bookLink = document.getElementById('book-link');

    // Configure the chapter title
    chapterTitle.textContent = '';  // Clear existing content
    bookLink.textContent = bookName;  // Set the clickable book name
    chapterTitle.appendChild(bookLink);
    chapterTitle.append(` - Chapter ${chapterNumber}`);  // Corrected typo and enhanced readability

    // Navigate back to index.html when clicking on the book name
    bookLink.onclick = function() {
        window.location.href = 'index.html';
    };

    // Function to extract the first letter of each word along with any immediate punctuation
    function extractFirstLetters(verse) {
        const pattern = /\b(\w)([\w'-]*)([.,;:!?]*)/g;
        let result = '';
        let match;
        while (match = pattern.exec(verse)) {
            result += match[1] + (match[3] || '');
        }
        return result;
    }

    // Display each verse as a clickable box that leads to a detailed verse view
    if (verses.length === 0) {
        versesContainer.textContent = 'No verses available for this chapter.';
    } else {
        verses.forEach((verse, index) => {
            const verseBox = document.createElement('div');
            verseBox.className = 'verse-box';
            verseBox.textContent = extractFirstLetters(verse);
            verseBox.onclick = () => {
                window.location.href = `verse.html?book=${bookName}&chapter=${chapterNumber}&verse=${index + 1}`;
            };
            versesContainer.appendChild(verseBox);
        });
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
