export interface GetBrowserVersionInterface {
  name: string;
  version: string[];
}

export default function getBrowserVersion():
  | string
  | GetBrowserVersionInterface {
  var { userAgent } = window.navigator;
  var temporary;
  var match =
    userAgent.match(
      /(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i
    ) || [];
  if (/trident/i.test(match[1])) {
    temporary = /\brv[ :]+(\d+)/g.exec(userAgent) || [];
    return { name: 'IE', version: temporary[1] || '' };
  }
  if (match[1] === 'Chrome') {
    temporary = userAgent.match(/\b(OPR|Edge)\/(\d+)/);
    if (temporary != null)
      return {
        name: temporary[1].replace('OPR', 'Opera'),
        version: temporary[2],
      };
  }
  match = match[2]
    ? [match[1], match[2]]
    : [window.navigator.appName, window.navigator.appVersion, '-?'];
  if (userAgent.match(/version\/(\d+)/i) != null) {
    temporary = userAgent.match(/version\/(\d+)/i);
    match.splice(1, 1, temporary[1]);
  }
  return `${match[0]} ${match[1]}`;
}
