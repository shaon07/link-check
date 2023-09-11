// popup.js
document.addEventListener("DOMContentLoaded", function () {
    const urlList = document.getElementById("url-list");
  
    function updateURLList() {
      chrome.storage.sync.get("urls", function (data) {
        urlList.innerHTML = ""; // Clear the list
        const savedURLs = data.urls || [];
  
        if (savedURLs.length > 0) {
          savedURLs.forEach(function (url) {
            const listItem = document.createElement("li");
            listItem.textContent = url;
  
            const removeButton = document.createElement("button");
            removeButton.textContent = "Remove";
  
            // Add a click event listener to remove the URL and send a message to content script
            removeButton.addEventListener("click", function () {
              // Remove the clicked URL from storage
              const index = savedURLs.indexOf(url);
              if (index !== -1) {
                savedURLs.splice(index, 1);
                chrome.storage.sync.set({ urls: savedURLs });
                updateURLList(); // Refresh the list
                // Send a message to the content script to remove the visited text
                chrome.tabs.query({ active: true, currentWindow: true }, function (
                  tabs
                ) {
                  chrome.tabs.sendMessage(tabs[0].id, {
                    action: "removeVisitedText",
                  });
                });
              }
            });
  
            listItem.appendChild(removeButton);
            urlList.appendChild(listItem);
          });
        } else {
          const listItem = document.createElement("li");
          listItem.textContent = "No visited URLs.";
          urlList.appendChild(listItem);
        }
      });
    }
  
    // Initial update of the URL list
    updateURLList();
  });
  