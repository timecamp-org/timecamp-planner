import { colors } from '../css';

type ButtonConfig = {
  buttonCaption: string;
  buttonUrl: string;
  buttonColor?: string;
};

const generateCTAButtonHTML = ({
  buttonCaption,
  buttonUrl,
  buttonColor = colors.buttonColor,
}: ButtonConfig): string => {
  return `
        <table border="0" cellpadding="0" cellspacing="0" class="btn btn-primary standard-margins" align="center"
       style="border-collapse:separate;mso-table-lspace:0pt;mso-table-rspace:0pt;box-sizing:border-box;width:100%;margin-top:30px;margin-bottom:20px;">
    <tbody>
    <tr>
        <td align="left"
            style="font-family:Poppins,system,-apple-system,-webkit-system-font,SFNSText,sans-serif;vertical-align:top;padding-bottom:15px;">
            <table border="0" cellpadding="0" cellspacing="0" align="center"
                   style="border-collapse:separate;mso-table-lspace:0pt;mso-table-rspace:0pt;width:100%;width:auto;">
                <tbody>
                <tr>
                    <td style="font-family:Poppins,system,-apple-system,-webkit-system-font,SFNSText,sans-serif;vertical-align:top;background-color:#ffffff;border-radius:100px;text-align:center;background-color:${buttonColor};">
                        <a href="${buttonUrl}" target="_blank"
                           style="color:${buttonColor};text-decoration:underline;background-color:#ffffff;border-radius:999px;box-sizing:border-box;color:#3498db;cursor:pointer;display:inline-block;font-size:16px;font-weight:bold;margin:0;padding:12px 25px;text-decoration:none;background-color:${buttonColor};color:white;">${buttonCaption}</a></td>
                </tr>
                </tbody>
            </table>
        </td>
    </tr>
    </tbody>
</table>
    `;
};

export default generateCTAButtonHTML;
