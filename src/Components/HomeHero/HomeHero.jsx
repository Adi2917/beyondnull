import React from "react";
import "./HomeHero.css";
import { useNavigate } from "react-router-dom";

const HomeHero = () => {

  const navigate = useNavigate();

  const goToServices = () => {
    navigate("/services");
  };

  return (
    <section className="hero">

      <div className="hero-overlay"></div>

      <div className="hero-content">

        <h1 className="hero-title">
          Web Development & Digital Marketing Agency <br />
          <span>Beyond Null</span>
        </h1>

        <p className="hero-description">
          Beyond Null is a professional web development and digital marketing agency 
          offering website development, app development, social media marketing, 
          Google My Business optimization, and complete digital marketing solutions 
          to help businesses grow faster in the modern digital world.
        </p>

        <button 
          className="hero-btn" 
          onClick={goToServices}
          aria-label="Explore Web Development and Digital Marketing Services"
        >
          Explore Services
        </button>

      </div>

    </section>
  );
};

export default HomeHero;