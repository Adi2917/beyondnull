import React from "react";
import "./Who.css";

import { FaRocket, FaLightbulb, FaChartLine } from "react-icons/fa";

const Who = () => {
  return (
    <section className="who">

      <div className="who-container">

        <div className="who-header">
          <h2>
            Web Development & Digital <span>Growth Innovation</span>
          </h2>

          <p>
            Beyond Null is a modern web development and digital marketing 
            agency focused on helping businesses grow online. We combine 
            technology, creativity, and strategy to build powerful software, 
            high-performance websites, and result-driven digital marketing 
            solutions that help brands stand out in the competitive digital world.
          </p>
        </div>


        <div className="who-cards">

          <div className="who-card">

            <div className="who-icon" aria-label="Innovative web development solutions">
              <FaRocket />
            </div>

            <h3>Innovation Driven Development</h3>

            <p>
              We create innovative web development solutions, modern websites,
              and scalable digital platforms designed to help businesses move 
              faster and stay ahead in the digital marketplace.
            </p>

          </div>


          <div className="who-card">

            <div className="who-icon" aria-label="Smart digital marketing strategies">
              <FaLightbulb />
            </div>

            <h3>Smart Digital Solutions</h3>

            <p>
              From website development to digital marketing strategies, 
              we design smart solutions including social media marketing, 
              SEO services, and brand growth strategies for startups 
              and modern businesses.
            </p>

          </div>


          <div className="who-card">

            <div className="who-icon" aria-label="Business growth and digital scaling">
              <FaChartLine />
            </div>

            <h3>Growth Focused Strategy</h3>

            <p>
              Our mission is to help businesses scale through technology, 
              powerful digital marketing campaigns, and strategic online 
              growth solutions that bring measurable results.
            </p>

          </div>

        </div>

      </div>

    </section>
  );
};

export default Who;