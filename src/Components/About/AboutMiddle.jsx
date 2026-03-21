import React from "react";
import { motion } from "framer-motion";
import "./AboutMiddle.css";

const AboutMiddle = () => {
  const boxVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.6 } }
  };

  return (
    <section className="about-middle">
      <div className="about-middle-container">
        
        {/* Glowing Cross Lines */}
        <div className="glow-line vertical-line"></div>
        <div className="glow-line horizontal-line"></div>

        {/* Block 1 */}
        <motion.div 
          className="about-box b-right b-bottom"
          variants={boxVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}
        >
          <div className="box-number">01</div>
          <h3>Innovation Driven Development</h3>
          <p>
            BeyondNull focuses on building technology that helps
            businesses innovate faster and operate efficiently
            in the modern digital ecosystem.
          </p>
        </motion.div>

        {/* Block 2 */}
        <motion.div 
          className="about-box b-bottom"
          variants={boxVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}
        >
          <div className="box-number">02</div>
          <h3>Engineering With Precision</h3>
          <p>
            Our systems are built with modern architecture,
            ensuring performance, scalability, and long-term
            stability for growing businesses.
          </p>
        </motion.div>

        {/* Block 3 */}
        <motion.div 
          className="about-box b-right"
          variants={boxVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}
        >
          <div className="box-number">03</div>
          <h3>Strategy Meets Technology</h3>
          <p>
            We combine business understanding with technology
            expertise to develop digital solutions that create
            meaningful long-term impact.
          </p>
        </motion.div>

        {/* Block 4 */}
        <motion.div 
          className="about-box"
          variants={boxVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}
        >
          <div className="box-number">04</div>
          <h3>Future Ready Platforms</h3>
          <p>
            Every solution we design is built to evolve with
            technology trends and support continuous innovation
            for modern organizations.
          </p>
        </motion.div>

      </div>
    </section>
  );
};

export default AboutMiddle;