import re
import json

def parse_verses(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        content = file.read()

    # Improved regex pattern to better handle chapter and verse separations
    book_pattern = re.compile(
        r'\*(\w+)\s*|\bch(\d+)\s*|(\d+)\s(.*?)(?=\s*\n\d+\s|\s*\n\*|\s*\nch|\Z)', re.S)
    
    books = {}
    current_book = None
    chapters = {}
    current_chapter = None
    verses = []

    for match in book_pattern.finditer(content):
        book_name = match.group(1)  # Group for book name
        chapter_num = match.group(2)  # Group for chapter number
        verse_num = match.group(3)  # Group for verse number
        verse_text = match.group(4)  # Group for verse text

        if book_name:
            # Handle new book
            if current_book and chapters:
                books[current_book] = chapters  # Store chapters for previous book
                chapters = {}  # Reset chapters for new book
            current_book = book_name
        elif chapter_num:
            # Handle new chapter
            if current_chapter is not None:
                chapters[f'Chapter {current_chapter}'] = verses  # Store verses for previous chapter
            current_chapter = chapter_num
            verses = []  # Reset verses for new chapter
        elif verse_num and verse_text:
            # Handle new verse
            verses.append(verse_text.strip())

    # Append the last found chapter and book
    if verses:
        chapters[f'Chapter {current_chapter}'] = verses
    if current_book:
        books[current_book] = chapters

    return books

def write_to_js(books, output_file):
    with open(output_file, 'w', encoding='utf-8') as js_file:
        js_content = 'const books = ' + json.dumps(books, indent=2) + ';'
        js_file.write(js_content)

if __name__ == '__main__':
    books_data = parse_verses('C:/Code/Scripture_Mem/isaiah.txt')
    write_to_js(books_data, 'C:/Code/Scripture_Mem/data.js')
