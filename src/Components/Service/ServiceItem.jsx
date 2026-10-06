import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { FaArrowRight, FaCheck, FaXmark } from "react-icons/fa6";
import "./ServiceItem.css";

const services = [
  {
    group: "Build",
    title: "Website Development",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=900&auto=format&fit=crop",
    intro: "Premium responsive websites that look sharp, load fast, and turn visitors into leads.",
    types: ["Business websites", "Landing pages", "Portfolio websites", "eCommerce stores", "Booking websites", "Custom web apps"],
    deliverables: ["Modern UI/UX layout", "Mobile responsive pages", "SEO-ready structure", "Contact/lead forms", "Speed optimization", "Deployment support"],
    process: ["Brand and requirement discovery", "Wireframe and content structure", "Design and development", "Testing, launch, and support"],
    bestFor: "Startups, local businesses, service providers, creators, agencies, and brands that need a professional online presence."
  },
  {
    group: "Build",
    title: "App Development",
    image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=900&auto=format&fit=crop",
    intro: "Clean mobile app experiences for businesses that need customer portals, booking flows, or custom digital tools.",
    types: ["Android apps", "iOS-ready apps", "Customer portals", "Admin dashboards", "Booking apps", "Internal business tools"],
    deliverables: ["User flow planning", "App UI screens", "API integration", "Authentication flows", "Performance-focused build", "Maintenance support"],
    process: ["Feature planning", "Prototype and UX flow", "Development sprint", "Testing and release guidance"],
    bestFor: "Businesses that need a custom app for operations, customers, leads, services, or digital products."
  },
  {
    group: "Grow",
    title: "Social Media Marketing",
    image: "https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?w=900&auto=format&fit=crop",
    intro: "Campaigns, creatives, and audience strategy that make your brand visible and memorable.",
    types: ["Instagram marketing", "Facebook campaigns", "Brand awareness", "Lead campaigns", "Offer campaigns", "Launch promotions"],
    deliverables: ["Campaign strategy", "Creative direction", "Audience targeting", "Ad copy", "Performance tracking", "Optimization plan"],
    process: ["Audience research", "Creative plan", "Campaign setup", "Weekly performance tuning"],
    bestFor: "Brands that want reach, leads, awareness, and a stronger social media presence."
  },
  {
    group: "Grow",
    title: "Social Media Management",
    image: "https://images.unsplash.com/photo-1611926653458-09294b3142bf?w=900&auto=format&fit=crop",
    intro: "Daily social presence handled with strategy, consistency, and professional brand presentation.",
    types: ["Instagram management", "Facebook management", "Content calendars", "Profile optimization", "Community engagement", "Monthly reports"],
    deliverables: ["Posting schedule", "Caption writing", "Hashtag planning", "Creative coordination", "DM/comment guidance", "Growth reporting"],
    process: ["Brand audit", "Monthly content plan", "Posting and engagement", "Review and improvements"],
    bestFor: "Businesses that want consistent posting and better brand trust without managing everything themselves."
  },
  {
    group: "Get Found",
    title: "LinkedIn Management",
    image: "https://images.unsplash.com/photo-1611944212129-29977ae1398c?w=900&auto=format&fit=crop",
    intro: "A focused LinkedIn presence for founders and brands that want authority, relationships, and qualified opportunities.",
    types: ["Founder profiles", "Company pages", "Content strategy", "Thought leadership", "Profile optimization", "Engagement support"],
    deliverables: ["Positioning direction", "Monthly content plan", "Post writing", "Creative coordination", "Publishing support", "Performance review"],
    process: ["Profile and audience audit", "Voice and content planning", "Publishing and engagement", "Monthly learning and refinement"],
    bestFor: "Founders, consultants, B2B teams, and international service businesses building trust and demand on LinkedIn."
  },
  {
    group: "Build",
    title: "Video Editing",
    image: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=900&auto=format&fit=crop",
    intro: "Professional edits for reels, ads, YouTube, launches, testimonials, and brand storytelling.",
    types: ["Reels editing", "YouTube editing", "Ad creatives", "Promo videos", "Event highlights", "Motion text videos"],
    deliverables: ["Cuts and pacing", "Transitions", "Captions", "Color correction", "Music sync", "Export for platforms"],
    process: ["Raw footage review", "Edit style selection", "First cut", "Revisions and final export"],
    bestFor: "Creators, coaches, local brands, eCommerce stores, and businesses running social campaigns."
  },
  {
    group: "Grow",
    title: "Consultancy",
    image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=900&auto=format&fit=crop",
    intro: "Practical digital guidance for business owners who want clarity before spending on tech or marketing.",
    types: ["Startup guidance", "Digital audit", "Marketing roadmap", "Website audit", "Brand positioning", "Growth planning"],
    deliverables: ["Problem diagnosis", "Action roadmap", "Tool recommendations", "Priority list", "Budget guidance", "Execution plan"],
    process: ["Discovery call", "Current setup review", "Strategy document", "Implementation guidance"],
    bestFor: "Founders and businesses that need direction, planning, and smarter digital decisions."
  },
  {
    group: "Get Found",
    title: "SEO & Digital Marketing",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=900&auto=format&fit=crop",
    intro: "A complete growth system combining SEO, content, ads, analytics, and conversion-focused strategy.",
    types: ["SEO", "Content marketing", "Lead generation", "Funnel strategy", "Analytics setup", "Conversion optimization"],
    deliverables: ["Growth plan", "Keyword strategy", "Content direction", "Campaign tracking", "Monthly reporting", "Optimization actions"],
    process: ["Business audit", "Audience and keyword research", "Campaign execution", "Data-led improvements"],
    bestFor: "Businesses that want predictable online growth and a long-term digital acquisition system."
  },
  {
    group: "Get Found",
    title: "Google Business Profile",
    image: "https://images.unsplash.com/photo-1524661135-423995f22d0b?w=900&auto=format&fit=crop",
    intro: "Local visibility setup so nearby customers can find, trust, and contact your business faster.",
    types: ["Profile setup", "Profile optimization", "Local SEO", "Review strategy", "Map ranking support", "Post updates"],
    deliverables: ["Category optimization", "Service/product setup", "Business description", "Photo guidance", "Review flow", "Local keyword plan"],
    process: ["Profile audit", "Optimization setup", "Local content updates", "Ranking and review monitoring"],
    bestFor: "Clinics, restaurants, salons, stores, agencies, consultants, and local service businesses."
  },
  {
    group: "Grow",
    title: "Performance Advertising",
    image: "https://images.unsplash.com/photo-1557838923-2985c318be48?w=900&auto=format&fit=crop",
    intro: "Paid campaigns built for qualified leads, better targeting, and cleaner conversion tracking.",
    types: ["Google Ads", "Meta Ads", "Lead campaigns", "Retargeting", "Launch campaigns", "Offer campaigns"],
    deliverables: ["Campaign setup", "Ad copy", "Audience targeting", "Creative guidance", "Pixel/tracking setup", "Performance optimization"],
    process: ["Offer and audience planning", "Campaign setup", "Launch monitoring", "Budget and creative optimization"],
    bestFor: "Businesses ready to generate leads, bookings, traffic, or sales with measurable ad spend."
  }
];

const serviceGroups = [
  {
    name: "Build",
    number: "01",
    headline: "Create a digital foundation people trust.",
    description: "Websites, applications, and content assets designed to make your business look credible and work smoothly on every screen."
  },
  {
    name: "Get Found",
    number: "02",
    headline: "Show up when the right customers search.",
    description: "Search, local discovery, and authority-building systems that put your business in front of people already looking for it."
  },
  {
    name: "Grow",
    number: "03",
    headline: "Turn attention into measurable demand.",
    description: "Campaigns, social media, advertising, and strategy focused on generating qualified enquiries and sustainable growth."
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
          Build, get found, and <span className="gold-glow">grow</span>
        </motion.h2>

        <p>
          Explore the capabilities we connect around your business goals, audience, and growth stage.
        </p>
      </div>

      <div className="service-groups">
        {serviceGroups.map((group) => {
          const groupedServices = services.filter((service) => service.group === group.name);

          return (
            <section className={`service-group service-group-${group.name.toLowerCase().replace(" ", "-")}`} id={`service-group-${group.number}`} key={group.name} aria-labelledby={`service-group-title-${group.number}`}>
              <header className="service-group-header">
                <span className="service-group-number">{group.number}</span>
                <div className="service-group-title-block">
                  <p className="service-group-name">{group.name}</p>
                  <h3 id={`service-group-title-${group.number}`}>{group.headline}</h3>
                </div>
                <p className="service-group-description">{group.description}</p>
              </header>

              <div className="services-grid-modern">
                {groupedServices.map((service, index) => (
                  <article
                    className="service-card-premium"
                    key={service.title}
                  >
                    <div className="card-image-wrapper">
                      <img src={service.image} alt={service.title} loading="lazy" />
                      <div className="card-overlay-gradient"></div>
                      <span className="service-card-category">{group.name}</span>
                    </div>

                    <div className="card-content-area">
                      <span className="service-index">{group.number}.{index + 1}</span>
                      <h3>{service.title}</h3>
                      <p>{service.intro}</p>

                      <button
                        className="cta-button-service"
                        onClick={() => setActiveService(service)}
                      >
                        <span>Explore service</span>
                        <FaArrowRight />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          );
        })}
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
                  <span className="service-modal-kicker">{activeService.group} / Service detail</span>
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
