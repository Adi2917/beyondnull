import React from "react";
import "./HomeAbout.css";
import { useNavigate } from "react-router-dom";

const HomeAbout = () => {

  const navigate = useNavigate();

  const goToAbout = () => {
    navigate("/about");
  };

  return (
    <section className="homeAbout">

      <div className="about-wrapper">

        <div className="about-left">

          <h2 className="about-heading">
            About <span>Beyond Null</span>
          </h2>

          <p className="about-text">
            Beyond Null is a professional web development and digital marketing 
            agency that helps businesses grow online with modern technology and 
            smart digital solutions. We specialize in website development, app 
            development, social media marketing, SEO services, and Google My 
            Business optimization to create powerful digital experiences that 
            drive long-term business growth.
          </p>

          <button 
            className="about-button" 
            onClick={goToAbout}
            aria-label="Learn more about Beyond Null web development and digital marketing agency"
          >
            Read More →
          </button>

        </div>


        <div className="about-right">

          <img
            src="https://images.unsplash.com/photo-1552664730-d307ca884978"
            alt="Team working on web development and digital marketing strategy"
            loading="lazy"
          />

        </div>

      </div>

    </section>
  );
};

export default HomeAbout;