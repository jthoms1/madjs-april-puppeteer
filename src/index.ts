import { launch, Page } from 'puppeteer';
import devices from 'puppeteer/DeviceDescriptors';

export async function evaulateOnPage(page: Page) {

  const link = await page.$(`a[href='/demos']`);
  if (!link) { return; }

  await link.click();

  const results = await page.evaluate((anchorElement: HTMLAnchorElement) => {

    return anchorElement.classList;
  }, link);

  await link.dispose();

  console.log(results);
}


export async function trace(page: Page, url: string) {
  await page.tracing.start({path: 'trace.json'});
  await page.goto(url);
  await page.tracing.stop();
}

const inUrl = process.argv[2];

launch()
  .then(async function(browser) {
    const page = await browser.newPage();
    await page.emulate(devices['iPhone 6']);
    await page.goto(inUrl);

    // await screenshotDiffPage(page);
    await evaulateOnPage(page);

    await browser.close();
  });
