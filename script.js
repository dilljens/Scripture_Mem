document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const bookName = urlParams.get('book') || "Isaiah"; // Default to "Isaiah" if no book specified
    const chapterNumber = urlParams.get('chapter'); // Check if chapter is provided

    const chapterTitle = document.getElementById('chapter-title');
    const versesContainer = document.getElementById('verses-container');
    const bookLink = document.getElementById('book-link');

    bookLink.textContent = bookName;
    bookLink.onclick = () => loadChapters(bookName); // Load chapters when book name is clicked

    function loadChapters(book) {
        versesContainer.innerHTML = '';
        const chapters = books[book];
        Object.keys(chapters).forEach(chapter => {
            const chapterBox = document.createElement('div');
            chapterBox.className = 'chapter-box';
            const headerFirstLetters = extractFirstLetters(chapters[chapter].header);
            chapterBox.textContent = `${chapter} - ${headerFirstLetters}`;
            chapterBox.onclick = () => {
                window.location.search = `?book=${book}&chapter=${chapter.split(' ')[1]}`;
            };
            versesContainer.appendChild(chapterBox);
        });
    }

    function loadVerses(book, chapter) {
        chapterTitle.textContent = `${bookName} - ${chapter}`; // Set chapter title
        const chapterData = books[book][chapter];
        if (!chapterData || chapterData.verses.length === 0) {
            versesContainer.textContent = 'No verses available for this chapter.';
            return;
        }
        chapterData.verses.forEach((verse, index) => {
            const verseBox = document.createElement('div');
            verseBox.className = 'verse-box';
            const firstLetters = extractFirstLetters(verse);
            verseBox.textContent = `${index + 1}. ${firstLetters}`;
            verseBox.onclick = function() {
                if (this.dataset.expanded) {
                    this.textContent = `${index + 1}. ${firstLetters}`;
                    delete this.dataset.expanded;
                } else {
                    this.textContent = ` ${verse}`;
                    this.dataset.expanded = true;
                }
            };
            versesContainer.appendChild(verseBox);
        });
    }
    
    function extractFirstLetters(text) {
        const pattern = /\b(\w)([\w'-]*)([.,;:!?]*)/g;
        let result = '';
        let first = true; // To handle the first letter differently (assuming it's the verse number)
        
        let match;
        while (match = pattern.exec(text)) {
            if (first) {
                // Capture only the number initially and add a newline after it
                // result += match[1] + '\n';
                first = false; // Set first to false after processing the verse number
            } else {
                // For all other matches, append the first letter and punctuation
                result += match[1] + (match[3] || '');
            }
        }
        return result;
    }
    
    
    if (chapterNumber) {
        loadVerses(bookName, `Chapter ${chapterNumber}`);
    } else {
        loadChapters(bookName);
    }
});
