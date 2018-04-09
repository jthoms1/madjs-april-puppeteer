"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const puppeteer_1 = require("puppeteer");
const DeviceDescriptors_1 = tslib_1.__importDefault(require("puppeteer/DeviceDescriptors"));
async function evaulateOnPage(page) {
    const link = await page.$(`a[href='/demos']`);
    if (!link) {
        return;
    }
    await link.click();
    const results = await page.evaluate((anchorElement) => {
        return anchorElement.classList;
    }, link);
    await link.dispose();
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
