import React from "react";
import { Link } from "react-router-dom";
import { FaArrowRight, FaChartLine, FaCode, FaMagnifyingGlassChart } from "react-icons/fa6";
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
      title: "Build",
      desc: "Responsive websites, apps, landing pages, and digital assets designed for speed, clarity, and conversion.",
      services: ["Websites", "Apps", "Content assets"],
      aria: "Innovative web development solutions"
    },
    {
      icon: <FaMagnifyingGlassChart />,
      title: "Get Found",
      desc: "SEO, Google Business Profile, content strategy, and local discovery systems built to improve visibility.",
      services: ["SEO", "Google Business", "LinkedIn"],
      aria: "Smart digital marketing strategies"
    },
    {
      icon: <FaChartLine />,
      title: "Grow",
      desc: "Paid ads, social media, LinkedIn management, video, and funnel strategy focused on measurable growth.",
      services: ["Social media", "Performance ads", "Consulting"],
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
          <span className="section-kicker">Three connected capabilities</span>
          <h2 className="who-title">
            One partner to build, get found, and <span className="yellow-glow">grow</span>
          </h2>
          <p className="who-subtitle">
            Strategy, technology, content, and performance marketing connected around the same business goal.
          </p>
        </motion.div>

        <div className="who-cards">
          {cards.map((card, index) => (
            <motion.article
              className="who-card"
              key={index}
              custom={index}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <span className="who-card-number">0{index + 1}</span>
              <div className="who-icon-wrapper" aria-label={card.aria}>
                <div className="icon-inner">{card.icon}</div>
              </div>
              <h3>{card.title}</h3>
              <p>{card.desc}</p>
              <ul className="who-service-list">
                {card.services.map((service) => <li key={service}>{service}</li>)}
              </ul>
              <Link to="/services" className="who-card-link">
                Explore {card.title} <FaArrowRight />
              </Link>
            </motion.article>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Who;
