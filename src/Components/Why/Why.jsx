import React, { useEffect } from "react";
import "./Why.css";
import { FaClock, FaCode, FaHandshake, FaChartBar } from "react-icons/fa";

const Why = () => {

  useEffect(() => {

    const cards = document.querySelectorAll(".why-card");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
          }
        });
      },
      { threshold: 0.2 }
    );

    cards.forEach((card) => {
      observer.observe(card);
    });

  }, []);

  return (
    <section className="why">

      <div className="why-container">

        <div className="why-header">

          <h2>
            The <span>BeyondNull</span> Advantage
          </h2>

          <p>
            We focus on delivering powerful digital solutions that help
            businesses innovate, scale, and grow faster. Our approach
            combines technology, strategy, and creativity to create
            real impact in the digital world.
          </p>

        </div>


        <div className="why-grid">

          <div className="why-card">
            <div className="why-icon">
              <FaCode />
            </div>
            <h3>Modern Technology</h3>
            <p>
              We build scalable platforms using modern technologies
              designed for performance, security, and future growth.
            </p>
          </div>

          <div className="why-card">
            <div className="why-icon">
              <FaChartBar />
            </div>
            <h3>Data Driven Growth</h3>
            <p>
              Our strategies are based on real insights and analytics
              that help businesses achieve measurable results.
            </p>
          </div>

          <div className="why-card">
            <div className="why-icon">
              <FaHandshake />
            </div>
            <h3>Trusted Partnership</h3>
            <p>
              We collaborate closely with clients to create digital
              solutions aligned with their long-term vision.
            </p>
          </div>

          <div className="why-card">
            <div className="why-icon">
              <FaClock />
            </div>
            <h3>Fast Execution</h3>
            <p>
              Speed and quality are our priorities. We deliver powerful
              digital solutions without compromising performance.
            </p>
          </div>

        </div>

      </div>

    </section>
  );
};

export default Why;