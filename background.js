chrome.browserAction.onClicked.addListener(function(tab) {
  if (
  !tab.url.includes("https://konto.flatex.at/next-desktop.at/overviewFormAction.do") &&
  !tab.url.includes("https://konto.flatex.de/next-desktop.at/overviewFormAction.do") // adjust to the exact page if needed
) {
  alert("This extension only works on the Flatex overview page.");
  return;
}



  // inject content script
  chrome.tabs.executeScript(tab.id, { file: "content.js" });
});

