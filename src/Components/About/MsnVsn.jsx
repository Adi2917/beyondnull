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

    cards.forEach((card) => {
      observer.observe(card);
    });

  }, []);

  return (

    <section className="mv">

      <div className="mv-container">

        <div className="mv-header">

          <h2>
            Our <span>Purpose & Direction</span>
          </h2>

          <p>
            At BeyondNull, we believe technology should empower businesses
            to innovate, grow, and transform the digital future. Our
            approach combines creativity, strategy, and modern technology
            to deliver meaningful digital experiences.
          </p>

        </div>


        <div className="mv-grid">

          <div className="mv-card mission">

            <div className="mv-overlay"></div>

            <div className="mv-content">
              <h3>Mission</h3>

              <p>
                Our mission is to deliver powerful digital solutions that
                help businesses innovate, scale, and succeed in the
                rapidly evolving digital landscape. We focus on building
                technology that creates real value and long-term impact.
              </p>
            </div>

          </div>


          <div className="mv-card vision">

            <div className="mv-overlay"></div>

            <div className="mv-content">
              <h3>Vision</h3>

              <p>
                Our vision is to become a global digital innovation partner,
                empowering organizations with cutting-edge technology,
                intelligent platforms, and transformative digital
                strategies that shape the future.
              </p>
            </div>

          </div>

        </div>

      </div>

    </section>

  );
};

export default MsnVsn;