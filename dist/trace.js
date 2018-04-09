"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const puppeteer_1 = require("puppeteer");
const DeviceDescriptors_1 = tslib_1.__importDefault(require("puppeteer/DeviceDescriptors"));
async function trace(page, url, traceFilePath) {
    await page.tracing.start({ path: traceFilePath });
    await page.goto(url);
    await page.tracing.stop();
}
exports.trace = trace;
const inUrl = 'https://stenciljs.com';
const traceFilePath = 'trace.json';
puppeteer_1.launch()
    .then(async function (browser) {
    const page = await browser.newPage();
    await page.emulate(DeviceDescriptors_1.default['iPhone 6']);
    await trace(page, inUrl, traceFilePath);
    await browser.close();
});
