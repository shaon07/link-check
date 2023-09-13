// content.js
function normalizeURL(url) {
  // Use the URL object to extract the domain
  const urlObj = new URL(url);
  const domain = urlObj.hostname.toLowerCase();

  // Create a new URL with just the protocol and domain
  const truncatedURL = urlObj.protocol + "//" + domain;

  return truncatedURL;
}

function injectTextContent(count) {
  // Inject the text content into the DOM with custom CSS styles
  const div = document.createElement("div");
  div.innerText = `You have visited this page before`;
  div.setAttribute("id", "visited-text"); // Add an ID for easy removal

  // Apply CSS styles
  div.style.cssText +=
    "position: sticky; background-color: red; bottom: 20px; z-index: 9999999999999999999999; padding: 10px; color: white; border-radius: 10px; width: 300px; left: 20px;";

  document.body.appendChild(div);
}

const currentURL = window.location.href;
const truncatedURL = normalizeURL(currentURL);
let visitCount = 0;

chrome.storage.sync.get("urls", function (data) {
  const savedURLs = data.urls || [];

  // Check if the truncated URL is in the list of saved URLs
  visitCount = savedURLs.filter((link) => link === truncatedURL).length;

  if (visitCount > 0) {
    injectTextContent(visitCount);
  }

  if (!savedURLs.includes(truncatedURL)) {
    // Inject the URL into the DOM with custom CSS styles

    // Save the truncated URL to prevent re-injection
    savedURLs.push(truncatedURL);
    chrome.storage.sync.set({ urls: savedURLs }, function () {
      // Handle errors if necessary
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
      }
    });
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
      if(message.url === truncatedURL){
        visitedText.remove(); // Remove the visited text from the DOM
      }
      // visitedText.remove(); // Remove the visited text from the DOM
    }
  }
});
