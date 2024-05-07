import re
import json

def parse_verses(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        content = file.read()

    # Regex pattern to capture headers and verses based on updated format
    book_pattern = re.compile(r'\*([A-Za-z]+)')  # Captures book name
    chapter_header_pattern = re.compile(r'hd(\d+)\s+(.*?)\s+ch\d+', re.S)  # Captures chapter headers
    chapter_pattern = re.compile(r'ch(\d+)\s+(.*?)\s+(?=hd\d+|\Z)', re.S)  # Captures chapter verses

    books = {}
    current_book = None
    chapters = {}
    current_chapter = None

    # Find book name
    book_match = book_pattern.search(content)
    if book_match:
        current_book = book_match.group(1)
        books[current_book] = {}

    # Find and process chapter headers and verses
    for header_match in chapter_header_pattern.finditer(content):
        chapter_num = "Chapter " + header_match.group(1)
        header_text = header_match.group(2).strip()
        chapters[chapter_num] = {"header": header_text, "verses": []}
    
    for chapter_match in chapter_pattern.finditer(content):
        chapter_num = "Chapter " + chapter_match.group(1)
        verses_text = chapter_match.group(2)
        verse_pattern = re.compile(r'(\d+)\s(.*?)(?=\s+\d+\s|\Z)', re.S)  # Captures verses within the chapter

        # Capture all verses in the current chapter text
        verses = verse_pattern.findall(verses_text)
        for verse in verses:
            verse_num = verse[0]
            verse_text = verse[1].strip()
            chapters[chapter_num]["verses"].append(f"{verse_num}. {verse_text}")

    # Assign chapters to the book
    books[current_book] = chapters

    return books

def write_to_js(books, output_file):
    with open(output_file, 'w', encoding='utf-8') as js_file:
        js_content = 'const books = ' + json.dumps(books, indent=4) + ';'
        js_file.write(js_content)

if __name__ == '__main__':
    books_data = parse_verses('isaiah.txt')
    write_to_js(books_data, 'data.js')
