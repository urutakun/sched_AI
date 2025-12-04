<!DOCTYPE html>
<html lang="en">
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      min-height: 60vh;
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 0;
      padding: 20px;
      background: #f4f4f4;
    }

    .wrapper {
      border: 1px solid #d4d4d4;
      max-width: 300px;
      padding: 30px;
      border-radius: 20px;
      text-align: center;
      margin: 0 auto;
      background: #fff;
    }

    .header {
      margin-bottom: 30px;
    }

    .header span {
      display: block;
      margin-top: 10px;
      font-size: 1.7rem;
    }

    .creds {
      margin: 20px 0;
      list-style: none;
      padding-left: 0;
      text-align: left;
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
            <img src="https://i.ibb.co/N69JsRV9/logo.png" width="60" height="60" alt="logo" style="display:block; margin:0 auto;">
          </td>
        </tr>
      </table>

      <span><strong>Welcome to SchedAI 🎉</strong></span>
    </div>

    <p>Hello {{ $first_name }},</p>

    <p>Your account has been created. Here are your login credentials:</p>

    <ul class="creds">
      <li><strong>Email:</strong> {{ $email }}</li>
      <li><strong>Password:</strong> {{ $password }}</li>
    </ul>

    <p>Please log in and change your password immediately.</p>
  </div>
</body>
</html>
