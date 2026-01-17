const generateFirstTrialExpireMail = (userName: string, workspaceName: string) => ({
  subject: "TimeCamp Planner - You're already halfway there",
  content: `
  <!doctype html>
  <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml"
      xmlns:o="urn:schemas-microsoft-com:office:office">
  
  <head>
      <title></title>
      <!--[if !mso]><!-- -->
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <!--<![endif]-->
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
      <meta name="viewport" content="width=device-width,initial-scale=1">
      <style type="text/css">
          #outlook a {
              padding: 0;
          }
  
          .ReadMsgBody {
              width: 100%;
          }
  
          .ExternalClass {
              width: 100%;
          }
  
          .ExternalClass * {
              line-height: 100%;
          }
  
          body {
              margin: 0;
              padding: 0;
              -webkit-text-size-adjust: 100%;
              -ms-text-size-adjust: 100%;
          }
  
          table,
          td {
              border-collapse: collapse;
              mso-table-lspace: 0pt;
              mso-table-rspace: 0pt;
          }
  
          img {
              border: 0;
              height: auto;
              line-height: 100%;
              outline: none;
              text-decoration: none;
              -ms-interpolation-mode: bicubic;
          }
  
          p {
              display: block;
              margin: 13px 0;
          }
      </style>
      <!--[if !mso]><!-->
      <style type="text/css">
          @media only screen and (max-width:480px) {
              @-ms-viewport {
                  width: 320px;
              }
  
              @viewport {
                  width: 320px;
              }
          }
      </style>
      <!--<![endif]-->
      <!--[if mso]>
    <xml>
    <o:OfficeDocumentSettings>
      <o:AllowPNG/>
      <o:PixelsPerInch>96</o:PixelsPerInch>
    </o:OfficeDocumentSettings>
    </xml>
    <![endif]-->
      <!--[if lte mso 11]>
    <style type="text/css">
      .outlook-group-fix { width:100% !important; }
    </style>
    <![endif]-->
      <!--[if !mso]><!-->
      <link href="https://fonts.googleapis.com/css?family=Poppins, Roboto, sans-serif:400,700" rel="stylesheet"
          type="text/css">
      <style type="text/css">
          @import url(https://fonts.googleapis.com/css?family=Poppins, Roboto, sans-serif:400,700);
      </style>
      <!--<![endif]-->
      <style type="text/css">
          @media only screen and (min-width:480px) {
              .mj-column-per-100 {
                  width: 100% !important;
                  max-width: 100%;
              }
          }
      </style>
      <style type="text/css">
          @media only screen and (max-width:480px) {
              table.full-width-mobile {
                  width: 100% !important;
              }
  
              td.full-width-mobile {
                  width: auto !important;
              }
          }
      </style>
      <style type="text/css">
          body {
              padding: 10px;
              background-color: white;
          }
  
          .content {
              background-color: #f8f9f9;
          }
  
          ul {
              list-style: none;
          }
  
          li::before {
              content: "";
              background-color: #814076;
              display: inline-block;
              width: 10px;
              height: 10px;
              border-radius: 50%;
              margin-right: 10px;
          }
  
          @media (min-width: 480px) {
              body {
                  padding: 30px;
              }
          }
      </style>
  </head>
  
  <body>
      <div>
          <!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
          <div style="Margin:0px auto;max-width:600px;">
              <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
                  <tbody>
                      <tr>
                          <td style="direction:ltr;font-size:0px;text-align:center;vertical-align:top;">
                              <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:600px;" ><![endif]-->
                              <div class="mj-column-per-100 outlook-group-fix"
                                  style="font-size:13px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                                  <table border="0" cellpadding="0" cellspacing="0" role="presentation"
                                      style="vertical-align:top;" width="100%">
                                      <tr>
                                          <td align="center" style="font-size:0px;word-break:break-word;">
                                              <table border="0" cellpadding="0" cellspacing="0" role="presentation"
                                                  style="border-collapse:collapse;border-spacing:0px;">
                                                  <tbody>
                                                      <tr>
                                                          <td><img height="auto"
                                                                  src="https://tc3-img-dev.s3.eu-central-1.amazonaws.com/db7fe93bfbe3424e0417dc8c473876bca71ce04d1f00b067f32d06944c6f7b40"
                                                                  style="border:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;"
                                                                  ></td>
                                                      </tr>
                                                  </tbody>
                                              </table>
                                          </td>
                                      </tr>
                                  </table>
                              </div>
                              <!--[if mso | IE]></td></tr></table><![endif]-->
                          </td>
                      </tr>
                  </tbody>
              </table>
          </div>
          <!--[if mso | IE]></td></tr></table><table align="center" border="0" cellpadding="0" cellspacing="0" class="content-outlook" style="width:600px;" width="600" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
          <div class="content" style="Margin:0px auto;max-width:600px;">
              <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
                  <tbody>
                      <tr>
                          <td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;vertical-align:top;">
                              <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:600px;" ><![endif]-->
                              <div class="mj-column-per-100 outlook-group-fix"
                                  style="font-size:13px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                                  <table border="0" cellpadding="0" cellspacing="0" role="presentation"
                                      style="vertical-align:top;" width="100%">
                                      <tr>
                                          <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                              <div
                                                  style="font-family:Poppins, Roboto, sans-serif;font-size:13px;font-weight:700;line-height:20px;text-align:left;color:#212035;">
                                                  Hi ${userName.trim()},</div>
                                          </td>
                                      </tr>
                                      <tr>
                                          <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                              <div
                                                  style="font-family:Poppins, Roboto, sans-serif;font-size:13px;line-height:20px;text-align:left;color:#212035;">
                                                  You are in the middle of your free trial and you can test TimeCamp Planner Premium for one more week in ${workspaceName} workspace</div>
                                          </td>
                                      </tr>
                                      <tr>
                                          <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                              <div
                                                  style="font-family:Poppins, Roboto, sans-serif;font-size:13px;line-height:20px;text-align:left;color:#212035;">
                                                  I hope that you’ve checked all TimeCamp Planner Premium features and they helped you improve your task management and communications.</div>
                                          </td>
                                      </tr>
                                      <tr>
                                          <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                              <div
                                                  style="font-family:Poppins, Roboto, sans-serif;font-size:13px;line-height:20px;text-align:left;color:#212035;">
                                                  If you have not switched on all add-ons yet, I’ll show you how to do it.
                                              </div>
                                          </td>
                                      </tr>
                                      <tr>
                                          <td align="center" style="font-size:0px;word-break:break-word;">
                                          <table border="0" cellpadding="0" cellspacing="0" role="presentation"
                                              style="border-collapse:collapse;border-spacing:0px;">
                                              <tbody>
                                                  <tr>
                                                      <td><img height="auto"
                                                              src="https://tc3-img-dev.s3.eu-central-1.amazonaws.com/263d000d6235298f8fa4836490b3f2d4ffaf9484a4dd1af23de278b01d5d7b7d"
                                                              style="border:0;display:block;outline:none;text-decoration:none;height:auto;width:400px;"
                                                              width="400px"></td>
                                                  </tr>
                                              </tbody>
                                          </table>
                                      </td>
                                      </tr>
                                      <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                      <div
                                          style="font-family:Poppins, Roboto, sans-serif;font-size:13px;line-height:20px;text-align:left;color:#212035;">
                                          If you still don’t know how to implement TimeCamp Planner - we’ll be happy to help.
                                      </div>
                                  </td>
                                      <tr>
                                          <td align="center" vertical-align="middle"
                                              style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                              <table border="0" cellpadding="0" cellspacing="0" role="presentation"
                                                  style="border-collapse:separate;line-height:100%;">
                                                  <tr>
                                                      <td align="center"
                                                          bgcolor="linear-gradient(101deg, rgba(224, 37, 242, 0.54), #bd10e0);"
                                                          role="presentation"
                                                          style="border:none;border-radius:3px;cursor:auto;padding:10px 25px;background: #2b265c;"
                                                          valign="middle"><a href=https://calendly.com/m-piotrowiak/30min
                                                              style="color:#ffffff;font-family:Poppins, Roboto, sans-serif;font-size:13px;font-weight:normal;line-height:20px;Margin:0;text-decoration:none;text-transform:none;"
                                                              target="_blank">Book a demo</a></td>
                                                  </tr>
                                              </table>
                                          </td>
                                      </tr>
                                      <tr>
                                          <td align="left"
                                              style="font-size:0px;padding:10px 25px;padding-bottom:0;word-break:break-word;">
                                              <div
                                                  style="font-family:Poppins, Roboto, sans-serif;font-size:13px;line-height:20px;text-align:left;color:#212035;">
                                                  Have a great day.</div>
                                          </td>
                                      </tr>
                                      <tr>
                                          <td align="left"
                                              style="font-size:0px;padding:10px 25px;padding-top:0;word-break:break-word;">
                                              <div
                                                  style="font-family:Poppins, Roboto, sans-serif;font-size:13px;line-height:20px;text-align:left;color:#212035;">
                                                  Cheers, Kamil :)</div>
                                          </td>
                                      </tr>
                                  </table>
                              </div>
                              <!--[if mso | IE]></td></tr></table><![endif]-->
                          </td>
                      </tr>
                  </tbody>
              </table>
          </div>
          <!--[if mso | IE]></td></tr></table><![endif]-->
      </div>
  </body>
  
  </html>
  `,
});

export default generateFirstTrialExpireMail;
