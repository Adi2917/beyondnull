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
            About <span>BeyondNull</span>
          </h2>

          <p className="about-text">
            BeyondNull helps businesses grow with innovative software,
            smart digital solutions, and powerful marketing strategies.
            We focus on building technology and digital experiences that
            create real value and long-term growth.
          </p>

          <button className="about-button" onClick={goToAbout}>
            Read More →
          </button>

        </div>


        <div className="about-right">

          <img
            src="https://images.unsplash.com/photo-1552664730-d307ca884978"
            alt="about"
          />

        </div>

      </div>

    </section>
  );
};

export default HomeAbout;