import { Resend } from "resend";
import { NextApiRequest, NextApiResponse } from "next";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const { name, email, subject, content } = req.body;

      // バリデーション
      if (!name || !email || !subject || !content) {
        return res
          .status(400)
          .json({ error: "必須項目が入力されていません。" });
      }

      // API キーの存在チェック
      if (!process.env.RESEND_API_KEY) {
        console.error("RESEND_API_KEY is not set");
        return res
          .status(500)
          .json({ error: "メール設定エラーが発生しました。" });
      }

      // お客様への自動返信メール
      const customerEmail = await resend.emails.send({
        from: `戯曲図書館 <noreply@${process.env.RESEND_DOMAIN}>`, // ドメインを環境変数で指定
        to: [email],
        subject: `お問い合わせを受け付けました - ${subject}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">お問い合わせありがとうございます</h2>
            <p><strong>${name}様</strong></p>
            <p>この度は、お問い合わせをいただきありがとうございました。</p>
            <p>以下の内容でお問い合わせを受け付けいたしました。</p>
            
            <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #555; margin-top: 0;">お問い合わせ内容</h3>
              <p><strong>件名：</strong>${subject}</p>
              <p><strong>お名前：</strong>${name}</p>
              <p><strong>メールアドレス：</strong>${email}</p>
              <div style="margin-top: 15px;">
                <strong>お問い合わせ内容：</strong>
                <div style="white-space: pre-wrap; margin-top: 8px;">${content}</div>
              </div>
            </div>
            
            <p>返信まで少々お時間をいただく場合がございます。</p>
            <p>今後ともよろしくお願いいたします。</p>
            
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
            <p style="color: #666; font-size: 14px;">
              戯曲図書館<br>
              https://gikyokutosyokan.com
            </p>
          </div>
        `,
      });

      // 管理者への通知メール
      const adminEmail = await resend.emails.send({
        from: `戯曲図書館 <noreply@${process.env.RESEND_DOMAIN}>`,
        to: [`gekidankatakago@gmail.com`], // または process.env.ADMIN_EMAIL
        subject: `新規お問い合わせ：${subject}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #d32f2f;">新しいお問い合わせが届きました</h2>
            
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #333; margin-top: 0;">お問い合わせ詳細</h3>
              <p><strong>お名前：</strong>${name}</p>
              <p><strong>メールアドレス：</strong>${email}</p>
              <p><strong>件名：</strong>${subject}</p>
              <div style="margin-top: 15px;">
                <strong>お問い合わせ内容：</strong>
                <div style="background-color: white; padding: 15px; border-radius: 4px; margin-top: 8px; white-space: pre-wrap;">${content}</div>
              </div>
            </div>
            
            <p style="color: #666;">
              返信は <a href="mailto:${email}" style="color: #1976d2;">${email}</a> 宛にお送りください。
            </p>
          </div>
        `,
      });

      console.log("Customer email sent:", customerEmail.data?.id);
      console.log("Admin email sent:", adminEmail.data?.id);

      res.status(200).json({
        message:
          "メールが送信されました。ご登録いただいたメールアドレスに確認メールをお送りしました。",
        customerEmailId: customerEmail.data?.id,
        adminEmailId: adminEmail.data?.id,
      });
    } catch (error: any) {
      console.error("Email sending error:", error);

      // より詳細なエラー情報をログに出力
      if (error.message) {
        console.error("Error message:", error.message);
      }
      if (error.name) {
        console.error("Error name:", error.name);
      }

      res.status(500).json({
        error:
          "メールの送信中にエラーが発生しました。しばらく時間をおいて再度お試しください。",
      });
    }
  } else {
    res.status(405).json({ error: "POSTメソッドを使用してください。" });
  }
}
