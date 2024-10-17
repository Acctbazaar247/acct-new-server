import config from '../config';
import sendEmail from '../helpers/sendEmail';

const genericEmailTemplate = async ({
  email,
  subject,
  title,
  description,
}: {
  email: string;
  subject: string;
  title: string;
  description: string;
}) => {
  await sendEmail(
    { to: email },
    {
      subject: subject,
      html: `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA==" crossorigin="anonymous" referrerpolicy="no-referrer" />
    <style>
        body {
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
            color: #000 !important;
            font-family: Arial, sans-serif;
        }

        .email-box {
            background-color: white;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            padding: 20px;
            max-width: 400px;
            width: 100%;
            margin: 0 auto;
        }

        /* Adjust styles for mobile screens */
        @media (max-width: 768px) {
            .email-box {
                max-width: 300px; 
            }
        }

        .title, p {
            text-align: center;
        }

        .box-row {
            background-color: #f0f0f0;
            padding: 10px;
            border-radius: 10px;
            margin-top: 20px;
        }

        .account-name {
            font-weight: 700;
            font-size: 20px;
            padding-bottom: 10px;
        }

        .social-icons {
            text-align: center;
            margin: 20px 0; 
            color: white;
        }

        .social-icons span {
            margin: 0 10px; 
            display: inline-block;
            background-color: rgb(255, 85, 0);
            width: 30px; 
            height: 30px; 
            border-radius: 50%; 
            padding: 10px;
            text-align: center; 
            line-height: 30px; 
        }

        .social-icons span a {
            color: #fff;
            text-decoration: none;
            font-size: 16px; 
        }


        .social-icons span a{
            color: #fff;
            text-decoration: none;
        }

        .btn {
            display: block;
            width: fit-content;
            padding: 12px 40px;
            margin: 30px auto;
            background-color: transparent;
            color: rgb(255, 85, 0);
            border-radius: 10px;
            outline: none;
            border: 1px solid rgb(255, 85, 0);
            text-decoration: none;
        }
        
        .end {
            font-size: 14px;
            color: grey !important;
            padding-top: 20px;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="email-box">
            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="table-layout: fixed;">
                <tr>
                    <td style="text-align: center;">
                        <img src="assets/img/logo.png" width="50" height="50" alt="" style="vertical-align: middle; margin-right: -15px;">
                        <h3 style="display: inline; margin: 0; padding-left: 10px;">Acctbazaar</h3>
                    </td>
                </tr>
            </table>
            <h2 class="title">${title}</h2>
            <p>${description}</p>
            <div class="email-box-content">
                <a href="${config.frontendUrl}" class="btn">View</a>
                <p class="end">
                    This is an automatically generated email please do not reply to this email. 
                    If you face any issues, please contact us at support@acctbazaar.com
                </p>
                <hr>
                <div class="social-icons">
                    <span><a href="https://www.instagram.com/acctbazaar/"><i class="fa-brands fa-instagram"></i></a></span>
                    <span><a href="https://twitter.com/AcctBazaar"><i class="fa-brands fa-twitter"></i></a></span>
                    <span><a href="https://www.tiktok.com/@acctbazaar"><i class="fa-brands fa-tiktok"></i></a></span>
                    <span><a href="https://t.me/acctbazaarchannel"><i class="fa-brands fa-telegram"></i></a></span>
                </div>
                <p class="end">Copyright &copy; 2024 Acctbazaar Ltd.</p>
            </div>
        </div>
    </div>
</body>
</html>
    
    
    `,
    }
  );
};
export default genericEmailTemplate;
