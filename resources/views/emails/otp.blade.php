<!DOCTYPE html>
<html lang="en">
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 20px;
      background: #f4f4f4;
    }

    .wrapper {
      background: #fff;
      border: 1px solid #d4d4d4;
      max-width: 300px;
      padding: 30px;
      border-radius: 20px;
      text-align: center;
      margin: 0 auto;
    }

    .header span {
      display: block;
      margin-top: 10px;
      font-size: 22px;
      font-weight: bold;
    }

    .otp {
      font-weight: bold;
      font-size: 1.7rem;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">

      <!-- Email-safe centered logo -->
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 0 auto; text-align: center;">
        <tr>
          <td align="center">
            <img src="https://i.ibb.co/N69JsRV9/logo.png" width="50" height="50" alt="logo" style="display:block; margin:0 auto;">
          </td>
        </tr>
      </table>

      <span>Password Reset</span>
    </div>

    <p>Your OTP for password reset is:</p>
    <span class="otp">{{ $otp }}</span>
    <p>This token will expire in 10 minutes.</p>
  </div>
</body>
</html>
