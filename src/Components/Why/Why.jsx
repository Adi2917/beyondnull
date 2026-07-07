import React, { useEffect } from "react";
import "./Why.css";
import { motion } from "framer-motion";
import { FaChartBar, FaClock, FaCode, FaHandshake } from "react-icons/fa";

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
      { threshold: 0.1 }
    );

    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, []);

  const whyData = [
    {
      icon: <FaCode />,
      title: "Modern Tech Stack",
      desc: "React-first interfaces, clean performance practices, and scalable digital foundations for business websites and apps.",
      label: "Modern web development technology"
    },
    {
      icon: <FaChartBar />,
      title: "ROI-Driven Marketing",
      desc: "Campaigns are planned around leads, conversions, discovery, and measurable brand growth.",
      label: "Data driven digital marketing"
    },
    {
      icon: <FaHandshake />,
      title: "Client-Centric System",
      desc: "Every project gets a practical roadmap, transparent communication, and execution shaped around your business goals.",
      label: "Trusted business partnership"
    },
    {
      icon: <FaClock />,
      title: "Agile Delivery",
      desc: "Fast launches, clean iteration, and post-launch support so your digital presence keeps improving.",
      label: "Fast website development delivery"
    }
  ];

  return (
    <section className="why">
      <div className="why-bg-gradient"></div>

      <div className="why-container">
        <div className="why-header">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Why businesses choose <span className="gold-text">BeyondNull</span>
          </motion.h2>

          <p>
            We connect design, development, and marketing into one reliable growth workflow for ambitious brands in Bangalore and beyond.
          </p>
        </div>

        <div className="why-grid">
          {whyData.map((item, index) => (
            <div className="why-card" key={item.title}>
              <div className="why-card-inner">
                <div className="why-icon-box" aria-label={item.label}>
                  {item.icon}
                  <div className="icon-pulse"></div>
                </div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
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
