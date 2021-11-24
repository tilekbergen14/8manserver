const nodemailer = require("nodemailer");

async function main({ sendto, html }) {
  try {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
      },
    });
    let info = await transporter.sendMail({
      from: '"eightman.kz" <eigthmantq@gmail.com>',
      to: `${sendto}`,
      subject: "Verify your email",
      text: "You should verify your email",
      html: html ? html : "",
    });
    return info;
  } catch (err) {
    console.log(err.message);
  }
}

module.exports = main;
