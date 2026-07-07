import React from "react";
import { motion } from "framer-motion";
import { FaChartLine, FaCode, FaMagnifyingGlassChart } from "react-icons/fa6";
import "./Who.css";

const Who = () => {
  const cardVariants = {
    hidden: { opacity: 0, y: 50, rotateX: -20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: { delay: i * 0.2, duration: 0.6, ease: "easeOut" },
    }),
  };

  const cards = [
    {
      icon: <FaCode />,
      title: "Web & App Engineering",
      desc: "Responsive websites, web apps, landing pages, and product interfaces designed for speed, clarity, and conversion.",
      aria: "Innovative web development solutions"
    },
    {
      icon: <FaMagnifyingGlassChart />,
      title: "SEO & Local Growth",
      desc: "Search visibility, Google Business Profile optimization, analytics, and content systems built for discoverability.",
      aria: "Smart digital marketing strategies"
    },
    {
      icon: <FaChartLine />,
      title: "Campaigns That Scale",
      desc: "Social media, paid ads, creative assets, and funnel strategy tuned for measurable business growth.",
      aria: "Business growth and digital scaling"
    }
  ];

  return (
    <section className="who">
      <div className="who-container">
        
        <motion.div 
          className="who-header"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="who-title">
            Digital agency systems for <span className="yellow-glow">modern brands</span>
          </h2>
          <p className="who-subtitle">
            From Bangalore, we combine engineering, creative direction, and performance marketing into one polished growth platform.
          </p>
        </motion.div>

        <div className="who-cards">
          {cards.map((card, index) => (
            <motion.div 
              className="who-card"
              key={index}
              custom={index}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              whileHover={{ 
                y: -15, 
                rotateY: 10, 
                borderColor: "rgba(121, 87, 213, 0.28)",
                boxShadow: "0px 22px 55px rgba(121, 87, 213, 0.18)" 
              }}
              viewport={{ once: true }}
            >
              <div className="who-icon-wrapper" aria-label={card.aria}>
                <div className="icon-inner">{card.icon}</div>
              </div>
              <h3>{card.title}</h3>
              <p>{card.desc}</p>
              <div className="card-shine"></div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Who;
