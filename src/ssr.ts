import { launch, Page } from 'puppeteer';
import devices from 'puppeteer/DeviceDescriptors';
import fs from 'fs';

async function ssr(page: Page, url: string) {
  await page.goto(url, { waitUntil: 'networkidle0' });
  const html = await page.content(); // serialized HTML of page DOM.
  return html;
}


const inUrl = 'https://stenciljs.com';
const filePath = 'index.html';

launch()
  .then(async function(browser) {
    const page = await browser.newPage();
    await page.emulate(devices['iPhone 6']);

    const html = await ssr(page, inUrl);
    fs.writeFileSync(filePath, html, { encoding: 'utf8' });

    await browser.close();
  });
