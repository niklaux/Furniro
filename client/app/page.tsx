"use client";
import Footer from "@/components/Footer";
import HeroCollection from "@/components/HeroCollection";
import HeroSection from "@/components/HeroSection";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <div className="mx-auto">
      <Navbar />
      <HeroSection />
      <HeroCollection />
      <Footer />
    </div>
  );
}
