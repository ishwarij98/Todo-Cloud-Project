import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const sendEmail = async (emailData) => {
  try {
    let userEmail = process.env.EMAIL;
    let password = process.env.PASSWORD;
    let companyName = process.env.COMPANY_NAME;
    let URL = process.env.URL;

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // use TLS
      auth: {
        user: userEmail,
        pass: password,
      },
    });

    const mailOptions = {
      from: `"${companyName}" <${userEmail}>`,
      to: emailData.to,
      subject: emailData.subject,
      text: emailData.text || undefined,
      html: emailData.html || undefined,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log(
      `✅ Email sent to ${emailData.to} (Message ID: ${info.messageId})`
    );
  } catch (err) {
    console.error(`❌ Failed to send email to ${emailData.to}:`, err.message);
  }
};

export default sendEmail;
