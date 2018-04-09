import { launch, Page } from 'puppeteer';
import devices from 'puppeteer/DeviceDescriptors';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';
import fs from 'fs';

/**
 * Compare 2 PNG image buffers and return a PNG and number of pixels that differ
 */
function diffImageBuffers(buffer1: Buffer, buffer2: Buffer): [number, PNG] {
  const png1 = PNG.sync.read(buffer1);
  const png2 = PNG.sync.read(buffer2);

  var diff = new PNG({width: png1.width, height: png1.height});
  var diffs = pixelmatch(png1.data, png2.data, diff.data, diff.width, diff.height);

  return [diffs, diff];
}

export async function screenshotDiffPage(page: Page, url: string) {

  await page.goto(url, { waitUntil: 'networkidle0' });
  const baseline = await page.screenshot();

  const link = await page.$(`a[href='/demos']`);
  if (link === null) {
    return;
  }
  await link.hover();
  const hovered = await page.screenshot();
  await link.dispose();

  const [diffs, diffPng] = diffImageBuffers(baseline, hovered);
  if (diffs > 0) {
    diffPng.pack().pipe(fs.createWriteStream('diff.png'));
  }
}

const inUrl = 'https://stenciljs.com';
const filePath = 'index.html';

launch()
  .then(async function(browser) {
    const page = await browser.newPage();
    await page.emulate(devices['iPhone 6']);

    const html = await screenshotDiffPage(page, inUrl);
    fs.writeFileSync(filePath, html, { encoding: 'utf8' });

    await browser.close();
  });
