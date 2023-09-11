// background.js
chrome.runtime.onInstalled.addListener(function () {
    chrome.storage.sync.set({ urls: [] });
  });
  
  // Listen for tab removal and clear related URL
  chrome.tabs.onRemoved.addListener(function (tabId, removeInfo) {
    if (removeInfo.isWindowClosing) return;
    chrome.tabs.get(tabId, function (tab) {
      if (tab && tab.url) {
        chrome.storage.sync.get("urls", function (data) {
          const urls = data.urls || [];
          const index = urls.indexOf(tab.url);
          if (index !== -1) {
            urls.splice(index, 1);
            chrome.storage.sync.set({ urls: urls });
          }
        });
      }
    });
  });
  