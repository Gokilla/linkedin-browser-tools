(async function autoConnect() {
  const delay = ms => new Promise(res => setTimeout(res, ms));

  let totalConnected = 0;

  async function clickConnectButtons() {
    const buttons = [...document.querySelectorAll('button')]
      .filter(btn => btn.innerText.trim() === 'Connect');

    console.log(`Found Connect buttons: ${buttons.length}`);

    for (const btn of buttons) {
      if (btn.disabled) continue;
      btn.click();
      await delay(300);

      const sendBtn = document.querySelector('button[aria-label="Send without a note"]')
        || [...document.querySelectorAll('button')].find(b => b.innerText.includes('Send without a note'));
      if (sendBtn) {
        sendBtn.click();
        await delay(300);
      }

      totalConnected++;
      console.log(`Requests sent: ${totalConnected}`);
      await delay(800);
    }
  }

  async function scrollAndConnect(iterations = 20) {
    for (let i = 0; i < iterations; i++) {
      await clickConnectButtons();

      const modal = document.querySelector('.artdeco-modal__content, [data-test-modal], .scaffold-finite-scroll__content');
      if (modal) {
        modal.scrollTop += 800;
      } else {
        window.scrollBy(0, 800);
      }

      console.log(`Iteration ${i + 1}/${iterations}, waiting for new cards...`);
      await delay(2000);
    }

    console.log(`Done! Total requests sent: ${totalConnected}`);
  }

  await scrollAndConnect(20);
})();
