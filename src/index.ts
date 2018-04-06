import { launch } from 'puppeteer';
import devices, { DeviceDescription } from 'puppeteer/DeviceDescriptors';
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

export async function screenshot(url: string, emulatedDevice: DeviceDescription) {
  const browser = await launch();
  const page = await browser.newPage();

  await page.emulate(emulatedDevice);
  await page.goto(url);

  const baseline = await page.screenshot();

  const link = await page.$(`a[href='/demos']`);
  if (link === null) {
    return;
  }
  await link.hover();

  const hovered = await page.screenshot();

  await browser.close();

  const [diffs, diffPng] = diffImageBuffers(baseline, hovered);

  if (diffs > 0) {
    diffPng.pack().pipe(fs.createWriteStream('diff.png'));
  }
}


export async function trace(url: string) {
  const browser = await launch();
  const page = await browser.newPage();
  await page.tracing.start({path: 'trace.json'});
  await page.goto(url);
  await page.tracing.stop();

  await browser.close();
}

const inUrl = process.argv[2];

screenshot(inUrl, devices['iPhone 6']);
