import React from "react";
import "./Who.css";

import { FaRocket, FaLightbulb, FaChartLine } from "react-icons/fa";

const Who = () => {
  return (
    <section className="who">

      <div className="who-container">

        <div className="who-header">
          <h2>
            Building Digital <span>Growth & Innovation</span>
          </h2>

          <p>
            At BeyondNull, we combine technology, creativity, and strategy
            to help businesses grow faster in the digital world. Our focus
            is not just building products, but creating impactful solutions
            that deliver real results.
          </p>
        </div>


        <div className="who-cards">

          <div className="who-card">

            <div className="who-icon">
              <FaRocket />
            </div>

            <h3>Innovation First</h3>

            <p>
              We build forward-thinking software and digital solutions
              designed to help businesses move faster and stay ahead
              in a competitive market.
            </p>

          </div>


          <div className="who-card">

            <div className="who-icon">
              <FaLightbulb />
            </div>

            <h3>Smart Solutions</h3>

            <p>
              From powerful software to digital marketing strategies,
              we create intelligent solutions tailored for modern
              businesses and startups.
            </p>

          </div>


          <div className="who-card">

            <div className="who-icon">
              <FaChartLine />
            </div>

            <h3>Growth Focused</h3>

            <p>
              Every project we build is focused on long-term growth,
              helping brands scale, reach more customers, and create
              real digital impact.
            </p>

          </div>

        </div>

      </div>

    </section>
  );
};

export default Who;