import React from "react";
import "./ServiceEnd.css";
import { FaRocket, FaUsers, FaChartLine, FaLightbulb } from "react-icons/fa";

const ServiceEnd = () => {
  return (
    <section className="service-end">

      <div className="service-end-top">

        {/* left image */}

        <div className="decor-box">
          <img
            src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=400"
            alt="team work"
          />
        </div>

        {/* content */}

        <div className="service-end-header">

          <h2>Why Businesses Choose BeyondNull</h2>

          <p>
            We focus on delivering powerful digital solutions that help
            businesses grow faster and build a strong online presence.
            Our approach combines creativity, strategy, and modern
            technology to create impactful results for every brand.
          </p>

        </div>

        {/* right image */}

        <div className="decor-box">
          <img
            src="https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400"
            alt="business strategy"
          />
        </div>

      </div>

      {/* features */}

      <div className="service-end-grid">

        <div className="service-end-card">
          <FaRocket className="service-icon"/>
          <h3>Growth Focused Strategy</h3>
          <p>Strategies designed to drive real business growth.</p>
        </div>

        <div className="service-end-card">
          <FaUsers className="service-icon"/>
          <h3>Client First Approach</h3>
          <p>Every project is customized based on your goals.</p>
        </div>

        <div className="service-end-card">
          <FaChartLine className="service-icon"/>
          <h3>Result Driven Marketing</h3>
          <p>Data driven campaigns that deliver measurable results.</p>
        </div>

        <div className="service-end-card">
          <FaLightbulb className="service-icon"/>
          <h3>Creative Solutions</h3>
          <p>Innovative ideas that help your brand stand out.</p>
        </div>

      </div>

      {/* stats */}

      <div className="service-stats">

        <div className="stat">
          <h3>120+</h3>
          <p>Projects Completed</p>
        </div>

        <div className="stat">
          <h3>80+</h3>
          <p>Happy Clients</p>
        </div>

        <div className="stat">
          <h3>2+</h3>
          <p>Years Experience</p>
        </div>

        <div className="stat">
          <h3>24/7</h3>
          <p>Support</p>
        </div>

      </div>

    </section>
  );
};

export default ServiceEnd;