import React from "react";
import { motion } from "framer-motion";
import "./Values.css";
import { FaLightbulb, FaUsers, FaBolt, FaChartLine, FaShieldAlt } from "react-icons/fa";

const values = [
  {
    icon: <FaLightbulb />,
    title: "Innovation",
    text: "Exploring new tech to build smarter digital solutions."
  },
  {
    icon: <FaUsers />,
    title: "Collaboration",
    text: "Great results come from teamwork and strong partnerships."
  },
  {
    icon: <FaBolt />,
    title: "Excellence",
    text: "Delivering high-quality products that exceed expectations."
  },
  {
    icon: <FaChartLine />,
    title: "Growth",
    text: "Continuous learning drives everything we do."
  },
  {
    icon: <FaShieldAlt />,
    title: "Integrity",
    text: "Transparency and trust guide every single decision."
  }
];

function Values() {
  return (
    <section className="values-section">
      <div className="values-wrapper">
        
        <motion.div 
          className="values-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2>Our <span className="gold-text">Core Values</span></h2>
          <p>
            Our values define how we work, innovate, and build lasting 
            partnerships. They guide us to deliver meaningful digital experiences.
          </p>
        </motion.div>

        <div className="values-container">
          {values.map((item, index) => (
            <motion.div 
              className="value-item" 
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
            >
              <div className="value-card-inner">
                <div className="value-icon-circle">{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
              {index !== values.length - 1 && <div className="value-divider"></div>}
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default Values;