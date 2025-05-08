// @ts-nocheck
const { chromium } = require("playwright"); // npm install playwright

(async () => {
  const browser = await chromium.launch({ headless: false }); // set headless: true for no UI
  const page = await browser.newPage();

  // Step 1: Go to Google
  await page.goto("https://www.google.com");

  // Accept cookies if prompted
  try {
    const acceptBtn = await page.waitForSelector('button:has-text("Aceptar")', {
      timeout: 3000,
    });
    await acceptBtn.click();
  } catch (err) {
    console.error(`${err.message}`);
  }

  // Step 2: Search for "automation"
  await page
    .getByPlaceholder("input[placeholder='Search Google or type a URL']")
    .fill("automation");
  await page.keyboard.press("Enter");
  await page.waitForSelector("h3"); // wait for search results

  // Step 3: Click the Wikipedia link
  const links = await page.$$("a");
  for (const link of links) {
    const href = await link.getAttribute("href");
    const text = await link.textContent();
    if (
      href &&
      href.includes("wikipedia.org") &&
      text.toLowerCase().includes("automation")
    ) {
      await Promise.all([page.waitForNavigation(), link.click()]);
      break;
    }
  }

  // Step 4: Extract the year of the first automatic process
  const content = await page.content();
  const yearMatch = content.match(
    /(\b1[0-9]{3}\b|\b20[0-2][0-9]\b).{0,40}(automatic|automation|automated)/i
  );

  if (yearMatch) {
    console.log(`Found year: ${yearMatch[1]}`);
  } else {
    console.log("No year found related to the first automatic process.");
  }

  // Step 5: Take a screenshot
  await page.screenshot({ path: "wikipedia_automation.png", fullPage: true });

  await browser.close();
})();
