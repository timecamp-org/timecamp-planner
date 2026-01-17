import { useEffect, useState } from 'react';

import { detect } from 'detect-browser';

export const useSupportedDesktopBrowser = () => {
  const [isSupportedDesktopBrowser, setIsSupportedDesktopBrowser] = useState(false);

  useEffect(() => {
    const { name } = detect();
    setIsSupportedDesktopBrowser(checkIfDesktopBrowserIsSupported(name));
  }, []);

  return { isSupportedDesktopBrowser };
};

const SUPPORTED_BROWSERS = ['chrome', 'firefox', 'opera', 'edge', 'edge-chromium', 'chromium', 'safari'];

function checkIfDesktopBrowserIsSupported(name: string): boolean {
  const browserName = name.toLowerCase();

  return !!SUPPORTED_BROWSERS.find((browser) => browserName.toLowerCase().includes(browser));
}
