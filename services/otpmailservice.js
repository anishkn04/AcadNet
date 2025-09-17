import nodemailer from "nodemailer";
import throwWithCode from "../utils/errorthrow.js";

const mailSender = async (recipientEmail, userName, otp) => {
  const senderEmail = process.env.APP_EMAIL;
  const senderPassword = process.env.APP_PASSWORD;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: senderEmail,
      pass: senderPassword
    }
  });

  if (!recipientEmail || !userName || !otp) {
    throwWithCode(
      "Error: Recipient email, user name, and OTP are required.",
      401
    );
  }

  const mailOptions = {
    from: `"Acadnet" <${senderEmail}>`,
    to: recipientEmail,
    subject: "Your One-Time Password (OTP) for Verification",
    html: `
            <div style="font-family: 'Inter', sans-serif; background-color: #f7f7f7; padding: 20px; border-radius: 10px; max-width: 600px; margin: auto; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #333; font-size: 28px; margin-bottom: 10px;">Account Verification</h1>
                    <p style="color: #555; font-size: 16px;">Hello ${userName},</p>
                </div>

                <div style="background-color: #ffffff; padding: 30px; border-radius: 8px; border: 1px solid #ddd; text-align: center;">
                    <p style="font-size: 18px; color: #333; line-height: 1.6;">
                        You have requested a One-Time Password (OTP) to verify your account.
                        Please use the following OTP to complete your action:
                    </p>
                    <div style="margin: 30px 0; padding: 15px 25px; background-color: #e0f2f7; border-left: 5px solid #007bff; border-radius: 5px; display: inline-block;">
                        <strong style="font-size: 32px; color: #007bff; letter-spacing: 3px;">${otp}</strong>
                    </div>
                    <p style="font-size: 16px; color: #555;">
                        This OTP is valid for a short period and will expire soon.
                    </p>
                </div>

                <div style="background-color: #fff3cd; color: #856404; border: 1px solid #ffeeba; border-radius: 8px; padding: 15px; margin-top: 25px; text-align: left;">
                    <p style="font-size: 16px; font-weight: bold; margin-bottom: 10px;">⚠️ Security Warning ⚠️</p>
                    <ul style="margin: 0; padding-left: 20px; list-style-type: disc;">
                        <li><strong>DO NOT share this OTP with anyone.</strong> We will never ask for your OTP.</li>
                        <li>If you did not request this OTP, please ignore this email.</li>
                        <li>Beware of phishing attempts. Always verify the sender.</li>
                    </ul>
                </div>

                <div style="text-align: center; margin-top: 30px; font-size: 14px; color: #888;">
                    <p>Thank you for using our service!</p>
                    <p>&copy; ${new Date().getFullYear()} Acadnet. All rights reserved.</p>
                </div>
            </div>
        `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("OTP Email sent successfully!");
    return true;
  } catch (err) {
    throw err;
  }
};

export default mailSender;
