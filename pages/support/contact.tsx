import BlogLayout from "@/components/BlogLayout";
import ContactForm from "@/components/Form/ContactForm";
import Seo from "@/components/seo";

function Home() {
  const breadcrumbs = [
    { name: 'サポート', url: '/support' },
    { name: 'お問い合わせ' }
  ];

  return (
    <BlogLayout
      breadcrumbs={breadcrumbs}
      category="support"
      currentPath="/support/contact"
    >
      <Seo
        pageTitle="お問い合わせ | 戯曲図書館"
        pageDescription="戯曲図書館へのお問い合わせはこちらから。脚本に関するご質問やご要望をお待ちしています。"
        pagePath="/support/contact"
      />
      <div>
        <h1 className="text-3xl md:text-4xl font-bold mb-6">お問い合わせ</h1>
        <div className="mb-6">
          <p className="text-gray-600 mb-4">
            戯曲図書館へのご質問・ご要望・ご意見などお気軽にお問い合わせください。
          </p>
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <p className="font-semibold mb-2">直接メールでのお問い合わせ</p>
            <p className="text-blue-600">gekidankatakago@gmail.com</p>
          </div>
        </div>
        <ContactForm />
      </div>
    </BlogLayout>
  );
}

export default Home;
