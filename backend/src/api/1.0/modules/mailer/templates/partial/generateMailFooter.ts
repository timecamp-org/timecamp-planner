import { FrontendRoute } from '../../../../../../config/frontendRoutes.config';
import { UrlGeneratorInterface } from '../../../common/UrlGenerator';

type MailFooterGeneratorConfig = {
  recipientEmail: string;
  urlGenerator: UrlGeneratorInterface;
};

export const mailFooterStyles = `.footer {
            clear: both;
            padding-top: 10px;
            text-align: center;
            width: 100%; }
        .footer td,
        .footer p,
        .footer span,
        .footer a {
            color: #8a8a8a;
            font-size: 11px !important;
            text-align: center; }`;

export const generateMailFooter = ({
  recipientEmail,
  urlGenerator,
}: MailFooterGeneratorConfig): string => `<div class="footer" style="clear:both;padding-top:10px;text-align:center;width:100%;color:#8a8a8a">
                    <table width="600" cellpadding="0" cellspacing="0" border="0" align="center"
                           style="border-collapse:collapse">
                        <tbody>
                        <tr>
                            <td height="20" style="border-collapse:collapse;line-height:20px;font-size:20px">&nbsp;</td>
                        </tr>
                        <tr>
                            <td align="center" valign="top"
                                style="border-collapse:collapse;font-family:Helvetica,arial,sans-serif;font-size:13px;line-height:20px;color:#8a8a8a;">
                                <a style="text-decoration:underline;color:#8a8a8a;white-space:nowrap" href="${urlGenerator.generate(
                                  FrontendRoute.NOTIFICATION_SETTINGS
                                )}">Unsubscribe</a>
                            </td>
                        </tr>
                        <tr>
                            <td height="20" style="border-collapse:collapse;line-height:20px;font-size:20px">&nbsp;</td>
                        </tr>
                        <tr>
                            <td align="center" valign="top"
                                style="border-collapse:collapse;font-family:Helvetica,arial,sans-serif;font-size:13px;line-height:20px;color:#8a8a8a;">
                                You received this email because you are registered on<span>&nbsp;</span><span>Planner</span><span>&nbsp;</span>with the&nbsp;email
                                address:<span>&nbsp;</span>${recipientEmail}.
                            </td>
                        </tr>
                        <tr>
                            <td align="left" height="10" valign="top" style="border-collapse:collapse;font-size:1px;line-height:1px">
                                &nbsp;
                            </td>
                        </tr>
                        <tr>
                            <td align="center" valign="top"
                                style="border-collapse:collapse;font-family:Helvetica,arial,sans-serif;font-size:13px;line-height:20px;color:#8a8a8a;">
                                © ${new Date().getFullYear()}&nbsp;TimeCamp&nbsp;Inc. 440&nbsp;N&nbsp;Barranca&nbsp;Ave&nbsp;#4967&nbsp;Covina,&nbsp;California&nbsp;91723&nbsp;United&nbsp;States
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>`;
