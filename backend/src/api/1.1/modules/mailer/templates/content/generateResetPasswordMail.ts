import { FrontendRoute } from '../../../../../../config/frontendRoutes.config';
import { UrlGeneratorInterface } from '../../../common/UrlGenerator';
import { UserDbRow } from '../../../db/schema';
import generateCTAButtonHTML from '../partial/generateCTAButtonHTML';

type ResetPasswordMailParams = {
  urlGenerator: UrlGeneratorInterface;
  user: UserDbRow;
  resetPasswordToken: string;
};

const generateResetPasswordMail = ({ user, resetPasswordToken, urlGenerator }: ResetPasswordMailParams) => ({
  subject: 'TimeCamp Planner password reset',
  content: `
<p style="font-family:Poppins,system,-apple-system,-webkit-system-font,SFNSText,sans-serif;line-height:1.6em;font-size:17px;font-weight:normal;margin:0;margin-bottom:15px;color:#53585f;">
    You recently requested to reset your password for your TimeCamp Planner account ${
      user.firstName || user.lastName ? `${user.firstName || ''} ${user.lastName || ''}` : `${user.email || ''}`
    }.
    Click the button below to reset it.</p>
    ${generateCTAButtonHTML({
      buttonCaption: 'Reset your password',
      buttonUrl: urlGenerator.generate(FrontendRoute.RESET_PASSWORD, { token: resetPasswordToken }),
    })}
    <p style="font-family:Poppins,system,-apple-system,-webkit-system-font,SFNSText,sans-serif;line-height:1.6em;font-size:17px;font-weight:normal;margin:0;margin-bottom:15px;color:#53585f;">
        If you didn't ask to change your password, just ignore this email. Your password won't be changed until you create a
        new password.</p>
`,
});
export default generateResetPasswordMail;
