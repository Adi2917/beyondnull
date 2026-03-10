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
            Why Choose <span>Beyond Null</span> for Web Development & Digital Marketing
          </h2>

          <p>
            Beyond Null is a modern web development and digital marketing agency
            focused on helping businesses grow online. We deliver powerful website
            development, app development, SEO services, and social media marketing
            strategies that help brands scale faster and build a strong digital presence.
          </p>

        </div>


        <div className="why-grid">

          <div className="why-card">
            <div className="why-icon" aria-label="Modern web development technology">
              <FaCode />
            </div>
            <h3>Modern Web Development</h3>
            <p>
              We build scalable and high-performance websites using modern
              web development technologies designed for speed, security,
              and long-term business growth.
            </p>
          </div>

          <div className="why-card">
            <div className="why-icon" aria-label="Data driven digital marketing strategies">
              <FaChartBar />
            </div>
            <h3>Data Driven Digital Marketing</h3>
            <p>
              Our digital marketing strategies are powered by analytics
              and insights that help businesses improve online visibility,
              attract more customers, and achieve measurable growth.
            </p>
          </div>

          <div className="why-card">
            <div className="why-icon" aria-label="Trusted business partnership">
              <FaHandshake />
            </div>
            <h3>Trusted Business Partnership</h3>
            <p>
              We work closely with our clients to create customized
              web development and digital marketing solutions aligned
              with their long-term business goals.
            </p>
          </div>

          <div className="why-card">
            <div className="why-icon" aria-label="Fast website development delivery">
              <FaClock />
            </div>
            <h3>Fast & Reliable Delivery</h3>
            <p>
              Our team focuses on fast execution without compromising
              quality, delivering powerful digital solutions that
              help businesses launch and grow quickly.
            </p>
          </div>

        </div>

      </div>

    </section>
  );
};

export default Why;