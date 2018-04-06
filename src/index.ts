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

export async function screenshotDiffPage(page: Page) {

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
