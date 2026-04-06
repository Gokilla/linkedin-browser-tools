(async function autoConnectSearch() {
  const delay = ms => new Promise(res => setTimeout(res, ms));
  let totalConnected = 0;

  async function clickConnectButtons() {
    // LinkedIn uses aria-label="Invite X to connect" on search results page
    const buttons = [...document.querySelectorAll('button')]
      .filter(btn => {
        const label = btn.getAttribute('aria-label') || '';
        const text = btn.innerText.trim();
        return (
          label.toLowerCase().includes('invite') ||
          label.toLowerCase().includes('connect') ||
          text === 'Connect'
        );
      })
      // Skip "Pending" / "Message" / "Follow" buttons
      .filter(btn => !btn.innerText.toLowerCase().includes('pending'))
      .filter(btn => !btn.innerText.toLowerCase().includes('message'))
      .filter(btn => !btn.innerText.toLowerCase().includes('follow'));

    console.log(`Found Connect buttons: ${buttons.length}`);

    for (const btn of buttons) {
      if (btn.disabled) continue;

      try {
        btn.scrollIntoView({ behavior: 'smooth', block: 'center' });
        await delay(500);
        btn.click();
        await delay(1000);

        // Handle "Send without a note" dialog
        const sendBtn = document.querySelector('button[aria-label="Send without a note"]')
          || [...document.querySelectorAll('button')].find(b =>
              b.innerText.includes('Send without a note') ||
              b.innerText.trim() === 'Send'
            );

        if (sendBtn) {
          sendBtn.click();
          await delay(500);
        }

        // Close any leftover dialog
        const closeBtn = document.querySelector('button[aria-label="Dismiss"]')
          || document.querySelector('button[aria-label="Close"]');
        if (closeBtn) {
          closeBtn.click();
          await delay(300);
        }

        totalConnected++;
        console.log(`✅ Sent: ${totalConnected}`);
      } catch (e) {
        console.warn('Error on button:', e);
      }

      await delay(1500);
    }
  }

  async function goToNextPage() {
    // Try button first, then anchor tag
    const nextBtn = document.querySelector('button[aria-label="Next"]')
      || [...document.querySelectorAll('a')].find(a => a.getAttribute('aria-label') === 'Next');

    if (nextBtn && !nextBtn.disabled) {
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

    // Scroll to load all cards
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
