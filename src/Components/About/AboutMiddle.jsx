import React from "react";
import "./AboutMiddle.css";

const AboutMiddle = () => {
  return (

    <section className="about-middle">

      <div className="about-middle-container">

        {/* cross lines for desktop */}

        <div className="vertical-line"></div>
        <div className="horizontal-line"></div>

        {/* Block 1 */}

        <div className="about-box">

          <h3>Innovation Driven Development</h3>

          <p>
            BeyondNull focuses on building technology that helps
            businesses innovate faster and operate efficiently
            in the modern digital ecosystem.
          </p>

        </div>


        {/* Block 2 */}

        <div className="about-box">

          <h3>Engineering With Precision</h3>

          <p>
            Our systems are built with modern architecture,
            ensuring performance, scalability, and long-term
            stability for growing businesses.
          </p>

        </div>


        {/* Block 3 */}

        <div className="about-box">

          <h3>Strategy Meets Technology</h3>

          <p>
            We combine business understanding with technology
            expertise to develop digital solutions that create
            meaningful long-term impact.
          </p>

        </div>


        {/* Block 4 */}

        <div className="about-box">

          <h3>Future Ready Platforms</h3>

          <p>
            Every solution we design is built to evolve with
            technology trends and support continuous innovation
            for modern organizations.
          </p>

        </div>

      </div>

    </section>

  );
};

export default AboutMiddle;