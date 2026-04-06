(async function autoConnectSearch() {
  const delay = ms => new Promise(res => setTimeout(res, ms));
  let totalConnected = 0;

  async function clickConnectButtons() {
    const buttons = [...document.querySelectorAll('button')]
      .filter(btn => {
        const text = btn.innerText.trim();
        return text === 'Connect' || btn.querySelector('span')?.innerText?.trim() === 'Connect';
      });

    console.log(`Found Connect buttons: ${buttons.length}`);

    for (const btn of buttons) {
      if (btn.disabled) continue;

      try {
        btn.scrollIntoView({ behavior: 'smooth', block: 'center' });
        await delay(400);
        btn.click();
        await delay(800);

        const sendBtn = document.querySelector('button[aria-label="Send without a note"]')
          || [...document.querySelectorAll('button')].find(b =>
              b.innerText.includes('Send without a note') ||
              b.innerText.trim() === 'Send'
            );

        if (sendBtn) {
          sendBtn.click();
          await delay(500);
        }

        const closeBtn = document.querySelector('button[aria-label="Dismiss"]')
          || document.querySelector('button[aria-label="Close"]');
        if (closeBtn) {
          closeBtn.click();
          await delay(300);
        }

        totalConnected++;
        console.log(`Sent: ${totalConnected}`);
      } catch (e) {
        console.warn('Error on button:', e);
      }

      await delay(1200);
    }
  }

  async function goToNextPage() {
    const nextBtn = document.querySelector('button[aria-label="Next"]');
    if (nextBtn && !nextBtn.disabled) {
      nextBtn.click();
      console.log('Going to next page...');
      await delay(3000);
      return true;
    }
    return false;
  }

  const maxPages = 10;

  for (let page = 1; page <= maxPages; page++) {
    console.log(`Page ${page}/${maxPages}`);

    window.scrollTo(0, 0);
    await delay(500);
    window.scrollTo(0, document.body.scrollHeight);
    await delay(1500);
    window.scrollTo(0, 0);
    await delay(500);

    await clickConnectButtons();

    const hasNext = await goToNextPage();
    if (!hasNext) {
      console.log('No next page, stopping.');
      break;
    }
  }

  console.log(`Done! Total requests sent: ${totalConnected}`);
})();
