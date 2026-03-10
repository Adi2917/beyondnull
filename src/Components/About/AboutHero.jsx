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
          Beyond Null is a modern web development and digital marketing agency
          focused on building high-performance websites, scalable software,
          and innovative digital solutions that help businesses grow online.
        </p>

        <p>
          Our approach combines strategy, design, and engineering to deliver
          reliable platforms, powerful user experiences, and long-term
          digital growth for startups and businesses.
        </p>

      </div>

    </section>
  );
};

export default AboutHero;