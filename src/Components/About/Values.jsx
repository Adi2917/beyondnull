import React from "react";
import "./Values.css";
import { FaLightbulb, FaUsers, FaBolt, FaChartLine, FaShieldAlt } from "react-icons/fa";

const values = [
  {
    icon: <FaLightbulb />,
    title: "Innovation",
    text: "We constantly explore new ideas and technologies to build smarter digital solutions."
  },
  {
    icon: <FaUsers />,
    title: "Collaboration",
    text: "We believe great results come from teamwork and strong partnerships."
  },
  {
    icon: <FaBolt />,
    title: "Excellence",
    text: "We aim to deliver high-quality products that exceed expectations."
  },
  {
    icon: <FaChartLine />,
    title: "Growth",
    text: "Continuous learning and improvement drive everything we do."
  },
  {
    icon: <FaShieldAlt />,
    title: "Integrity",
    text: "Transparency and trust guide every decision and relationship."
  }
];

function Values() {
  return (
    <section className="values-section">

      <div className="values-wrapper">

        {/* Heading */}

        <div className="values-header">

          <h2>
            Our <span>Core Values</span>
          </h2>

          <p>
            Our values define how we work, innovate, and build lasting
            partnerships. They guide every decision we make and help us
            deliver meaningful digital experiences that create real
            impact for businesses and communities.
          </p>

        </div>


        {/* Values */}

        <div className="values-container">

          {values.map((item, index) => (

            <div className="value-item" key={index}>

              <div className="icon">{item.icon}</div>

              <h3>{item.title}</h3>

              <p>{item.text}</p>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}

export default Values;