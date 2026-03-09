import React, { useState } from "react";
import "./ServiceItem.css";

const services = [
  {
    title: "Website Development",
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800",
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
    image:
      "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800",
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
    image:
      "https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?w=800",
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
    image:
      "https://images.unsplash.com/photo-1507209696998-3c532be9b2b5?w=800",
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
    image:
      "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800",
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
    image:
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800",
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
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800",
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
    image:
      "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800",
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
    image:
      "https://images.unsplash.com/photo-1557838923-2985c318be48?w=800",
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
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleService = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="service-items">

      <div className="service-header">

        <h2>Our Professional Services</h2>

        <p>
          We provide powerful digital solutions that help businesses grow
          faster in the modern digital world. Our services are designed to
          increase your brand visibility, attract the right audience and
          convert them into loyal customers.
        </p>

      </div>

      <div className="services-grid">

        {services.map((service, index) => (
          <div className="service-card" key={index}>

            <img
              src={service.image}
              alt={service.title}
              loading="lazy"
            />

            <h3>{service.title}</h3>

            {activeIndex === index && (
              <ul className="service-points">
                {service.points.map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
            )}

            <button onClick={() => toggleService(index)}>
              {activeIndex === index ? "Show Less" : "Show More"}
            </button>

          </div>
        ))}

      </div>

    </section>
  );
};

export default ServiceItem;