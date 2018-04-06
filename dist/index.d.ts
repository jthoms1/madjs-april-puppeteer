import { Page } from 'puppeteer';
export declare function screenshotDiffPage(page: Page): Promise<void>;
export declare function evaulateOnPage(page: Page): Promise<void>;
export declare function trace(page: Page, url: string): Promise<void>;
