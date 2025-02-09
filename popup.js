// popup.js

const wordInput = document.getElementById('word-input');
const addButton = document.getElementById('add-button');
const wordsListEl = document.getElementById('words-list');
const toggleButton = document.getElementById('toggle-button');

let highlightingEnabled = false;

// Load stored data when popup opens
chrome.storage.sync.get(['highlightWords'], (res) => {
  const words = Array.isArray(res.highlightWords) ? res.highlightWords : [];
  renderWords(words);
});

// Add new word to the list
addButton.addEventListener('click', async () => {
  const newWord = wordInput.value.trim();
  if (!newWord) return;

  // Get existing words from storage
  chrome.storage.sync.get(['highlightWords'], async (res) => {
    let words = Array.isArray(res.highlightWords) ? res.highlightWords : [];

    // Avoid duplicates (optional)
    if (!words.includes(newWord)) {
      words.push(newWord);
    }

    // Save back to storage
    await chrome.storage.sync.set({ highlightWords: words });

    // Re-render
    renderWords(words);

    // Clear the input
    wordInput.value = '';
  });
});

// Toggle highlighting on/off
toggleButton.addEventListener('click', () => {
  highlightingEnabled = !highlightingEnabled;
  toggleButton.textContent = highlightingEnabled ? 'Turn OFF' : 'Turn ON';

  // Message background to inject or reload
  chrome.runtime.sendMessage({
    type: 'TOGGLE_HIGHLIGHT',
    enabled: highlightingEnabled
  });
});

/**
 * Render the list of words in the popup
 */
function renderWords(words) {
  // Clear the list
  wordsListEl.innerHTML = '';

  words.forEach((word) => {
    const item = document.createElement('div');
    item.classList.add('word-item');

    const text = document.createElement('span');
    text.textContent = word;

    const removeBtn = document.createElement('button');
    removeBtn.classList.add('remove-btn');
    removeBtn.textContent = 'X';
    removeBtn.addEventListener('click', () => removeWord(word));

    item.appendChild(text);
    item.appendChild(removeBtn);

    wordsListEl.appendChild(item);
  });
}

/**
 * Remove a word from storage
 */
function removeWord(wordToRemove) {
  chrome.storage.sync.get(['highlightWords'], async (res) => {
    let words = Array.isArray(res.highlightWords) ? res.highlightWords : [];
    words = words.filter((w) => w !== wordToRemove);

    await chrome.storage.sync.set({ highlightWords: words });
    renderWords(words);
  });
}
