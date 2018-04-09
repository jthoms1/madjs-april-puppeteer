import { launch, Page } from 'puppeteer';
import devices from 'puppeteer/DeviceDescriptors';

export async function trace(page: Page, url: string, traceFilePath: string) {
  await page.tracing.start({ path: traceFilePath });
  await page.goto(url);
  await page.tracing.stop();
}

const inUrl = 'https://stenciljs.com';
const traceFilePath = 'trace.json';

launch()
  .then(async function(browser) {
    const page = await browser.newPage();
    await page.emulate(devices['iPhone 6']);

    await trace(page, inUrl, traceFilePath);

    await browser.close();
  });
