const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SG_MAIL_KEY);

let subject, title, text1, text2, link,linkText;
const sendEmail = (reciver, msg, token) => {
    if (msg == 'confirmation') {
        subject = 'Cuenta creada exitosamente';
        title = 'Cuenta creada exitosamente'
        text1 = 'Estimado usuario, su cuenta ha sido creada exitosamente y sera verificada por uno de nuestros administradores.';
        text2 ='Una vez la cuenta sea verificada se le notificara via Email.';
        link = 'http://localhost:3000/';
        linkText = 'Ir a Fireno Tools'
    };
    if (msg == 'resetPassword') {
        subject = 'Reestablecer contrasena';
        title = 'Reestablecer contrasena'
        text1 = `Estimado usuario, se solicito un reestablecimiento de contrasena para tu cuenta ${reciver}.`;
        text2 =`Por favor, has click en el boton que aparece a continuacion para cambiar tu contrasena.`;
        link = `http://localhost:3000/auth/resetPassword/${token}`;
        linkText = 'Cambiar contrasena'
    };


    const msgData = {
        to: reciver, 
        from: 'practicante@fireno.com', 
        subject: subject,
        html: `
        <head>
            <title>${title}</title>
            <meta content="text/html; charset=utf-8" http-equiv="Content-Type">
            <meta content="width=device-width" name="viewport">
            <style type="text/css">
                @font-face {
                    font-family: &#x27;Postmates Std&#x27;;
                    font-weight: 600;
                    font-style: normal;
                    src: local(&#x27;Postmates Std Bold&#x27;), url(https://s3-us-west-1.amazonaws.com/buyer-static.postmates.com/assets/email/postmates-std-bold.woff) format(&#x27;woff&#x27;);
                }
        
                @font-face {
                    font-family: &#x27;Postmates Std&#x27;;
                    font-weight: 500;
                    font-style: normal;
                    src: local(&#x27;Postmates Std Medium&#x27;), url(https://s3-us-west-1.amazonaws.com/buyer-static.postmates.com/assets/email/postmates-std-medium.woff) format(&#x27;woff&#x27;);
                }
        
                @font-face {
                    font-family: &#x27;Postmates Std&#x27;;
                    font-weight: 400;
                    font-style: normal;
                    src: local(&#x27;Postmates Std Regular&#x27;), url(https://s3-us-west-1.amazonaws.com/buyer-static.postmates.com/assets/email/postmates-std-regular.woff) format(&#x27;woff&#x27;);
                }
            </style>
            <style media="screen and (max-width: 680px)">
                    @media screen and (max-width: 680px) {
                        .page-center {
                          padding-left: 0 !important;
                          padding-right: 0 !important;
                        }  
                        .footer-center {
                          padding-left: 20px !important;
                          padding-right: 20px !important;
                        }
                    }
            </style>
        </head>
        <body style="background-color: #f4f4f5;">
            <table cellpadding="0" cellspacing="0" style="width: 100%; height: 100%; background-color: #f4f4f5; text-align: center;">
                <tbody>
                    <tr>
                        <td style="text-align: center;">
                            <table align="center" cellpadding="0" cellspacing="0" id="body" style="background-color: #fff; width: 100%; max-width: 680px; height: 100%;">
                                <tbody>
                                    <tr>
                                        <td>
                                            <table align="center" cellpadding="0" cellspacing="0" class="page-center" style="text-align: left; padding-bottom: 88px; width: 100%; padding-left: 120px; padding-right: 120px;">
                                                <tbody>
                                                    <tr>
                                                        <td style="padding-top: 24px;">
                                                            <img src="https://anraci.org/wp-content/uploads/2021/03/Fireno-Positivo.jpg" style="width: 100px;">
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td colspan="2" style="padding-top: 72px; -ms-text-size-adjust: 100%; -webkit-font-smoothing: antialiased; -webkit-text-size-adjust: 100%; color: #000000; font-family: 'Postmates Std', 'Helvetica', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; font-size: 48px; font-smoothing: always; font-style: normal; font-weight: 600; letter-spacing: -2.6px; line-height: 52px; mso-line-height-rule: exactly; text-decoration: none;">
                                                        
                                                        ${title}
                                                        
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td style="padding-top: 48px; padding-bottom: 48px;">
                                                            <table cellpadding="0" cellspacing="0" style="width: 100%">
                                                                <tbody>
                                                                    <tr>
                                                                        <td style="width: 100%; height: 1px; max-height: 1px; background-color: #d9dbe0; opacity: 0.81"></td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td style="-ms-text-size-adjust: 100%; -ms-text-size-adjust: 100%; -webkit-font-smoothing: antialiased; -webkit-text-size-adjust: 100%; color: #9095a2; font-family: 'Postmates Std', 'Helvetica', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; font-size: 16px; font-smoothing: always; font-style: normal; font-weight: 400; letter-spacing: -0.18px; line-height: 24px; mso-line-height-rule: exactly; text-decoration: none; vertical-align: top; width: 100%;">
                                                        
                                                            ${text1}
                                                        
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td style="padding-top: 24px; -ms-text-size-adjust: 100%; -ms-text-size-adjust: 100%; -webkit-font-smoothing: antialiased; -webkit-text-size-adjust: 100%; color: #9095a2; font-family: 'Postmates Std', 'Helvetica', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; font-size: 16px; font-smoothing: always; font-style: normal; font-weight: 400; letter-spacing: -0.18px; line-height: 24px; mso-line-height-rule: exactly; text-decoration: none; vertical-align: top; width: 100%;">

                                                            ${text2}
                                                        
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <a data-click-track-id="37" href=${link} style="margin-top: 36px; -ms-text-size-adjust: 100%; -ms-text-size-adjust: 100%; -webkit-font-smoothing: antialiased; -webkit-text-size-adjust: 100%; color: #ffffff; font-family: 'Postmates Std', 'Helvetica', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; font-size: 12px; font-smoothing: always; font-style: normal; font-weight: 600; letter-spacing: 0.7px; line-height: 48px; mso-line-height-rule: exactly; text-decoration: none; vertical-align: top; width: 220px; background-color: #CF1B1B; border-radius: 28px; display: block; text-align: center; text-transform: uppercase" target="_blank">
    
                                                                ${linkText}
    
                                                            </a>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                </tbody>
            </table>
        </body>`,
      }
      sgMail
        .send(msgData)
        .then(() => {
          console.log('Email sent')
        })
        .catch((error) => {
          console.error(error)
        });
};
module.exports = {sendEmail};