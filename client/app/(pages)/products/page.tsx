import Footer from "@/components/Footer";
import HeroCollection from "@/components/HeroCollection";
import Navbar from "@/components/Navbar";
import React from "react";

const Page = () => {
  return (
    <div className="mx-auto">
      <Navbar />
      <HeroCollection />
      <Footer />
    </div>
  );
};

export default Page;
