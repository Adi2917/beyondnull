import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./ServiceItem.css";

// --- SAARI 9 SERVICES KA DATA ---
const services = [
  {
    title: "Website Development",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800",
    points: [
      "Custom responsive website design",
      "SEO friendly website structure",
      "Modern UI/UX experience",
      "Business and eCommerce websites",
      "Fast loading optimized pages",
      "Secure and scalable architecture",
    ],
  },
  {
    title: "App Development",
    image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800",
    points: [
      "Android and iOS applications",
      "User friendly mobile interface",
      "High performance development",
      "Custom business apps",
      "API integration",
      "App maintenance and support",
    ],
  },
  {
    title: "Social Media Marketing",
    image: "https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?w=800",
    points: [
      "Targeted audience campaigns",
      "Brand awareness strategies",
      "Content marketing campaigns",
      "Follower growth strategies",
      "Engagement optimization",
      "Performance analytics tracking",
    ],
  },
  {
    title: "Social Media Management",
    image: "https://images.unsplash.com/photo-1507209696998-3c532be9b2b5?w=800",
    points: [
      "Daily content posting",
      "Account profile optimization",
      "Content scheduling",
      "Community engagement",
      "Brand consistency",
      "Performance monitoring",
    ],
  },
  {
    title: "Video Editing",
    image: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800",
    points: [
      "Professional video editing",
      "Reels and short form editing",
      "YouTube content editing",
      "Brand storytelling videos",
      "Color grading & transitions",
      "High quality export formats",
    ],
  },
  {
    title: "Consultancy",
    image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800",
    points: [
      "Business growth strategies",
      "Marketing consultation",
      "Startup guidance",
      "Digital transformation advice",
      "Brand positioning strategies",
      "Performance improvement plans",
    ],
  },
  {
    title: "Digital Marketing",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800",
    points: [
      "Complete digital strategy",
      "SEO and search visibility",
      "Lead generation campaigns",
      "Content marketing",
      "Conversion optimization",
      "Marketing performance tracking",
    ],
  },
  {
    title: "Google My Business",
    image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800",
    points: [
      "GMB profile optimization",
      "Local SEO ranking",
      "Google map visibility",
      "Customer review management",
      "Local traffic increase",
      "Business listing optimization",
    ],
  },
  {
    title: "Paid Advertisement",
    image: "https://images.unsplash.com/photo-1557838923-2985c318be48?w=800",
    points: [
      "Google Ads campaigns",
      "Facebook & Instagram ads",
      "Lead generation campaigns",
      "Targeted audience ads",
      "Conversion optimization",
      "Ad performance tracking",
    ],
  },
];

const ServiceItem = () => {
  // --- TERA WAHi LOGIC ---
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleService = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="service-items-premium">
      
      {/* HEADER SECTION */}
      <div className="service-header-dark">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Our Professional <span className="gold-glow">Solutions</span>
        </motion.h2>

        <p>
          We build digital powerhouses. Our services are engineered to scale your brand, 
          dominate the market competition, and convert audience into loyal customers.
        </p>
      </div>

      {/* SERVICES GRID */}
      <div className="services-grid-modern">
        {services.map((service, index) => (
          
          <motion.div 
            className={`service-card-premium ${activeIndex === index ? "active-card" : ""}`}
            key={index}
            layout // Essential for smooth expansion
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, cubicBezier: [0.175, 0.885, 0.32, 1.275] }}
            whileHover={{ y: activeIndex === index ? 0 : -10 }} // Only hover when collapsed
          >
            {/* Image Area with 3D feel */}
            <div className="card-image-wrapper">
              <img src={service.image} alt={service.title} loading="lazy" />
              <div className="card-overlay-gradient"></div>
            </div>

            {/* Content Area */}
            <div className="card-content-area">
              <h3>{service.title}</h3>
              
              {/* ANIMATED POINTS (Show More/Less) */}
              <AnimatePresence>
                {activeIndex === index && (
                  <motion.ul 
                    className="service-points-list"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {service.points.map((point, i) => (
                      <motion.li 
                        key={i}
                        initial={{ x: -15, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: i * 0.05 }}
                      >
                        <span className="bullet-gold"></span> {point}
                      </motion.li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>

              {/* TERA BUTTON LOGIC */}
              <button 
                className={`cta-button-service ${activeIndex === index ? "less" : ""}`}
                onClick={() => toggleService(index)}
              >
                <span>{activeIndex === index ? "View Less" : "Explore Details"}</span>
                <div className="btn-glow-effect"></div>
              </button>
            </div>
            
            {/* Background Glow decorative */}
            <div className="card-bg-glow"></div>
          </motion.div>
        ))}
      </div>

    </section>
  );
};

export default ServiceItem;