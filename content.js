

  
  // content.js
function normalizeURL(url) {
    // Remove "www." and other variations, and convert to lowercase
    url = url.replace(/^(https?:\/\/)?(www\d?\.)?/i, "").toLowerCase();
  
    // Remove trailing slashes
    url = url.replace(/\/$/, "");
  
    return url;
  }
  
  const currentURL = window.location.href;
  const normalizedURL = normalizeURL(currentURL);
  
  chrome.storage.sync.get("urls", function (data) {
    const savedURLs = data.urls || [];
    const normalizedSavedURLs = savedURLs.map(normalizeURL);
    if (!normalizedSavedURLs.includes(normalizedURL)) {
      savedURLs.push(currentURL);
      chrome.storage.sync.set({ urls: savedURLs });
      // Inject the URL into the DOM (you can customize this)
      const div = document.createElement("div");
      div.innerText = "You have visited this page before.";
      div.style.cssText += 'position: sticky; background-color: red; bottom: 20px; z-index: 9999999999999999999999; padding: 10px; color: white; border-radius: 10px; width: 300px; left: 20px;';
      div.setAttribute("id", "visited-text"); // Add an ID for easy removal
      document.body.appendChild(div);
    }
  });
  
  // Listen for changes in storage (URL removal)
  chrome.storage.onChanged.addListener(function (changes, namespace) {
    if (namespace === "sync" && "urls" in changes) {
      const removedURLs = changes.urls.oldValue.filter(
        (url) => !savedURLs.includes(url)
      );
  
      // Check if the current URL's associated text needs to be removed
      if (removedURLs.includes(currentURL)) {
        const visitedText = document.getElementById("visited-text");
        if (visitedText) {
          visitedText.remove(); // Remove the visited text from the DOM
        }
      }
    }
  });

  chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.action === "removeVisitedText") {
      const visitedText = document.getElementById("visited-text");
      if (visitedText) {
        visitedText.remove(); // Remove the visited text from the DOM
      }
    }
  });
  
  

  