"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const puppeteer_1 = require("puppeteer");
const DeviceDescriptors_1 = tslib_1.__importDefault(require("puppeteer/DeviceDescriptors"));
const pixelmatch_1 = tslib_1.__importDefault(require("pixelmatch"));
const pngjs_1 = require("pngjs");
const fs_1 = tslib_1.__importDefault(require("fs"));
/**
 * Compare 2 PNG image buffers and return a PNG and number of pixels that differ
 */
function diffImageBuffers(buffer1, buffer2) {
    const png1 = pngjs_1.PNG.sync.read(buffer1);
    const png2 = pngjs_1.PNG.sync.read(buffer2);
    var diff = new pngjs_1.PNG({ width: png1.width, height: png1.height });
    var diffs = pixelmatch_1.default(png1.data, png2.data, diff.data, diff.width, diff.height);
    return [diffs, diff];
}
async function screenshotDiffPage(page) {
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
        diffPng.pack().pipe(fs_1.default.createWriteStream('diff.png'));
    }
}
exports.screenshotDiffPage = screenshotDiffPage;
async function evaulateOnPage(page) {
    const link = await page.$(`a[href='/demos']`);
    if (!link) {
        return;
    }
    await link.click();
    const results = await page.evaluate(async (anchorElement) => {
        return anchorElement.classList;
    }, link);
    console.log(results);
}
exports.evaulateOnPage = evaulateOnPage;
async function trace(page, url) {
    await page.tracing.start({ path: 'trace.json' });
    await page.goto(url);
    await page.tracing.stop();
}
exports.trace = trace;
const inUrl = process.argv[2];
puppeteer_1.launch()
    .then(async function (browser) {
    const page = await browser.newPage();
    await page.emulate(DeviceDescriptors_1.default['iPhone 6']);
    await page.goto(inUrl);
    // await screenshotDiffPage(page);
    await evaulateOnPage(page);
    await browser.close();
});
