import React from 'react'
import Hero from "../components/hero.jsx";
import Trip from "../components/trip.jsx";
import Why from "../components/why.jsx";
import Themed from "../components/themed.jsx";
import Steps from "../components/steps.jsx";
import Review from "../components/review.jsx";
import Faq from "../components/faq.jsx";
import Redy from "../components/redyToBook.jsx";
import "../components/home.css";

export default function home() {
  return (
    <div>
        
      <Hero/>
      <Trip/>
      <Why/>
      <Themed/>
      <Steps/>
      <Review/>
      <Faq/>
      <Redy/>
    </div>
  )
}
