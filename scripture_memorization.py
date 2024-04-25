import tkinter as tk
import random

# Define possible modes and start with the first one
modes = ['visible', 'half', 'invisible']
current_mode = modes[0]
# Define a variable to keep track of the visibility mode
# Start with visible mode (text_color = 'black')
text_color = 'black'

def update_display():
    user_input = entry_var.get().replace(" ", "").lower()
    words = verses[verse_index].split()
    
    label.config(state="normal")
    label.delete("1.0", tk.END)
    
    # Determine the text color for odd and even words based on the current mode
    # odd_color, even_color = ('black', 'white') if current_mode == 'half' and random.choice([True, False]) else ('white', 'black')
    
    for i, word in enumerate(words):
        tag = 'correct' if i < len(user_input) and word[0].lower() == user_input[i] else \
              'incorrect' if i < len(user_input) else \
              'even' if i % 2 == 0 and current_mode == 'half' else \
              'odd' if i % 2 != 0 and current_mode == 'half' else \
              'default'
        label.insert(tk.END, word + " ", (tag,))
    
    apply_tags(user_input)
    label.config(state="disabled")
    
def apply_tags(user_input):
    words = verses[verse_index].split()
    start_index = "1.0"
    
    for i, word in enumerate(words):
        end_index = label.index(f"{start_index}+{len(word)}c")
        if i < len(user_input):
            tag = 'correct' if word[0].lower() == user_input[i] else 'incorrect'
        else:
            tag = 'default'
        label.tag_add(tag, start_index, end_index)
        start_index = label.index(f"{end_index}+1c")  # Move to the next word

def toggle_mode(advance = True):
    global current_mode, mode_button
    # Cycle through the modes
    if advance:
        current_mode_index = (modes.index(current_mode) + 1) % len(modes)
    else:
        current_mode_index = (modes.index(current_mode)) % len(modes)
    current_mode = modes[current_mode_index]

    # Set the button text to the current mode number
    mode_text = str(current_mode_index + 1)  # Modes are 0-indexed, so add 1 for display
    mode_button.config(text=f"Mode {mode_text}")

    # Update tag configurations to reflect the new mode
    label.tag_configure('default', foreground='black' if current_mode == 'visible' else 'white')
    
    if current_mode == 'half':
        # In 'half' mode, we don't use the 'default' tag, but rather 'even' and 'odd'
        even_color, odd_color = ('black', 'white') if random.choice([True, False]) else ('white', 'black')
        label.tag_configure('even', foreground=even_color)
        label.tag_configure('odd', foreground=odd_color)
    else:
        # Make sure we reset even/odd configurations
        label.tag_configure('even', foreground='')
        label.tag_configure('odd', foreground='')
    
    # Refresh the display to apply the new mode
    update_display()

def next_verse():
    global verse_index
    verse_index = (verse_index + 1) % len(verses)
    entry_var.set("")
    update_display()

def clear_input():
    # Clear the entry widget and update the display
    entry_var.set('')
    toggle_mode(False)
    update_display()

# List of verses
verses = [
    "For the land is full of silver and gold, and there is no end to their treasures.",
    "Their land is also full of horses, and there is no end to their chariots."
]
verse_index = 0

# GUI setup
root = tk.Tk()
root.title("Verse Memorization Helper")

entry_var = tk.StringVar()
entry_var.trace_add("write", lambda *args: update_display())

label = tk.Text(root, font=('Arial', 14), width=80, height=6)
label.pack(pady=20)
label.tag_configure('correct', foreground='green')
label.tag_configure('incorrect', foreground='red')
label.tag_configure('default', foreground=text_color)  # Set default tag based on mode
label.config(state="disabled")

entry = tk.Entry(root, textvariable=entry_var, font=('Arial', 14), width=40)
entry.pack(pady=10)

mode_button = tk.Button(root, text=f"Mode {modes.index(current_mode) + 1}", command=toggle_mode)
mode_button.pack(side=tk.LEFT, padx=10)

next_button = tk.Button(root, text="Next Verse", command=next_verse)
next_button.pack(side=tk.RIGHT, padx=10)

clear_button = tk.Button(root, text="Clear", command=clear_input)
clear_button.pack(side=tk.LEFT, padx=5)

update_display()  # Initialize display

root.mainloop()
