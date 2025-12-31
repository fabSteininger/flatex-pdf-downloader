(async () => {
  const rows = document.querySelectorAll('.DocumentArchiveListEntryWidgetEntryRow');

  let i = 0;
  for (const row of rows) {
    row.scrollIntoView({ behavior: 'smooth', block: 'center' });
    row.click();
    i++;

    // short pause to avoid popup block
    await new Promise(r => setTimeout(r, 1200));
  }

  console.log(`Fertig: ${i} Dokumente angeklickt`);
})();

