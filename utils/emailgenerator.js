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
      subject: `Reset Your Password for ${email}`,
      text: `Your reset token is -: ${resetToken}`,
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
