declare module 'puppeteer/DeviceDescriptors' {
  namespace devices {
    interface DeviceDescription {
      name: string,
      userAgent: string,
      viewport: {
        width: number,
        height: number,
        deviceScaleFactor: number,
        isMobile: boolean,
        hasTouch: boolean,
        isLandscape: boolean
      }
    }
  }

  const devices: { [key: string]: devices.DeviceDescription };

  export = devices;
}
