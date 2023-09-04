import Layout from "@/components/Layout";
import ContactForm from "@/components/Form/ContactForm";
import SupportLayout from "@/components/SupportLayout";

function Home() {
  return (
    <SupportLayout now="contact">
      <div className="support-document">
        <ContactForm />
      </div>
    </SupportLayout>
  );
}

export default Home;
