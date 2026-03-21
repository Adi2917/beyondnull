import React from "react";
import { motion } from "framer-motion";
import { FaRocket, FaLightbulb, FaChartLine } from "react-icons/fa";
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
      icon: <FaRocket />,
      title: "Innovation Driven Development",
      desc: "We create innovative web development solutions, modern websites, and scalable digital platforms designed to help businesses move faster.",
      aria: "Innovative web development solutions"
    },
    {
      icon: <FaLightbulb />,
      title: "Smart Digital Solutions",
      desc: "From website development to digital marketing strategies, we design smart solutions including social media, SEO, and brand growth.",
      aria: "Smart digital marketing strategies"
    },
    {
      icon: <FaChartLine />,
      title: "Growth Focused Strategy",
      desc: "Our mission is to help businesses scale through technology, powerful digital marketing campaigns, and strategic online growth.",
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
            Web Development & Digital <span className="yellow-glow">Growth Innovation</span>
          </h2>
          <p className="who-subtitle">
            Beyond Null is a modern web development and digital marketing agency focused on 
            helping businesses grow online. We combine technology, creativity, and strategy.
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
                borderColor: "#ffcc00",
                boxShadow: "0px 20px 40px rgba(255, 204, 0, 0.15)" 
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