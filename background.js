// background.js

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    if (request.type === 'TOGGLE_HIGHLIGHT') {
      const tab = await getActiveTab();
      if (tab) {
        if (request.enabled) {
          // Inject the content script
          chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ['contentScript.js']
          });
        } else {
          // Simple approach: reload the page to remove all highlights
          // or handle it differently by messaging the content script to remove them
          chrome.tabs.reload(tab.id);
        }
      }
      sendResponse({ status: 'done' });
    }
  });
  
  // Utility function to get the currently active tab
  async function getActiveTab() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    return tab;
  }
  