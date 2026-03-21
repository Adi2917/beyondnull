import React, { useEffect } from "react";
import "./Why.css";
import { motion } from "framer-motion";
import { FaClock, FaCode, FaHandshake, FaChartBar } from "react-icons/fa";

const Why = () => {
  // We keep your IntersectionObserver logic but can also use Framer Motion for more "Premium" feel
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
      { threshold: 0.1 }
    );
    cards.forEach((card) => observer.observe(card));
  }, []);

  const whyData = [
    {
      icon: <FaCode />,
      title: "Cutting-Edge Tech Stack",
      desc: "We don't just code; we engineer. Using React, Next.js, and modern AI tools to build ultra-fast, future-proof digital products.",
      label: "Modern web development technology"
    },
    {
      icon: <FaChartBar />,
      title: "ROI-Driven Marketing",
      desc: "Our strategies are backed by raw data. We focus on conversion rates and brand scaling, not just empty clicks and likes.",
      label: "Data driven digital marketing"
    },
    {
      icon: <FaHandshake />,
      title: "Client-Centric Ecosystem",
      desc: "You aren't just a 'client'—you're a partner. We offer transparent communication and solutions tailored to your unique business DNA.",
      label: "Trusted business partnership"
    },
    {
      icon: <FaClock />,
      title: "Agile & Rapid Deployment",
      desc: "In the digital race, speed is everything. We deliver high-end, bug-free solutions in record time without cutting corners.",
      label: "Fast website development delivery"
    }
  ];

  return (
    <section className="why">
      {/* Dynamic Background Gradients */}
      <div className="why-bg-gradient"></div>

      <div className="why-container">
        <div className="why-header">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Empowering Brands with <span className="gold-text">Next-Gen Solutions</span>
          </motion.h2>

          <p>
            Beyond Null is where elite engineering meets strategic marketing. 
            We bridge the gap between complex technology and real-world business growth, 
            ensuring your brand dominates the digital landscape.
          </p>
        </div>

        <div className="why-grid">
          {whyData.map((item, index) => (
            <div className="why-card" key={index}>
              <div className="why-card-inner">
                <div className="why-icon-box" aria-label={item.label}>
                  {item.icon}
                  <div className="icon-pulse"></div>
                </div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
                
                {/* Decorative Element */}
                <div className="card-number">0{index + 1}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Why;