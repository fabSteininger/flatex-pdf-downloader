let managedTabs = new Set();

chrome.browserAction.onClicked.addListener(function(tab) {
  if (
    !tab.url.includes("https://konto.flatex.at/next-desktop.at/overviewFormAction.do") &&
    !tab.url.includes("https://konto.flatex.de/next-desktop.at/overviewFormAction.do")
  ) {
    chrome.notifications.create({
      type: "basic",
      iconUrl: "icon.png",
      title: "Flatex PDF Clicker",
      message: "This extension only works on the Flatex overview page."
    });
    return;
  }

  // inject content script
  chrome.tabs.executeScript(tab.id, { file: "content.js" });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'notify') {
    chrome.notifications.create({
      type: "basic",
      iconUrl: "icon.png",
      title: "Flatex PDF Clicker",
      message: message.text
    });
  } else if (message.type === 'status') {
    console.log("Status update:", message.text);
  } else if (message.type === 'start_tracking') {
      // Content script is about to start clicking
      managedTabs.clear();
  }
});

function isPdf(url) {
  return url.toLowerCase().endsWith('.pdf') || url.includes('type=pdf') || url.includes('/pdf/');
}

function isInterstitial(url) {
    // README mentions wait.html
    return url.includes('wait.html');
}

chrome.tabs.onCreated.addListener((tab) => {
    if (tab.openerTabId) {
        chrome.tabs.get(tab.openerTabId, (openerTab) => {
            if (openerTab && (openerTab.url.includes('flatex.at') || openerTab.url.includes('flatex.de'))) {
                managedTabs.add(tab.id);
            }
        });
    }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (managedTabs.has(tabId) && changeInfo.url) {
    const url = changeInfo.url;

    if (isPdf(url)) {
      chrome.downloads.download({
        url: url,
        conflictAction: 'uniquify'
      }, (downloadId) => {
          if (chrome.runtime.lastError) {
              console.error("Download failed:", chrome.runtime.lastError);
          } else {
              // Successfully started download, close tab
              chrome.tabs.remove(tabId);
              managedTabs.delete(tabId);
          }
      });
    } else if (isInterstitial(url)) {
        console.log("On interstitial page:", url);
    }
  }
});

chrome.webNavigation.onBeforeNavigate.addListener((details) => {
    if (managedTabs.has(details.tabId) && isPdf(details.url)) {
        chrome.downloads.download({
            url: details.url,
            conflictAction: 'uniquify'
        }, () => {
            chrome.tabs.remove(details.tabId);
            managedTabs.delete(details.tabId);
        });
    }
});
