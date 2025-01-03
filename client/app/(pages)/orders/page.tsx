import Footer from "@/components/Footer";
import MyOrders from "@/components/MyOrders";
import Navbar from "@/components/Navbar";
import React from "react";

const Page = () => {
  return (
    <div className="mx-auto">
      <Navbar />
      <MyOrders />
      <Footer />
    </div>
  );
};

export default Page;
