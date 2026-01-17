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
            color: #888888;
            font-size: 11px !important;
            text-align: center; }`;

export const generateMailFooter = ({
  recipientEmail,
  urlGenerator,
}: MailFooterGeneratorConfig): string => `<div class="footer" style="clear:both;padding-top:10px;text-align:center;width:100%;">
                    <table width="550" cellpadding="0" cellspacing="0" border="0" align="center"
                           style="border-collapse:collapse">
                        <tbody>
                        <tr>
                            <td height="20" style="border-collapse:collapse;line-height:20px;font-size:20px">&nbsp;</td>
                        </tr>
                        <tr>
                            <td align="center" valign="top"
                                style="border-collapse:collapse;font-family:Helvetica,arial,sans-serif;font-size:13px;line-height:20px;color:rgb(153,153,153);">
                                <a style="text-decoration:underline;color:rgb(153,153,153);white-space:nowrap" href="${urlGenerator.generate(
                                  FrontendRoute.NOTIFICATION_SETTINGS
                                )}">Unsubscribe</a>
                            </td>
                        </tr>
                        <tr>
                            <td height="20" style="border-collapse:collapse;line-height:20px;font-size:20px">&nbsp;</td>
                        </tr>
                        <tr>
                            <td align="center" valign="top"
                                style="border-collapse:collapse;font-family:Helvetica,arial,sans-serif;font-size:13px;line-height:20px;color:rgb(127,127,127);">
                                You received this email because you are registered on<span>&nbsp;</span><span>TimeCamp Planner</span><span>&nbsp;</span>with the&nbsp;email
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
                                style="border-collapse:collapse;font-family:Helvetica,arial,sans-serif;font-size:13px;line-height:20px;color:rgb(127,127,127);">
                                © ${new Date().getFullYear()}&nbsp;TimeCamp Planner,&nbsp;Inc.<span>&nbsp;</span>
                                440&nbsp;N&nbsp;Barranca&nbsp;Ave&nbsp;#4967&nbsp;Covina,<span>&nbsp;</span><span>California&nbsp;United&nbsp;States</span>
                            </td>
                        </tr>
                        <tr>
                            <td align="left" height="70" valign="top" style="border-collapse:collapse;font-size:1px;line-height:1px">
                                &nbsp;
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>`;
