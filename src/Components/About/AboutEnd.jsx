import React from "react";
import "./AboutEnd.css";
import { Link } from "react-router-dom";

const AboutEnd = () => {
  return (
    <section className="about-end">
      <div className="about-end-container">

        <div className="about-end-left">
          <h2>Ready to Grow Your Business With Us?</h2>

          <p>
            At Beyond Null, we help brands transform their digital presence 
            through creative strategies, innovative marketing, and powerful 
            branding solutions. Our mission is to help your business stand 
            out in the digital world and achieve real growth.
          </p>

          <p>
            Whether you’re a startup looking to build your identity or an 
            established brand aiming to scale, our team is here to guide you 
            with the right digital strategy and execution.
          </p>

          <div className="about-end-buttons">
            <Link to="/services" className="btn-primary">
              Get Started
            </Link>

            <Link to="/contact" className="btn-secondary">
              Contact Us
            </Link>
          </div>
        </div>

        <div className="about-end-right">
          <img
            src="https://images.unsplash.com/photo-1557804506-669a67965ba0"
            alt="digital marketing team"
          />
        </div>

      </div>
    </section>
  );
};

export default AboutEnd;