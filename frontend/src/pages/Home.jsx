import React from "react";
import Hero from "../components/Hero.jsx";
import AiFeatures from "../components/AiFeatures.jsx";
import Footer from "../components/Footer.jsx";
function Home() {
  return (
    <div className="bg-white  min-h-[calc(100vh-12rem)] pt-6 ">
      <Hero />
      <AiFeatures />
      <Footer />
    </div>
  );
}

export default Home;
