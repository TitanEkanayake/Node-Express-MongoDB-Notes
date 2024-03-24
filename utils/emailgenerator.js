const nodemailer = require("nodemailer");

const sendResetPasswordEmail = (email, resetToken) => {
  return new Promise((resolve, reject) => {
    const myEmail = process.env.EMAIL_ADDRESS;
    const myPassword = process.env.EMAIL_PASSWORD;

    // Create a transporter object
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: myEmail,
        pass: myPassword,
      },
    });

    // Email content
    const mailOptions = {
      to: email,
      from: myEmail,
      subject: `Password Reset Request fo Notes Application`,
      text: `Hello User,

We received a request to reset your password for your account associated with ${email}. Please use the token below to proceed with resetting your password:

Reset Token: ${resetToken}

This token is valid for the next 60 minutes and will expire afterward. Please ensure you use it within this time frame to reset your password.

If you did not request a password reset, please ignore this email or contact support if you have any concerns.

Best regards,
The Notes Team.`,
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        reject(error);
      } else {
        console.log("Email sent:", info.response);
        resolve(info);
      }
    });
  });
};

module.exports = sendResetPasswordEmail;
