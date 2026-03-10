import React from "react";
import "./AboutHero.css";

const AboutHero = () => {
  return (
    <section className="about-hero">

      <div className="about-overlay"></div>

      <div className="about-container">

        <h1>
          Web Development & Digital Solutions
          <span> That Empower Modern Businesses</span>
        </h1>

        <p>
          Beyond Null is a modern web development and digital marketing
          agency focused on building high-performance websites,
          scalable software, and powerful digital platforms.
        </p>

        <p>
          Our team combines strategy, design, and engineering to build
          reliable products that help startups and businesses grow
          faster in the digital world.
        </p>

      </div>

    </section>
  );
};

export default AboutHero;