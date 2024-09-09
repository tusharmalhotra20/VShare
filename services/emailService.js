const nodemailer = require("nodemailer");

const sendMail = async ({ from, to, subject, text, html }) => {
  // SMTP setup
  let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  let info = await transporter.sendMail({
    from: `VShare <${from}>`,
    to,
    subject,
    text,
    html,
  });
  console.log(info);
};

module.exports = sendMail;
