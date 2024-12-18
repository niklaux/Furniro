import Footer from "@/components/Footer";
import MyCart from "@/components/MyCart";
import Navbar from "@/components/Navbar";
import React from "react";

const Page = () => {
  return (
    <div className="mx-auto">
      <Navbar />
      <MyCart />
      {/* <Footer /> */}
    </div>
  );
};

export default Page;
