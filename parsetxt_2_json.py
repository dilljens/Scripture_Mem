import re
import json

def parse_verses(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        content = file.read()

    # Regular expression to capture book names, chapter markers, and verse text
    book_pattern = re.compile(r'\*(\w+)\n|ch(\d+)\n|(\d+)\s(.*?)(?=\n\d+\s|$)', re.S)
    books = {}
    current_book = None
    chapters = {}
    current_chapter = None
    verses = []

    for book_name, chapter_num, verse_num, verse_text in book_pattern.findall(content):
        if book_name:
            # Start of a new book
            if current_book and chapters:
                books[current_book] = chapters
                chapters = {}
            current_book = book_name
        elif chapter_num:
            # Start of a new chapter
            if current_chapter is not None:
                chapters[f'Chapter {current_chapter}'] = verses
            current_chapter = chapter_num
            verses = []
        elif verse_num:
            # Add verse to current chapter
            verses.append(verse_text.strip())

    # Append the last found chapter and book
    if verses and current_chapter:
        chapters[f'Chapter {current_chapter}'] = verses
    if current_book and chapters:
        books[current_book] = chapters

    return books

def write_to_js(books, output_file):
    with open(output_file, 'w', encoding='utf-8') as js_file:
        # Create a valid JavaScript object
        js_content = 'const books = ' + json.dumps(books, indent=2) + ';'
        js_file.write(js_content)

if __name__ == '__main__':
    books_data = parse_verses('C:/Code/Scripture_Mem/isaiah.txt')
    write_to_js(books_data, 'C:/Code/Scripture_Mem/data.js')
