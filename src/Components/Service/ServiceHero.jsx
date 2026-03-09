import React from "react";
import "./ServiceHero.css";

const ServiceHero = () => {
  return (
    <section className="service-hero">

      <div className="service-overlay"></div>

      <div className="service-hero-container">

        {/* LEFT SIDE HEADING */}
        <div className="service-hero-left">
          <h1>
            Our <br />
            Services
          </h1>
        </div>

        {/* RIGHT SIDE CONTENT */}
        <div className="service-hero-right">

          <p>
            At Markspacify, we provide powerful digital marketing services
            designed to help businesses grow and build a strong presence in
            the digital world.
          </p>

          <p>
            Our team combines creativity, strategy, and technology to deliver
            solutions that drive real business growth. From branding and
            website development to SEO, social media marketing, and
            performance campaigns, we focus on helping your brand reach the
            right audience and convert them into loyal customers.
          </p>

        </div>

      </div>

    </section>
  );
};

export default ServiceHero;