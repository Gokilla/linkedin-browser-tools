(async function autoConnectSearch() {
  const delay = ms => new Promise(res => setTimeout(res, ms));
  let totalConnected = 0;

  async function clickConnectButtons() {
    // On search results page, Connect buttons are <a> tags with aria-label="Invite X to connect"
    const connectLinks = [...document.querySelectorAll('a[aria-label*="Invite"][aria-label*="connect"]')];

    console.log(`Found Connect links: ${connectLinks.length}`);

    for (const link of connectLinks) {
      try {
        link.scrollIntoView({ behavior: 'smooth', block: 'center' });
        await delay(500);
        link.click();
        await delay(1200);

        // Handle "Send without a note" dialog
        const sendBtn = document.querySelector('button[aria-label="Send without a note"]')
          || [...document.querySelectorAll('button')].find(b =>
              b.innerText.includes('Send without a note') ||
              b.innerText.trim() === 'Send'
            );

        if (sendBtn) {
          sendBtn.click();
          await delay(600);
          console.log(`✅ Sent: ${++totalConnected}`);
        } else {
          // No dialog — request was sent directly, or dialog has different content
          totalConnected++;
          console.log(`✅ Sent: ${totalConnected}`);
        }

        // Close any leftover dialog
        const closeBtn = document.querySelector('button[aria-label="Dismiss"]')
          || document.querySelector('button[aria-label="Close"]');
        if (closeBtn) {
          closeBtn.click();
          await delay(300);
        }

      } catch (e) {
        console.warn('Error:', e);
      }

      await delay(1500);
    }
  }

  async function goToNextPage() {
    // LinkedIn search uses data-testid for pagination
    const nextBtn = document.querySelector('[data-testid="pagination-controls-next-button-visible"]')
      || document.querySelector('button[aria-label="Next"]');

    if (nextBtn && !nextBtn.disabled) {
      nextBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
      await delay(300);
      nextBtn.click();
      console.log('➡️ Going to next page...');
      await delay(3500);
      return true;
    }
    return false;
  }

  const maxPages = 10;

  for (let page = 1; page <= maxPages; page++) {
    console.log(`📄 Page ${page}/${maxPages}`);

    window.scrollTo(0, 0);
    await delay(600);
    window.scrollTo(0, document.body.scrollHeight);
    await delay(2000);
    window.scrollTo(0, 0);
    await delay(600);

    await clickConnectButtons();

    const hasNext = await goToNextPage();
    if (!hasNext) {
      console.log('🚫 No next page, stopping.');
      break;
    }
  }

  console.log(`🎉 Done! Total requests sent: ${totalConnected}`);
})();
