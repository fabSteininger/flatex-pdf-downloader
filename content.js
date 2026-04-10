(async () => {
  const rows = document.querySelectorAll('.DocumentArchiveListEntryWidgetEntryRow');

  if (rows.length === 0) {
    chrome.runtime.sendMessage({ type: 'notify', text: "No documents found in the archive." });
    return;
  }

  // Inject UI Overlay
  const overlay = document.createElement('div');
  overlay.id = 'flatex-clicker-overlay';
  overlay.style.position = 'fixed';
  overlay.style.top = '20px';
  overlay.style.right = '20px';
  overlay.style.width = '300px';
  overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.85)';
  overlay.style.color = 'white';
  overlay.style.padding = '15px';
  overlay.style.borderRadius = '8px';
  overlay.style.zIndex = '10000';
  overlay.style.fontFamily = 'sans-serif';
  overlay.style.boxShadow = '0 4px 12px rgba(0,0,0,0.5)';

  overlay.innerHTML = `
    <h3 style="margin: 0 0 10px 0; font-size: 16px;">Flatex PDF Clicker</h3>
    <div id="flatex-progress-text" style="margin-bottom: 10px; font-size: 14px;">Initializing...</div>
    <div style="width: 100%; background: #444; height: 10px; border-radius: 5px; overflow: hidden;">
      <div id="flatex-progress-bar" style="width: 0%; height: 100%; background: #007bff; transition: width 0.3s;"></div>
    </div>
    <div id="flatex-warning" style="color: #ffc107; font-size: 12px; margin-top: 10px; display: none;">
      Warning: Some popups might be blocked. Please allow popups for this site.
    </div>
    <button id="flatex-close-btn" style="margin-top: 15px; width: 100%; padding: 8px; background: #dc3545; color: white; border: none; border-radius: 4px; cursor: pointer;">Close Overlay</button>
  `;

  document.body.appendChild(overlay);

  const progressText = document.getElementById('flatex-progress-text');
  const progressBar = document.getElementById('flatex-progress-bar');
  const closeBtn = document.getElementById('flatex-close-btn');

  closeBtn.onclick = () => overlay.remove();

  chrome.runtime.sendMessage({ type: 'start_tracking' });

  let i = 0;
  const total = rows.length;

  for (const row of rows) {
    i++;
    progressText.innerText = `Processing ${i} of ${total} documents...`;
    progressBar.style.width = `${(i / total) * 100}%`;

    row.scrollIntoView({ behavior: 'smooth', block: 'center' });
    row.click();

    await new Promise(r => setTimeout(r, 1500));
  }

  progressText.innerText = `Finished! ${total} documents clicked.`;
  progressBar.style.backgroundColor = '#28a745';

  chrome.runtime.sendMessage({ type: 'notify', text: `Finished: ${total} documents processed.` });
})();
