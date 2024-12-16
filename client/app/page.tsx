"use client";
import HeroCollection from "@/components/HeroCollection";
import HeroSection from "@/components/HeroSection";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <div className="container mx-auto">
      <Navbar />
      <HeroSection />
      <HeroCollection />
    </div>
  );
}
