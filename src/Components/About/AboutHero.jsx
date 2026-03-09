import React from "react";
import "./AboutHero.css";

const AboutHero = () => {
  return (
    <section className="about-hero">

      <div className="about-overlay"></div>

      <div className="about-container">

        <h1>
          Building Digital Solutions
          <span> That Empower Businesses</span>
        </h1>

        <p>
          BeyondNull focuses on building modern digital products,
          scalable software systems, and innovative technology
          solutions that help businesses grow in the digital era.
        </p>

        <p>
          Our approach combines strategy, design, and engineering
          to create reliable platforms that deliver performance,
          scalability, and long-term business impact.
        </p>

      </div>

    </section>
  );
};

export default AboutHero;