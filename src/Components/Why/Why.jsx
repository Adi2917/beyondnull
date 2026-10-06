import React, { useEffect } from "react";
import "./Why.css";
import { FaBullseye, FaEye, FaFingerprint, FaHandshake, FaUsers } from "react-icons/fa";

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
      icon: <FaBullseye />,
      title: "Reach the right people",
      desc: "We focus your channels, targeting, and message on the audience most likely to need what you offer.",
      label: "Audience targeting strategy"
    },
    {
      icon: <FaEye />,
      title: "Earn their attention",
      desc: "Strong creative, clear positioning, and useful content give people a reason to stop and notice your brand.",
      label: "Brand attention strategy"
    },
    {
      icon: <FaFingerprint />,
      title: "Show what makes you different",
      desc: "We turn your offer, expertise, and customer value into a digital presence that does not feel interchangeable.",
      label: "Distinctive brand positioning"
    },
    {
      icon: <FaHandshake />,
      title: "Build real trust",
      desc: "Consistent design, proof, useful information, and transparent communication help prospects choose with confidence.",
      label: "Customer trust building"
    },
    {
      icon: <FaUsers />,
      title: "Turn interest into customers",
      desc: "Conversion-focused pages, funnels, campaigns, and follow-up systems move qualified attention toward action.",
      label: "Lead and customer conversion"
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
            How we turn visibility into <span className="gold-text">growth</span>
          </motion.h2>

          <p>
            A clear customer journey from first impression to confidence, enquiry, and long-term business growth.
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

        <p className="why-closing">
          The goal is not to look busy online. The goal is to help the right people find you, trust you, and buy from you.
        </p>
      </div>
    </section>
  );
};

export default Why;
