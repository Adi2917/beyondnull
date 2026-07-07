import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaArrowRight, FaCheck, FaXmark } from "react-icons/fa6";
import "./ServiceItem.css";

const services = [
  {
    title: "Website Development",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=900&auto=format&fit=crop",
    intro: "Premium responsive websites that look sharp, load fast, and turn visitors into leads.",
    types: ["Business websites", "Landing pages", "Portfolio websites", "eCommerce stores", "Booking websites", "Custom web apps"],
    deliverables: ["Modern UI/UX layout", "Mobile responsive pages", "SEO-ready structure", "Contact/lead forms", "Speed optimization", "Deployment support"],
    process: ["Brand and requirement discovery", "Wireframe and content structure", "Design and development", "Testing, launch, and support"],
    bestFor: "Startups, local businesses, service providers, creators, agencies, and brands that need a professional online presence."
  },
  {
    title: "App Development",
    image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=900&auto=format&fit=crop",
    intro: "Clean mobile app experiences for businesses that need customer portals, booking flows, or custom digital tools.",
    types: ["Android apps", "iOS-ready apps", "Customer portals", "Admin dashboards", "Booking apps", "Internal business tools"],
    deliverables: ["User flow planning", "App UI screens", "API integration", "Authentication flows", "Performance-focused build", "Maintenance support"],
    process: ["Feature planning", "Prototype and UX flow", "Development sprint", "Testing and release guidance"],
    bestFor: "Businesses that need a custom app for operations, customers, leads, services, or digital products."
  },
  {
    title: "Social Media Marketing",
    image: "https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?w=900&auto=format&fit=crop",
    intro: "Campaigns, creatives, and audience strategy that make your brand visible and memorable.",
    types: ["Instagram marketing", "Facebook campaigns", "Brand awareness", "Lead campaigns", "Offer campaigns", "Launch promotions"],
    deliverables: ["Campaign strategy", "Creative direction", "Audience targeting", "Ad copy", "Performance tracking", "Optimization plan"],
    process: ["Audience research", "Creative plan", "Campaign setup", "Weekly performance tuning"],
    bestFor: "Brands that want reach, leads, awareness, and a stronger social media presence."
  },
  {
    title: "Social Media Management",
    image: "https://images.unsplash.com/photo-1611926653458-09294b3142bf?w=900&auto=format&fit=crop",
    intro: "Daily social presence handled with strategy, consistency, and professional brand presentation.",
    types: ["Instagram management", "Facebook management", "Content calendars", "Profile optimization", "Community engagement", "Monthly reports"],
    deliverables: ["Posting schedule", "Caption writing", "Hashtag planning", "Creative coordination", "DM/comment guidance", "Growth reporting"],
    process: ["Brand audit", "Monthly content plan", "Posting and engagement", "Review and improvements"],
    bestFor: "Businesses that want consistent posting and better brand trust without managing everything themselves."
  },
  {
    title: "Video Editing",
    image: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=900&auto=format&fit=crop",
    intro: "Professional edits for reels, ads, YouTube, launches, testimonials, and brand storytelling.",
    types: ["Reels editing", "YouTube editing", "Ad creatives", "Promo videos", "Event highlights", "Motion text videos"],
    deliverables: ["Cuts and pacing", "Transitions", "Captions", "Color correction", "Music sync", "Export for platforms"],
    process: ["Raw footage review", "Edit style selection", "First cut", "Revisions and final export"],
    bestFor: "Creators, coaches, local brands, eCommerce stores, and businesses running social campaigns."
  },
  {
    title: "Consultancy",
    image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=900&auto=format&fit=crop",
    intro: "Practical digital guidance for business owners who want clarity before spending on tech or marketing.",
    types: ["Startup guidance", "Digital audit", "Marketing roadmap", "Website audit", "Brand positioning", "Growth planning"],
    deliverables: ["Problem diagnosis", "Action roadmap", "Tool recommendations", "Priority list", "Budget guidance", "Execution plan"],
    process: ["Discovery call", "Current setup review", "Strategy document", "Implementation guidance"],
    bestFor: "Founders and businesses that need direction, planning, and smarter digital decisions."
  },
  {
    title: "Digital Marketing",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=900&auto=format&fit=crop",
    intro: "A complete growth system combining SEO, content, ads, analytics, and conversion-focused strategy.",
    types: ["SEO", "Content marketing", "Lead generation", "Funnel strategy", "Analytics setup", "Conversion optimization"],
    deliverables: ["Growth plan", "Keyword strategy", "Content direction", "Campaign tracking", "Monthly reporting", "Optimization actions"],
    process: ["Business audit", "Audience and keyword research", "Campaign execution", "Data-led improvements"],
    bestFor: "Businesses that want predictable online growth and a long-term digital acquisition system."
  },
  {
    title: "Google My Business",
    image: "https://images.unsplash.com/photo-1524661135-423995f22d0b?w=900&auto=format&fit=crop",
    intro: "Local visibility setup so nearby customers can find, trust, and contact your business faster.",
    types: ["Profile setup", "Profile optimization", "Local SEO", "Review strategy", "Map ranking support", "Post updates"],
    deliverables: ["Category optimization", "Service/product setup", "Business description", "Photo guidance", "Review flow", "Local keyword plan"],
    process: ["Profile audit", "Optimization setup", "Local content updates", "Ranking and review monitoring"],
    bestFor: "Clinics, restaurants, salons, stores, agencies, consultants, and local service businesses."
  },
  {
    title: "Paid Advertisement",
    image: "https://images.unsplash.com/photo-1557838923-2985c318be48?w=900&auto=format&fit=crop",
    intro: "Paid campaigns built for qualified leads, better targeting, and cleaner conversion tracking.",
    types: ["Google Ads", "Meta Ads", "Lead campaigns", "Retargeting", "Launch campaigns", "Offer campaigns"],
    deliverables: ["Campaign setup", "Ad copy", "Audience targeting", "Creative guidance", "Pixel/tracking setup", "Performance optimization"],
    process: ["Offer and audience planning", "Campaign setup", "Launch monitoring", "Budget and creative optimization"],
    bestFor: "Businesses ready to generate leads, bookings, traffic, or sales with measurable ad spend."
  }
];

const ServiceItem = () => {
  const [activeService, setActiveService] = useState(null);

  return (
    <section className="service-items-premium">
      <div className="service-header-dark">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Full-stack digital <span className="gold-glow">solutions</span>
        </motion.h2>

        <p>
          Explore each service in detail and choose the exact growth system your business needs.
        </p>
      </div>

      <div className="services-grid-modern">
        {services.map((service, index) => (
          <motion.div
            className="service-card-premium"
            key={service.title}
            initial={{ opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.03 }}
            whileHover={{ y: -10 }}
          >
            <div className="card-image-wrapper">
              <img src={service.image} alt={service.title} loading="lazy" />
              <div className="card-overlay-gradient"></div>
            </div>

            <div className="card-content-area">
              <span className="service-index">0{index + 1}</span>
              <h3>{service.title}</h3>
              <p>{service.intro}</p>

              <button
                className="cta-button-service"
                onClick={() => setActiveService(service)}
              >
                <span>Explore Details</span>
                <FaArrowRight />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {activeService && (
          <motion.div
            className="service-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveService(null)}
          >
            <motion.div
              className="service-detail-modal"
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 220, damping: 24 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="service-modal-close" onClick={() => setActiveService(null)} aria-label="Close service details">
                <FaXmark />
              </button>

              <div className="service-modal-hero">
                <img src={activeService.image} alt={activeService.title} />
                <div>
                  <span className="service-modal-kicker">Service Detail</span>
                  <h3>{activeService.title}</h3>
                  <p>{activeService.intro}</p>
                </div>
              </div>

              <div className="service-modal-grid">
                <div className="service-modal-panel">
                  <h4>What We Build</h4>
                  <ul>
                    {activeService.types.map((item) => (
                      <li key={item}><FaCheck /> {item}</li>
                    ))}
                  </ul>
                </div>

                <div className="service-modal-panel">
                  <h4>What You Get</h4>
                  <ul>
                    {activeService.deliverables.map((item) => (
                      <li key={item}><FaCheck /> {item}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="service-process">
                <h4>How We Work</h4>
                <div className="service-process-steps">
                  {activeService.process.map((step, index) => (
                    <div key={step}>
                      <span>{index + 1}</span>
                      <p>{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="service-bestfor">
                <strong>Best for:</strong> {activeService.bestFor}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default ServiceItem;
