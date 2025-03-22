export const getDeviceInfo = (
  setOS: (os: string) => void,
  setBrowser: (browser: string) => void,
) => {
  const userAgent = navigator.userAgent;
  let os = "Unknown";
  let browser = "Unknown";

  if (/(iPhone|iPad|iPod)/i.test(userAgent)) {
    os = "iOS";
  } else if (/Android/i.test(userAgent)) {
    os = "Android";
  } else if (/Mac/i.test(userAgent)) {
    os = "MacOS";
  } else if (/Win/i.test(userAgent)) {
    os = "Windows";
  } else if (/Linux/i.test(userAgent)) {
    os = "Linux";
  }

  if (/Edg/i.test(userAgent)) {
    browser = "Edge";
  } else if (/OPR|Opera/i.test(userAgent)) {
    browser = "Opera";
  } else if (/Chrome/i.test(userAgent) && !/Chromium/i.test(userAgent)) {
    browser = "Chrome";
  } else if (/Firefox/i.test(userAgent)) {
    browser = "Firefox";
  } else if (
    /Safari/i.test(userAgent) &&
    !/Chrome|Chromium|Edge|OPR|Opera/i.test(userAgent)
  ) {
    browser = "Safari";
  }

  setOS(os);
  setBrowser(browser);
};
