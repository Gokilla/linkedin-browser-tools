# LinkedIn Auto Connect

Browser console scripts to automatically send connection requests on LinkedIn.

## Scripts

### 1. `modal-connect.js` — "People You May Know" Modal

Use this on the LinkedIn home feed when the **"People you may know"** modal is open.

**How to use:**
1. Open LinkedIn and trigger the "People you may know" popup
2. Open DevTools → **Console** (F12)
3. Paste the script and press Enter

**Config:**
```js
await scrollAndConnect(20); // number of scroll iterations
```

---

### 2. `search-connect.js` — Search Results Page

Use this on LinkedIn **People search** pages, e.g.:

```
https://www.linkedin.com/search/results/people/?keywords=palo+alto
```

**How to use:**
1. Open a LinkedIn people search URL
2. Open DevTools → **Console** (F12)
3. Paste the script and press Enter

**Config:**
```js
const maxPages = 10; // number of result pages to process (~10 people each)
```

---

## Notes

- LinkedIn enforces a **~100 connection requests per week** limit — use responsibly
- Delays between clicks are intentional to avoid rate limiting; don't reduce them too much
- Scripts handle the "Send without a note" dialog automatically
- If LinkedIn asks "How do you know this person?", the script will dismiss the dialog

## Disclaimer

These scripts are for educational purposes. Use at your own risk — automation may violate LinkedIn's Terms of Service.
