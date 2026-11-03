import React from "react";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import Hero from "../components/home/Hero";
import TripSection from "../components/home/TripSection";
import WhySection from "../components/home/WhySection";
import ThemedSection from "../components/home/ThemedSection";
import StepsSection from "../components/home/StepsSection";
import ReviewSection from "../components/home/ReviewSection";
import FaqSection from "../components/home/FaqSection";
import ReadyToBook from "../components/home/ReadyToBook";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <main className="flex-1">
        <Hero />
        <TripSection />
        <WhySection />
        <ThemedSection />
        <StepsSection />
        <ReviewSection />
        <FaqSection />
        <ReadyToBook />
      </main>
      <Footer />
    </div>
  );
}
