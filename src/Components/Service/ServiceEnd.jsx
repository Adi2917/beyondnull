import React from "react";
import { motion } from "framer-motion";
import { FaRocket, FaUsers, FaChartLine, FaLightbulb } from "react-icons/fa";
import "./ServiceEnd.css";

const ServiceEnd = () => {
  return (
    <section className="service-end-premium">
      {/* BACKGROUND DECOR */}
      <div className="bg-blur-circle-1"></div>
      <div className="bg-blur-circle-2"></div>

      <div className="service-end-top">
        {/* LEFT FLOATING IMAGE */}
        <motion.div 
          className="decor-box left-float"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <img
            src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=400"
            alt="team work"
          />
        </motion.div>

        {/* CENTER CONTENT */}
        <div className="service-end-header">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Why Brands Trust <span className="gold-text">BeyondNull</span>
          </motion.h2>

          <motion.p
             initial={{ opacity: 0 }}
             whileInView={{ opacity: 1 }}
             viewport={{ once: true }}
             transition={{ delay: 0.2 }}
          >
            We don't just provide services; we engineer growth. Our approach 
            combines high-end creativity with data-driven strategy to scale 
            your digital legacy.
          </motion.p>
        </div>

        {/* RIGHT FLOATING IMAGE */}
        <motion.div 
          className="decor-box right-float"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <img
            src="https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400"
            alt="business strategy"
          />
        </motion.div>
      </div>

      {/* FEATURE CARDS */}
      <div className="service-end-grid">
        {[
          { icon: <FaRocket />, title: "Growth Focused", desc: "Strategies designed to scale revenue." },
          { icon: <FaUsers />, title: "Client First", desc: "Custom goals for every unique project." },
          { icon: <FaChartLine />, title: "Result Driven", desc: "Measurable data-backed campaigns." },
          { icon: <FaLightbulb />, title: "Elite Creativity", desc: "Out-of-the-box ideas for your brand." }
        ].map((item, index) => (
          <motion.div 
            className="service-end-card-glass" 
            key={index}
            whileHover={{ y: -10 }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <div className="icon-wrap-gold">{item.icon}</div>
            <h3>{item.title}</h3>
            <p>{item.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* STATS COUNTER BAR */}
      <div className="service-stats-bar">
        {[
          { num: "120+", label: "Projects Done" },
          { num: "80+", label: "Happy Clients" },
          { num: "5+", label: "Expert Members" },
          { num: "24/7", label: "Elite Support" }
        ].map((stat, i) => (
          <div className="stat-item" key={i}>
            <h3 className="stat-num">{stat.num}</h3>
            <p className="stat-label">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ServiceEnd;