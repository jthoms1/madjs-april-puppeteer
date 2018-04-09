"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const puppeteer_1 = require("puppeteer");
const DeviceDescriptors_1 = tslib_1.__importDefault(require("puppeteer/DeviceDescriptors"));
const fs_1 = tslib_1.__importDefault(require("fs"));
async function ssr(page, url) {
    await page.goto(url, { waitUntil: 'networkidle0' });
    const html = await page.content(); // serialized HTML of page DOM.
    return html;
}
const inUrl = 'https://stenciljs.com';
const filePath = 'index.html';
puppeteer_1.launch()
    .then(async function (browser) {
    const page = await browser.newPage();
    await page.emulate(DeviceDescriptors_1.default['iPhone 6']);
    const html = await ssr(page, inUrl);
    fs_1.default.writeFileSync(filePath, html, { encoding: 'utf8' });
    await browser.close();
});
