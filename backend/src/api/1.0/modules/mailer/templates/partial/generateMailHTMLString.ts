import { FrontendRoute } from '../../../../../../config/frontendRoutes.config';
import { UrlGeneratorInterface } from '../../../common/UrlGenerator';

type MailHTMLGeneratorConfig = {
  content: string;
  recipient: string;
  mapsUrl?: string;
  urlGenerator: UrlGeneratorInterface;
  showSubscriptionMention?: boolean;
};

const generateMailHTMLString = ({
  content,
  recipient,
  urlGenerator,
  showSubscriptionMention,
}: MailHTMLGeneratorConfig): string => `
<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>TimeCamp</title>
    <style type="text/css">
        /* -------------------------------------
            GLOBAL RESETS
        ------------------------------------- */
        img {
            border: none;
            -ms-interpolation-mode: bicubic;
            max-width: 100%; }

        body {
            background-color: #f3f3f4;
            -webkit-font-smoothing: antialiased;
            line-height: 1.6em;
            margin: 0;
            padding: 0;
            -ms-text-size-adjust: 100%;
            -webkit-font-smoothing: antialiased;
            -webkit-text-shadow: rgba(0,0,0,.01) 0 0 1px;
            font-size: 16px;
            font-weight: 200;
            font-family:Poppins,system,-apple-system,-webkit-system-font,SFNSText,sans-serif;"
        -webkit-text-size-adjust: 100%; }

        table {
            border-collapse: separate;
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
            width: 100%;}
        table td {
            font-family:Poppins,system,-apple-system,-webkit-system-font,SFNSText,sans-serif;"
        font-size: 16px;
            vertical-align: top; }

        /* -------------------------------------
            BODY & CONTAINER
        ------------------------------------- */

        .body {
            width: 100%; }

        /* Set a max-width, and make it display as block so it will automatically stretch to that width, but will also shrink down on a phone or something */
        .container {
            display: block;
            margin: 0 auto !important;
            /* makes it centered */
            max-width: 600px;
            padding: 10px;
            width: 600px; }

        /* This should also be a block element, so that it will fill 100% of the .container */
        .content {
            box-sizing: border-box;
            display: block;
            margin: 0 auto;
            max-width: 600px;
            padding: 10px; }

        /* -------------------------------------
            HEADER, FOOTER, MAIN
        ------------------------------------- */
        .main {
            background: #fff;
            border-radius: 2px;
            box-shadow: 0px 1px 4px rgba(0, 0, 0, .25);
            width: 100%; }

        .wrapper {
            box-sizing: border-box;
         }

        .footer {
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
            text-align: center; }

        /* -------------------------------------
            TYPOGRAPHY
        ------------------------------------- */
        h1,
        h2,
        h3,
        h4 {
            font-family:Poppins,system,-apple-system,-webkit-system-font,SFNSText,sans-serif;"
        font-weight: 400;
            line-height: 1.6em;
            margin: 0;
            margin-bottom: 5px; }

        h1 {
            font-size: 35px;
            text-align: center;
            text-transform: capitalize; }
        h2 {
            margin-top: 30px;
        }
        h3 {
            margin-bottom: 5px;
        }

        p,
        ul,
        ol {
            font-family:Poppins,system,-apple-system,-webkit-system-font,SFNSText,sans-serif;"
        color: #53585F;
            line-height: 1.6em;
            font-size: 17px;
            font-weight: normal;
            margin: 0;
            margin-bottom: 15px; }
        p li,
        ul li,
        ol li {
            list-style-position: inside;
            margin-left: 5px; }

        a {
            color: #009A59;
            text-decoration: underline; }

        .support-bottom {
            max-width: 230px; float: right; margin-left: 20px; top: 24px; position: relative;
        }

        /* -------------------------------------
            BUTTONS
        ------------------------------------- */
        .btn {
            box-sizing: border-box;
            width: 100%; }
        .btn > tbody > tr > td {
            padding-bottom: 15px; }
        .btn table {
            width: auto; }
        .btn table td {
            background-color: #ffffff;
            border-radius: 5px;
            text-align: center; }
        .btn a {
            background-color: #ffffff;
            border-radius: 2px;
            box-sizing: border-box;
            color: #3498db;
            cursor: pointer;
            display: inline-block;
            font-size: 16px;
            font-weight: bold;
            margin: 0;
            padding: 12px 25px;
            text-decoration: none;
            text-transform: uppercase; }

        .btn-primary table td {
            background-color: #009A59; }

        .btn-primary a {
            background-color: #009A59;
            color: white;
        }



        /* -------------------------------------
            OTHER STYLES THAT MIGHT BE USEFUL
        ------------------------------------- */
        .invisible-link {
            color: #009A59;
        }

        .standard-margins {
            margin-top: 30px;
            margin-bottom: 20px;
        }

        .last {
            margin-bottom: 0; }

        .first {
            margin-top: 0; }

        .align-center {
            text-align: center; }

        .align-right {
            text-align: right; }

        .align-left {
            text-align: left; }

        .clear {
            clear: both; }

        .mt0 {
            margin-top: 0; }

        .mb0 {
            margin-bottom: 0; }

        p {
            color: #53585f;
        }

        .badge {
            font-size: 0.6em;
            color: #777777;
            border: 1px solid #777777;
            display: inline-block;
            padding: 3px;
            border-radius: 3px;
            margin: 0px;
            line-height: 1em;
            font-weight: normal;
            position: relative;
            top: -2px;
        }

        .preheader {
            color: transparent;
            display: none;
            height: 0;
            max-height: 0;
            max-width: 0;
            opacity: 0;
            overflow: hidden;
            mso-hide: all;
            visibility: hidden;
            width: 0; }

        .powered-by a {
            text-decoration: none; }

        hr {
            border: 0;
            border-bottom: 1px solid #e9e9e9;
            margin: 20px 0; }

        /* -------------------------------------
            RESPONSIVE AND MOBILE FRIENDLY STYLES
        ------------------------------------- */
        @media only screen and (max-width: 620px) {
            table[class=body] h1 {
                font-size: 28px !important;
                margin-bottom: 10px !important; }
            table[class=body] p,
            table[class=body] ul,
            table[class=body] ol,
            table[class=body] td,
            table[class=body] span,
            table[class=body] a {
            }
            table[class=body] .wrapper,
            table[class=body] .article {
                padding: 10px !important; }
            table[class=body] .content {
                padding: 0 !important; }
            table[class=body] .container {
                padding: 0 !important;
                width: 100% !important; }
            table[class=body] .main {
                border-left-width: 0 !important;
                border-radius: 0 !important;
                box-shadow: none !important;
                border-right-width: 0 !important; }
            table[class=body] .btn table {
                width: 100% !important; }
            table[class=body] .btn a {
                width: 100% !important; }
            table[class=body] .img-responsive {
                height: auto !important;
                max-width: 100% !important;
                width: auto !important; }}

        /* -------------------------------------
            PRESERVE THESE STYLES IN THE HEAD
        ------------------------------------- */
        @media all {
            .ExternalClass {
                width: 100%; }
            .ExternalClass,
            .ExternalClass p,
            .ExternalClass span,
            .ExternalClass font,
            .ExternalClass td,
            .ExternalClass div {
                line-height: 100%; }
            .apple-link a {
                color: inherit !important;
                font-family: inherit !important;
                font-size: inherit !important;
                font-weight: inherit !important;
                line-height: inherit !important;
                text-decoration: none !important; }
            .btn-primary table td:hover {
                text-decoration: underline;
            }
            .btn-primary a:hover {
                text-decoration: underline;
            }
            a:hover {
                text-decoration: none;
            }
        }
    </style>
</head>
<body class=""
      style="-webkit-font-smoothing:antialiased;line-height:1.6em;margin:0;padding:0;-ms-text-size-adjust:100%;-webkit-font-smoothing:antialiased;-webkit-text-shadow:rgba(0,0,0,.01) 0 0 1px;font-size:16px;font-weight:200;font-family:Poppins,system,-apple-system,-webkit-system-font,SFNSText,sans-serif;">
<table border="0" cellpadding="0" cellspacing="0" class="body"
       style="border-collapse:separate;mso-table-lspace:0pt;mso-table-rspace:0pt;width:100%;">
    <tr>
        <td style="font-family:Poppins,system,-apple-system,-webkit-system-font,SFNSText,sans-serif;vertical-align:top;">
            &nbsp;
        </td>
        <td class="container"
            style="font-family:Poppins,system,-apple-system,-webkit-system-font,SFNSText,sans-serif;vertical-align:top;display:block;max-width:600px;padding:10px;width:100%;margin:0 auto !important;">
            <div class="content"
                 style="box-sizing:border-box;display:block;margin:0 auto;max-width:600px;padding:10px;">
                <!-- START CENTERED WHITE CONTAINER -->
                <span class="preheader"
                      style="color:transparent;display:none;height:0;max-height:0;max-width:0;opacity:0;overflow:hidden;mso-hide:all;visibility:hidden;width:0;"></span>
                <table class="main"
                       style="border-collapse:separate;mso-table-lspace:0pt;mso-table-rspace:0pt;background:#ffffff;border-radius:2px;box-shadow:0px 1px 4px rgba(0, 0, 0, .25);width:100%;">
                    <!-- START MAIN CONTENT AREA -->
                    <tr>
                        <td class="wrapper"
                            style="font-family:Poppins,system,-apple-system,-webkit-system-font,SFNSText,sans-serif;vertical-align:top;box-sizing:border-box;">
                            <table border="0" cellpadding="0" cellspacing="0"
                                   style="border-collapse:separate;mso-table-lspace:0pt;mso-table-rspace:0pt;width:100%;">
                                <tr>
                                    <td align="left"
                                        style="font-family:Poppins,system,-apple-system,-webkit-system-font,SFNSText,sans-serif;vertical-align:top;">
                                        <p style="font-family:Poppins,system,-apple-system,-webkit-system-font,SFNSText,sans-serif;line-height:1.6em;font-size:17px;font-weight:normal;margin:0;margin-bottom:15px;color:#53585f;">
                                            <a href="${urlGenerator.generate(FrontendRoute.HOME)}"
                                               style="color:#009A59;text-decoration:underline;">
                                               <img alt="TimeCamp Planner logo" height="auto" src="https://tc3-img-dev.s3.eu-central-1.amazonaws.com/b4f2ecdeae3854272f228c0dcffd285b8b40d0dbd1575c81e245679f0a4c040e" style="border:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;">
                                               </a>

                                        </p>

                                        <!-- CONTENT -->
                                        <!--<?php $this->printBlock('content'); ?>-->
                                        ${content}
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <!-- END MAIN CONTENT AREA -->
                </table>
                <!-- FOOTER -->
                <!--<?php include __DIR__ .'/footer.php'; ?>-->
                <div class="footer" style="clear:both;padding-top:10px;text-align:center;width:100%;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" align="center"
                           style="border-collapse:collapse">
                        <tbody>
      

                        <tr>
                            <td align="left" height="70" valign="top" style="border-collapse:collapse;font-size:1px;line-height:1px">
                                &nbsp;
                            </td>
                        </tr>

                        ${
  showSubscriptionMention
    ? `<tr>
                              <td align="center" valign="top"
                                  style="border-collapse:collapse;font-family:Helvetica,arial,sans-serif;font-size:13px;line-height:20px;color:rgb(127,127,127);">
                                  You received this email because you are registered on<span>&nbsp;</span><span>TimeCamp Planner</span> <span>&nbsp;</span>with the&nbsp;email
                                  address:<span>&nbsp;</span><span>${recipient}</span>.
                              </td>
                          </tr>
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
                          `
    : ''
}

                        <tr>
                            <td align="center"
                                style="border-collapse:collapse;font-family:Helvetica,arial,sans-serif;font-size:13px;line-height:20px;color:rgb(127,127,127);vertical-align:bottom">
                                © ${new Date().getFullYear()}&nbsp;TimeCamp Planner,&nbsp;Inc.<span>&nbsp;</span>
                                <span>440</span>&nbsp;<span>N</span>&nbsp;<span>Barranca</span>&nbsp;<span>Ave</span>&nbsp;<span>#4967</span>&nbsp;<span>Covina,</span><span>&nbsp;</span><span>California</span>&nbsp;<span>91723&nbsp;United&nbsp;States</span>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <!-- END CENTERED WHITE CONTAINER -->
            </div>
        </td>
        <td style="font-family:Poppins,system,-apple-system,-webkit-system-font,SFNSText,sans-serif;vertical-align:top;">
            &nbsp;
        </td>
    </tr>
</table>
</body>
</html>
`;

export default generateMailHTMLString;
