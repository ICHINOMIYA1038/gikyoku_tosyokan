import nodemailer from "nodemailer";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const { name, email, subject, content } = req.body;

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.MAIL_ACCOUNT,
          pass: process.env.MAIL_PASSWORD,
        },
      });

      const mailOptions = {
        from: process.env.MAIL_ACCOUNT,
        to: email,
        subject: subject,
        text: `${name}様\n\nお問い合わせありがとうございました。\n\n返信までしばらくお待ちください。\n\nお問い合わせ内容\n\n${content}`,
      };

      const mailOptionsToSelf = {
        from: process.env.MAIL_ACCOUNT,
        to: process.env.MAIL_ACCOUNT,
        subject: "お問い合わせがありました:${subject}",
        text: `${name}様\n\nお問い合わせありがとうございました。\n\n返信までしばらくお待ちください。\n\nお問い合わせ内容\n\n${content}`,
      };

      const info = await transporter.sendMail(mailOptions);
      const toself = await transporter.sendMail(mailOptionsToSelf);
      console.log("Email sent: " + info.response);

      res.status(200).json({ message: "メールが送信されました。" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "メールの送信中にエラーが発生しました。" });
    }
  } else {
    res.status(405).json({ error: "POSTメソッドを使用してください。" });
  }
}
