import Layout from "@/components/Layout";
import { useRouter } from "next/router";
import { useState } from "react";
import axios from "axios";

function Home() {
  const [submitStatus, setSubmitStatus] = useState("");

  const handleCloseSnackbar = () => {};

  return (
    <Layout>
      <div className="support-document"></div>
    </Layout>
  );
}

export default Home;
