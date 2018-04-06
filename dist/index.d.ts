import { DeviceDescription } from 'puppeteer/DeviceDescriptors';
export declare function screenshot(url: string, emulatedDevice: DeviceDescription): Promise<void>;
export declare function trace(url: string): Promise<void>;
