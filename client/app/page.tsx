"use client";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import Navbar from "@/components/Navbar";

export default function Home() {
  
  return (
    <div className="mx-auto">
      <Navbar />
      <HeroSection />
      <Footer />
    </div>
  );
}
