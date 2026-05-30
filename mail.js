const nodemailer = require("nodemailer");
async function testEmail(email,otp) {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "aashishpandit112@gmail.com",     // your gmail
        pass: "pxvv soax xrdk gydl",   // app password (NO spaces)
      },
    });
    const info = await transporter.sendMail({
      from: "IshqBook ❤️",
        to: email,
        subject: "verify Email",
        html: `your verification opt is ${otp}, please verify your email to complete signup process`,
    });
    console.log("✅ otp sent:", email,otp);
    return true;
  } catch (error) {
    console.error("❌ Error:", error);
    return false
  }
}

module.exports = testEmail;