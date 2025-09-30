import transporter from "../config/nodemailer.js";

const sendEmail = async (to, subject, text) => {
    try {
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to,
            subject,
            text,
        };

        const info = await transporter.sendMail(mailOptions);

        return {
            success: true,
            info,
        };

    } catch (error) {
        return {
            success: false,
            error: error.message,
        };
    }
}

export { sendEmail };