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
          Elevate Your Digital Presence <br />
          With <span>BeyondNull</span>
        </h1>

        <p className="hero-description">
          We build powerful software, smart digital solutions, and result-driven marketing strategies that help businesses grow faster and stand out in the modern digital world.
        </p>

        <button className="hero-btn" onClick={goToServices}>
          Explore Services
        </button>

      </div>

    </section>
  );
};

export default HomeHero;