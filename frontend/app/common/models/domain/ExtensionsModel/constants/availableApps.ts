// @ts-ignore
// @ts-ignore
import GmailLogo from '-!svg-react-loader?name=GmailLogo!../../../../commonAssets/gmail_logo.svg';
import ZapierLogo from '-!svg-react-loader?name=ZapierLogo!../../../../commonAssets/zapier_logo.svg';
import { i18mark } from '../../../../i18n';

export default [
  {
    name: 'TimeCamp',
    icon: 'https://tocpjptk01.execute-api.eu-central-1.amazonaws.com/dev/resize?key=360x360_b/44c08debec1c127ec63579eaefb921164769d580115ed6faea21d1a22411967c',
    thumbnail: 'https://hey.space/assets/images/apps/timecamp-screen.png',
    description: i18mark(`Track time to your boards and generate reports based on that.`),
    link: 'https://www.timecamp.com/addons/heyspace',
  },
  {
    name: 'GMail',
    icon: GmailLogo,
    description: i18mark(`Move your emails to Planner as tasks and manage them.`),
    link: 'https://gsuite.google.com/marketplace/app/heyspace_for_gmail/150714248122',
  },
  {
    name: 'Zapier',
    icon: ZapierLogo,
    description: i18mark(`Connect Planner with 1,500+ apps to automate your work and find productivity super powers.`),
    link: 'https://zapier.com/apps/heyspace/integrations',
  },
  {
    name: 'Make',
    icon: 'https://tc3-img-dev.s3.eu-central-1.amazonaws.com/f9030cc6eb9989f9d9212b4ac6f3e0b22783c7ded58859a9cecfdaa59e95deb0',
    description: i18mark(`Connect Planner with your favorite apps to automate your workflows without coding.`),
    link: 'https://www.make.com/en/integrations/heyspace',
  },
];
