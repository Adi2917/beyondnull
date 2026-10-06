import React from "react";
import "./ServiceHero.css";

const ServiceHero = () => {
  return (
    <section className="service-hero">
      <div className="service-hero-accent"></div>

      <div className="service-hero-container">
        <div className="service-hero-left">
          <h1>
            Digital growth <br />
            <span className="yellow-glow-text">capabilities</span>
          </h1>
          <div className="title-underline"></div>
        </div>

        <div className="service-hero-right">
          <div className="glass-content-card">
            <p className="lead-text">
              BeyondNull helps businesses build stronger digital foundations, get discovered by the right audience, and grow with measurable campaigns.
            </p>
            <p>
              Our team connects websites, apps, SEO, content, LinkedIn, social media, Google Business Profile, video, and performance advertising.
            </p>
            <div className="service-tags">
              <span>#WebDev</span>
              <span>#SEO</span>
              <span>#Marketing</span>
              <span>#LinkedIn</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceHero;
