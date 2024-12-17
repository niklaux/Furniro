import AuthForm from "@/components/AuthForm";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import React from "react";

const Page = () => {
  return (
    <div className="mx-auto">
      <Navbar />
      <AuthForm />
      <Footer />
    </div>
  );
};

export default Page;
