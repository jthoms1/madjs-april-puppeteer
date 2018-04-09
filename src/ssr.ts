import { Page } from 'puppeteer';

export async function ssr(page: Page, url: string) {
  await page.goto(url, {waitUntil: 'networkidle0'});
  const html = await page.content(); // serialized HTML of page DOM.
  return html;
}
