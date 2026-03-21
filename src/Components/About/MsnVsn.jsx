import React, { useEffect } from "react";
import "./MsnVsn.css";

const MsnVsn = () => {
  useEffect(() => {
    const cards = document.querySelectorAll(".mv-card");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
          }
        });
      },
      { threshold: 0.25 }
    );
    cards.forEach((card) => observer.observe(card));
  }, []);

  return (
    <section className="mv">
      <div className="mv-container">
        
        <div className="mv-header">
          <h2>Our <span className="yellow-text">Purpose & Direction</span></h2>
          <p>
            At BeyondNull, we believe technology should empower businesses
            to innovate, grow, and transform the digital future. We bridge 
            the gap between complex code and human-centric design.
          </p>
        </div>

        <div className="mv-grid">
          {/* MISSION CARD */}
          <div className="mv-card mission slide-left">
            <div className="mv-overlay"></div>
            <div className="mv-content">
              <div className="mv-icon-tag">01</div>
              <h3>Mission</h3>
              <p>
                To deliver elite digital solutions that help businesses 
                innovate, scale, and dominate in the evolving digital landscape. 
                We focus on technology that creates real-world ROI and long-term impact.
              </p>
            </div>
          </div>

          {/* VISION CARD */}
          <div className="mv-card vision slide-right">
            <div className="mv-overlay"></div>
            <div className="mv-content">
              <div className="mv-icon-tag">02</div>
              <h3>Vision</h3>
              <p>
                To become a global powerhouse for digital innovation, 
                empowering organizations with cutting-edge platforms, 
                AI-driven insights, and transformative strategies that shape 
                the future of the internet.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default MsnVsn;