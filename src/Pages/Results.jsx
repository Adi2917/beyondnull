import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowRight, FaChevronLeft, FaChevronRight, FaCheck, FaImages, FaXmark } from "react-icons/fa6";
import Navbar from "../Components/Navbar/Navbar";
import Footer from "../Components/Footer/Footer";
import "./Results.css";

const screenshotSet = (folder, count) => Array.from(
  { length: count },
  (_, index) => `/client-work/${folder}/${String(index + 1).padStart(2, "0")}.png`
);

const caseStudies = [
  {
    client: "Yeti Motors",
    industry: "Pre-Owned Automotive",
    duration: "3 months",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1400&auto=format&fit=crop",
    screenshots: screenshotSet("yeti-motors", 10),
    objective: "Increase local reach and generate qualified enquiries for pre-owned cars.",
    approach: "High-engagement short-form video content paired with audience-led performance campaigns and continuous creative optimization.",
    highlights: [
      "Multiple short-form videos crossed 300K views",
      "Stronger local awareness and a consistent enquiry flow"
    ],
    metrics: [
      { value: "5.6M", label: "Views" },
      { value: "2.9M", label: "Reach" },
      { value: "65.7K", label: "Content interactions" },
      { value: "3.5K", label: "Link clicks" },
      { value: "13.3K", label: "Visits" },
      { value: "1,129", label: "Intake leads" }
    ]
  },
  {
    client: "Hotel & Restaurant Bella Casa",
    industry: "Hospitality & Restaurant",
    duration: "Under 3 months",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1400&auto=format&fit=crop",
    screenshots: screenshotSet("bella-casa", 26),
    objective: "Build city-wide awareness for a newly launched restaurant and increase local footfall.",
    approach: "A local visibility system combining consistent social content, attention-led creatives, and targeted awareness promotions.",
    highlights: [
      "Rs 20L+ in reported restaurant sales within three months",
      "Rapid increase in local awareness, engagement, and footfall"
    ],
    metrics: [
      { value: "4.1M", label: "Views" },
      { value: "2.2M", label: "Reach" },
      { value: "70.5K", label: "Content interactions" },
      { value: "18.7K", label: "Link clicks" },
      { value: "24.9K", label: "Visits" },
      { value: "1,019", label: "Intake leads" }
    ]
  },
  {
    client: "Aravali Marbles",
    industry: "Tiles, Sanitaryware & Interiors",
    duration: "6 months",
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1400&auto=format&fit=crop",
    screenshots: screenshotSet("aravali-marbles", 14),
    objective: "Expand Facebook reach and create a stronger digital presence for a multi-brand building materials showroom.",
    approach: "A combined organic content and performance advertising program built around product discovery, reach, and local relevance.",
    highlights: [
      "Facebook audience grew from 4K to more than 40K followers",
      "Significantly improved visibility across the local market"
    ],
    metrics: [
      { value: "6.3M", label: "Views" },
      { value: "62.4K", label: "Content interactions" },
      { value: "1.7K", label: "Link clicks" },
      { value: "15.2K", label: "Visits" },
      { value: "39.1K", label: "Follows" }
    ]
  },
  {
    client: "Angika Industries",
    industry: "Industrial Machinery & Finance",
    duration: "2 months",
    image: "/angika-industries-machinery.png",
    screenshots: screenshotSet("angika-industries", 4),
    objective: "Generate qualified enquiries for industrial machinery and PMEGP/PMFME government-scheme loan assistance.",
    approach: "Targeted lead campaigns designed around entrepreneur intent, machinery requirements, and PMEGP/PMFME finance consultation demand.",
    highlights: [
      "A strong pipeline for projects, machinery, and loan consultations",
      "Qualified business enquiries generated within two months"
    ],
    metrics: [
      { value: "1,173", label: "Intake leads" }
    ]
  }
];

const serviceGroups = [
  { number: "01", name: "Build", services: ["Website Development", "App Development", "Video Editing"] },
  { number: "02", name: "Get Found", services: ["SEO & Digital Marketing", "Google Business Profile", "LinkedIn Management"] },
  { number: "03", name: "Grow", services: ["Social Media Marketing", "Social Media Management", "Performance Advertising", "Consultancy"] }
];

function Results() {
  const [gallery, setGallery] = useState(null);
  const [activeScreenshot, setActiveScreenshot] = useState(0);

  const closeGallery = () => setGallery(null);
  const showPrevious = () => setActiveScreenshot((current) => (
    current === 0 ? gallery.screenshots.length - 1 : current - 1
  ));
  const showNext = () => setActiveScreenshot((current) => (
    current === gallery.screenshots.length - 1 ? 0 : current + 1
  ));

  useEffect(() => {
    if (!gallery) return undefined;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") closeGallery();
      if (event.key === "ArrowLeft") {
        setActiveScreenshot((current) => current === 0 ? gallery.screenshots.length - 1 : current - 1);
      }
      if (event.key === "ArrowRight") {
        setActiveScreenshot((current) => current === gallery.screenshots.length - 1 ? 0 : current + 1);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [gallery]);

  const openGallery = (study) => {
    setActiveScreenshot(0);
    setGallery(study);
  };

  return (
    <div className="results-page">
      <Navbar />
      <main>
        <section className="results-hero">
          <div className="results-hero-copy">
            <span className="results-eyebrow">Selected client outcomes</span>
            <h1>Work measured by <span>business movement.</span></h1>
            <p>Across automotive, hospitality, building materials, and industrial services, BeyondNull connects content and performance marketing to visibility, enquiries, and revenue.</p>
            <div className="results-hero-actions">
              <a href="#case-studies" className="results-primary">Explore case studies <FaArrowRight /></a>
              <Link to="/contact" className="results-secondary">Discuss your growth goal</Link>
            </div>
          </div>
          <div className="results-scoreboard" aria-label="Aggregated campaign results">
            <span className="results-scoreboard-label">Results generated for clients</span>
            <div><strong>16M+</strong><span>Content views</span></div>
            <div><strong>3,321</strong><span>Intake leads</span></div>
            <div><strong>10M+</strong><span>Revenue generated for clients</span></div>
            <div><strong>50K+</strong><span>Followers across Facebook &amp; Instagram</span></div>
          </div>
        </section>

        <section className="results-intro" aria-label="BeyondNull results process">
          <p>
            <span>Strong creative earns attention</span>
            <FaArrowRight aria-hidden="true" />
            <span>Clear targeting creates demand</span>
            <FaArrowRight aria-hidden="true" />
            <span>Consistent optimization delivers measurable progress</span>
          </p>
        </section>

        <section className="case-study-section" id="case-studies">
          <header className="case-study-heading">
            <div>
              <span className="results-eyebrow">Case studies</span>
              <h2>Four businesses. Four different growth problems.</h2>
            </div>
            <p>Each engagement began with a different commercial objective, then combined content, distribution, and campaign learning around that goal.</p>
          </header>

          <div className="case-study-list">
            {caseStudies.map((study, index) => (
              <article className="case-study" key={study.client}>
                <div className="case-study-media" data-client={study.client}>
                  <img src={study.image} alt={`${study.client} ${study.industry} case study`} loading={index === 0 ? "eager" : "lazy"} onError={(event) => { event.currentTarget.hidden = true; }} />
                  <span>{String(index + 1).padStart(2, "0")} / 04</span>
                </div>
                <div className="case-study-content">
                  <div className="case-study-meta"><span>{study.industry}</span><span>{study.duration}</span></div>
                  <h3>{study.client}</h3>
                  <div className="case-study-story">
                    <div><strong>Objective</strong><p>{study.objective}</p></div>
                    <div><strong>Approach</strong><p>{study.approach}</p></div>
                  </div>
                  <div className="case-highlights">
                    <strong>Reported outcomes</strong>
                    <ul>{study.highlights.map((highlight) => <li key={highlight}><FaCheck /><span>{highlight}</span></li>)}</ul>
                  </div>
                  <div className={`case-metrics metrics-${study.metrics.length}`}>
                    {study.metrics.map((metric) => <div key={metric.label}><strong>{metric.value}</strong><span>{metric.label}</span></div>)}
                  </div>
                  <span className="case-metrics-note">Reported dashboard snapshot</span>
                  <button type="button" className="case-study-link" onClick={() => openGallery(study)}>
                    <FaImages /> View real screenshots <span>{study.screenshots.length}</span>
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="results-services">
          <header><span className="results-eyebrow">Current capabilities</span><h2>One connected service system.</h2></header>
          <div className="results-service-grid">
            {serviceGroups.map((group) => (
              <article key={group.name}><span>{group.number}</span><h3>{group.name}</h3><ul>{group.services.map((service) => <li key={service}><FaCheck /> {service}</li>)}</ul></article>
            ))}
          </div>
        </section>

        <section className="results-cta">
          <div><span className="results-eyebrow">Your next result</span><h2>Let's identify the clearest growth opportunity in your business.</h2></div>
          <Link to="/contact">Start a conversation <FaArrowRight /></Link>
        </section>
      </main>
      <Footer />

      {gallery && (
        <div className="client-gallery-backdrop" role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget) closeGallery();
        }}>
          <section className="client-gallery" role="dialog" aria-modal="true" aria-labelledby="client-gallery-title">
            <header className="client-gallery-header">
              <div>
                <span>Real campaign screenshots</span>
                <h2 id="client-gallery-title">{gallery.client}</h2>
              </div>
              <div className="client-gallery-status">
                <span>{String(activeScreenshot + 1).padStart(2, "0")} / {String(gallery.screenshots.length).padStart(2, "0")}</span>
                <button type="button" onClick={closeGallery} aria-label="Close screenshot gallery"><FaXmark /></button>
              </div>
            </header>

            <div className="client-gallery-viewer">
              <button type="button" className="gallery-arrow gallery-arrow-left" onClick={showPrevious} aria-label="Previous screenshot"><FaChevronLeft /></button>
              <img src={gallery.screenshots[activeScreenshot]} alt={`${gallery.client} campaign result screenshot ${activeScreenshot + 1}`} />
              <button type="button" className="gallery-arrow gallery-arrow-right" onClick={showNext} aria-label="Next screenshot"><FaChevronRight /></button>
            </div>

            <div className="client-gallery-thumbnails" aria-label="Screenshot thumbnails">
              {gallery.screenshots.map((screenshot, index) => (
                <button
                  type="button"
                  className={index === activeScreenshot ? "active" : ""}
                  onClick={() => setActiveScreenshot(index)}
                  aria-label={`View screenshot ${index + 1}`}
                  aria-current={index === activeScreenshot ? "true" : undefined}
                  key={screenshot}
                >
                  <img src={screenshot} alt="" loading="lazy" />
                  <span>{String(index + 1).padStart(2, "0")}</span>
                </button>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

export default Results;
