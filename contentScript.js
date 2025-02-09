// contentScript.js

chrome.storage.sync.get(['highlightWords'], (res) => {
    const words = Array.isArray(res.highlightWords) ? res.highlightWords : [];
    if (words.length > 0) {
      highlightWords(words);
    }
  });
  
  /**
   * highlightWords
   * Given an array of words, highlight all occurrences in the DOM.
   */
  function highlightWords(words) {
    // Create a combined RegExp that matches ANY of the words, ignoring case.
    // Escape each word to avoid special regex chars, then join with '|'.
    const escapedWords = words.map((w) => escapeRegExp(w));
    const pattern = `(${escapedWords.join('|')})`;
    const regex = new RegExp(pattern, 'gi');
  
    // Walk the DOM and highlight
    walkAndHighlight(document.body, regex);
  }
  
  /**
   * Recursively traverse the DOM to highlight text nodes.
   */
  function walkAndHighlight(node, regex) {
    // Skip certain nodes
    if (
      node.nodeName === 'SCRIPT' ||
      node.nodeName === 'STYLE' ||
      node.nodeName === 'INPUT' ||
      node.nodeName === 'TEXTAREA'
    ) {
      return;
    }
  
    if (node.nodeType === Node.TEXT_NODE) {
      const parent = node.parentNode;
      if (!parent) return;
  
      const text = node.nodeValue;
      const newHTML = text.replace(regex, '<mark style="background-color: yellow;">$1</mark>');
  
      if (newHTML !== text) {
        // Create an element to parse new HTML
        const tempElem = document.createElement('span');
        tempElem.innerHTML = newHTML;
  
        // Replace original text node with the new DOM structure
        parent.replaceChild(tempElem, node);
      }
    } else {
      // Recurse on child nodes
      for (let i = 0; i < node.childNodes.length; i++) {
        walkAndHighlight(node.childNodes[i], regex);
      }
    }
  }
  
  /**
   * Escape regex special characters in a string.
   */
  function escapeRegExp(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
  