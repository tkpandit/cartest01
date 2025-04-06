const { test, expect, chromium } = require('@playwright/test');

test('rategain_rate_approve', async () => { // <--- Using test() here but also launching browser manually
  const browser = await chromium.launch({
    headless: false
  });
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto('https://cargain.rategain.com');
  await page.locator('#userNameId').fill('Calgary');
  await page.locator('#userNameId').press('Tab');
  await page.locator('#loginPassword').fill('RG@2018');
  await page.locator('#loginPassword').press('Enter');
  await page.getByRole('link', { name: 'REV.AI' }).click();

  // await page.pause();
  await page.waitForLoadState('networkidle');
  // await page.waitForSelector('.loader-overlay', { state: 'visible' });

//No. of frame Present on Page.
  const frames = page.frames();
  console.log(`Found ${frames.length} iframes`);
  frames.forEach((frame, index) => {
    console.log(`Frame ${index}:`, frame.url());
  });

  //Try to get which frame has Data Studio link , and its Exaact locator
  if (frames.length >= 1) {
    const secondFrame = frames[1];
    const secondFrameCount = await secondFrame.locator('a:has-text("Data Studio")').count();
    const dataStudioLocator = secondFrame.locator('a:has-text("Data Studio")');

    try {
      await dataStudioLocator.evaluate(el => el.click());
    } catch (error) {
      console.log('Click failed, trying fallback methods...');
    }
  }
  else {
    console.log('Second frame not found! Available frames:', frames.length);
  }
  await page.pause();
});
