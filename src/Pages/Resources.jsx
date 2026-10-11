import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaArrowRight,
  FaArrowUpRightFromSquare,
  FaBookOpen,
  FaChartLine,
  FaClock,
  FaLightbulb
} from "react-icons/fa6";
import Navbar from "../Components/Navbar/Navbar";
import Footer from "../Components/Footer/Footer";
import { openDiscoveryCall } from "../utils/openDiscoveryCall";
import { getPublishedResources } from "../services/authService";
import "./Resources.css";

const blogs = [
  {
    slug: "digital-growth-system",
    category: "Growth Strategy",
    readTime: "7 min read",
    title: "How to Build a Digital Growth System That Generates Leads",
    excerpt: "Connect visibility, trust, conversion, and follow-up into one practical system instead of treating every channel as a separate task.",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1400&auto=format&fit=crop",
    intro: "Sustainable digital growth rarely comes from one campaign or one platform. It comes from a connected system in which every touchpoint moves the right customer closer to a decision.",
    sections: [
      {
        heading: "Start with one commercial outcome",
        paragraphs: [
          "Choose the result that matters now: qualified enquiries, booked consultations, store visits, product sales, or repeat business. A precise outcome keeps content, media, and website decisions aligned.",
          "Define who should respond, what action they should take, and how your team will measure a useful lead. Reach without this definition can look impressive while creating very little business value."
        ]
      },
      {
        heading: "Build the four connected layers",
        paragraphs: [
          "Visibility brings the business in front of relevant people. Trust gives them a reason to pay attention. Conversion makes the next step clear. Follow-up turns interest into a real conversation.",
          "Your website, social content, local profile, ads, and sales process should support these layers together. When one layer is weak, the entire system loses momentum."
        ],
        bullets: ["Visibility: search, social content, local discovery, and paid reach", "Trust: proof, useful expertise, case studies, and consistent presentation", "Conversion: focused landing pages, clear offers, and simple contact paths", "Follow-up: fast responses, lead qualification, and a repeatable sales process"]
      },
      {
        heading: "Improve the system, not just the advertisement",
        paragraphs: [
          "Review lead quality, response time, landing-page behaviour, creative performance, and sales feedback together. The best optimization decision is often outside the advertising dashboard.",
          "A connected review process helps the team invest more in what creates qualified demand and remove work that only creates activity."
        ]
      }
    ]
  },
  {
    slug: "meta-ads-local-business",
    category: "Performance Marketing",
    readTime: "8 min read",
    title: "Meta Ads for Local Businesses: A Practical Lead Framework",
    excerpt: "A clear approach to offers, targeting, creative testing, lead quality, and follow-up for local service businesses.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1400&auto=format&fit=crop",
    intro: "Meta Ads can create local demand quickly, but only when the campaign is built around a credible offer and a disciplined lead-handling process.",
    sections: [
      {
        heading: "Make the offer easy to understand",
        paragraphs: ["A customer should know what you provide, who it is for, and why they should respond within a few seconds. Specific offers usually create stronger intent than broad brand messages."],
        bullets: ["Lead with the customer problem", "State the service and location clearly", "Give one simple next step", "Use real proof where permission is available"]
      },
      {
        heading: "Test creative angles before scaling budget",
        paragraphs: [
          "Test different reasons to care: the problem, the desired outcome, a demonstration, a customer story, or an offer. Change one meaningful element at a time so the result teaches you something.",
          "A winning advertisement is not only the one with the cheapest form submission. Compare lead relevance, contact rate, appointments, and eventual sales."
        ]
      },
      {
        heading: "Treat follow-up as part of the campaign",
        paragraphs: ["Respond quickly, use a short qualification script, and record the result of every enquiry. This feedback helps marketing refine its targeting and gives sales a cleaner pipeline."],
        bullets: ["Assign every new lead", "Contact through phone and WhatsApp", "Track qualified, unqualified, and unreachable leads", "Review objections with the creative team"]
      }
    ]
  },
  {
    slug: "website-that-converts",
    category: "Web Development",
    readTime: "6 min read",
    title: "What Makes a Business Website Convert Visitors Into Enquiries?",
    excerpt: "The essential structure behind a fast, credible, mobile-first website that helps potential customers take action.",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1400&auto=format&fit=crop",
    intro: "A business website should do more than look modern. It should answer the visitor's key questions, reduce uncertainty, and make the next action feel natural.",
    sections: [
      {
        heading: "Communicate the offer immediately",
        paragraphs: ["The first screen should identify the service, customer, location when relevant, and primary value. Avoid making visitors decode clever language before they understand the business."]
      },
      {
        heading: "Design around the mobile decision journey",
        paragraphs: ["Most local prospects will scan, compare, call, or message from a phone. Use readable text, stable layouts, fast media, familiar controls, and contact actions that work with one tap."],
        bullets: ["Clear service hierarchy", "Real work and credible proof", "Visible phone, WhatsApp, and enquiry options", "Fast loading and accessible forms", "Focused calls to action"]
      },
      {
        heading: "Measure meaningful actions",
        paragraphs: ["Track form submissions, calls, WhatsApp clicks, booked consultations, and the pages that support them. Good analytics should reveal which sources and messages create useful conversations, not just visits."]
      }
    ]
  },
  {
    slug: "social-content-strategy",
    category: "Social Media",
    readTime: "7 min read",
    title: "A Social Content Strategy for Reach, Trust, and Demand",
    excerpt: "Plan content by business purpose so every post supports discovery, credibility, or conversion instead of filling a calendar.",
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=1400&auto=format&fit=crop",
    intro: "Consistent posting is useful only when the content gives the audience a reason to notice, remember, and eventually choose the business.",
    sections: [
      {
        heading: "Use three content jobs",
        paragraphs: ["Discovery content earns attention, authority content demonstrates understanding, and decision content helps a prospect take the next step. A healthy calendar balances all three."],
        bullets: ["Discovery: strong hooks, relatable problems, useful short-form ideas", "Authority: demonstrations, explanations, process, and informed opinions", "Decision: case studies, offers, FAQs, objections, and clear calls to action"]
      },
      {
        heading: "Build repeatable content formats",
        paragraphs: ["Create a small set of formats your team can produce well: founder insights, customer questions, before-and-after stories, behind-the-scenes process, and educational series. Repetition builds recognition when the substance remains useful."]
      },
      {
        heading: "Review business signals",
        paragraphs: ["Reach and engagement explain distribution, while profile visits, messages, website actions, and qualified enquiries explain commercial response. Review both sets of signals before changing direction."]
      }
    ]
  },
  {
    slug: "google-business-profile-checklist",
    category: "Local Discovery",
    readTime: "5 min read",
    title: "Google Business Profile Checklist for Local Visibility",
    excerpt: "A practical checklist for helping nearby customers find, evaluate, and contact a local business through Google.",
    image: "https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1400&auto=format&fit=crop",
    intro: "A complete Google Business Profile can shorten the journey between local search and direct contact. Accuracy, relevance, and ongoing activity matter more than one-time setup.",
    sections: [
      {
        heading: "Complete the business information",
        paragraphs: ["Use the real business name, correct primary category, consistent contact details, accurate hours, service areas, and a concise description that explains the offer naturally."],
        bullets: ["Choose the closest primary category", "Add relevant services and products", "Check phone, website, map pin, and opening hours", "Use original business and work photos"]
      },
      {
        heading: "Build a genuine review process",
        paragraphs: ["Ask real customers for honest reviews after a successful experience. Reply professionally, mention useful context naturally, and never manufacture feedback."]
      },
      {
        heading: "Keep the profile active and measurable",
        paragraphs: ["Publish relevant updates, answer common questions, refresh photos, and review calls, website clicks, direction requests, and customer messages. Connect profile activity with actual enquiries wherever possible."]
      }
    ]
  },
  {
    slug: "organic-and-paid-growth",
    category: "Marketing Strategy",
    readTime: "6 min read",
    title: "Organic and Paid Growth Work Better Together",
    excerpt: "Understand the different jobs of organic content and paid distribution, and how to combine them without duplicating effort.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e8f71?w=1400&auto=format&fit=crop",
    intro: "Organic and paid marketing solve different parts of the growth problem. Organic activity builds familiarity and learning over time; paid distribution creates controlled reach and faster testing.",
    sections: [
      {
        heading: "Let organic content discover strong messages",
        paragraphs: ["Questions, stories, demonstrations, and opinions that attract meaningful organic response can reveal what the audience already cares about. These lessons can strengthen paid creative."]
      },
      {
        heading: "Use paid media to control distribution",
        paragraphs: ["Paid campaigns help a business reach defined audiences, test offers, retarget interested people, and create demand beyond its existing followers. The landing and follow-up experience must be ready before scaling."],
        bullets: ["Promote proven ideas", "Match creative to audience awareness", "Retarget useful engagement", "Measure qualified outcomes"]
      },
      {
        heading: "Share one learning loop",
        paragraphs: ["Content, advertising, website, and sales teams should review the same customer questions and lead feedback. Shared learning makes every channel more relevant and reduces repeated mistakes."]
      }
    ]
  }
];

const resourceTypes = [
  { icon: <FaChartLine />, title: "Growth Playbooks", text: "Frameworks for campaigns, lead generation, conversion, and measurable growth." },
  { icon: <FaBookOpen />, title: "Business Guides", text: "Clear guidance for websites, local discovery, social media, and paid marketing." },
  { icon: <FaLightbulb />, title: "Field Insights", text: "Practical lessons shaped around the growth problems businesses face every day." }
];

const beyondNullProducts = [
  {
    name: "Connect Your School",
    category: "School Management Platform",
    url: "https://connectyourschool.in",
    logo: "/products/connect-your-school.png",
    theme: "school",
    description: "A secure school management platform for student records, fees, results, notices, and connected school administration.",
    features: ["Student records", "Fees and results", "Notices and administration"]
  },
  {
    name: "Social Controller",
    category: "Social Media Workspace",
    url: "https://socialcontroller.in",
    logo: "/products/social-controller.png",
    theme: "social",
    description: "A focused workspace for planning, creating, organizing, and publishing brand content from one streamlined system.",
    features: ["Content planning", "Creative workflow", "Publishing operations"]
  }
];

function ArticlePage({ blog }) {
  return (
    <div className="resources-page article-page">
      <Navbar />
      <main>
        <article className="resource-article">
          <header className="article-header">
            <Link to="/resources" className="article-back"><FaArrowLeft /> All resources</Link>
            {blog.logo && <img className="article-brand-logo" src={blog.logo} alt="" />}
            <div className="article-meta"><span>{blog.category}</span><span><FaClock /> {blog.readTime}</span></div>
            <h1>{blog.title}</h1>
            {blog.subtitle && <h2 className="article-subtitle">{blog.subtitle}</h2>}
            <p>{blog.intro}</p>
          </header>
          {blog.image && <div className="article-cover"><img src={blog.image} alt={blog.title} /></div>}
          <div className="article-layout">
            <aside>
              <span>BeyondNull Editorial</span>
              <strong>Practical guidance for digital business growth.</strong>
              <button type="button" onClick={openDiscoveryCall}>Discuss your growth goal <FaArrowRight /></button>
            </aside>
            <div className="article-body">
              {blog.sections.map((section) => (
                <section key={section.heading || section.paragraphs?.[0]}>
                  {section.heading && <h2>{section.heading}</h2>}
                  {(section.paragraphs || []).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                  {section.bullets && <ul>{section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>}
                </section>
              ))}
            </div>
          </div>
          {blog.gallery?.length > 0 && <section className="article-gallery" aria-label="Resource gallery">{blog.gallery.map((image, index) => <img key={image} src={image} alt={`${blog.title} visual ${index + 1}`} loading="lazy" />)}</section>}
        </article>
        <section className="article-next">
          <span>Continue learning</span>
          <h2>Explore more practical growth resources.</h2>
          <Link to="/resources">View all resources <FaArrowRight /></Link>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function Resources() {
  const { slug } = useParams();
  const [managedResources, setManagedResources] = useState([]);
  const [resourcesLoaded, setResourcesLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    getPublishedResources().then(({ data }) => {
      if (active) setManagedResources(data || []);
    }).finally(() => {
      if (active) setResourcesLoaded(true);
    });
    return () => { active = false; };
  }, []);

  const allBlogs = [...managedResources, ...blogs];
  const activeBlog = slug ? allBlogs.find((blog) => blog.slug === slug) : null;

  if (slug && !resourcesLoaded && !blogs.some((blog) => blog.slug === slug)) {
    return <div className="resources-page"><Navbar /><main className="resource-loading"><strong>Loading resource...</strong></main><Footer /></div>;
  }

  if (activeBlog) return <ArticlePage blog={activeBlog} />;

  const featuredBlog = allBlogs[0];
  const libraryBlogs = allBlogs.slice(1);

  return (
    <div className="resources-page">
      <Navbar />
      <main>
        <section className="resources-hero">
          <span>BeyondNull Resources</span>
          <h1>Practical ideas for measurable digital growth.</h1>
          <p>Clear guides for business owners and teams working on visibility, stronger digital experiences, qualified leads, and sustainable demand.</p>
        </section>

        <section className="resource-types">
          {resourceTypes.map((resource, index) => (
            <article key={resource.title}>
              <div>{resource.icon}</div><span>0{index + 1}</span><h2>{resource.title}</h2><p>{resource.text}</p>
            </article>
          ))}
        </section>

        <section className="product-showcase">
          <header className="product-showcase-header">
            <div>
              <span>Built by BeyondNull</span>
              <h2>Digital products designed for real operations.</h2>
            </div>
            <p>Explore platforms developed by our team to simplify school administration and modern social media workflows.</p>
          </header>

          <div className="product-grid">
            {beyondNullProducts.map((product, index) => (
              <article className={`product-card product-card-${product.theme}`} key={product.name}>
                <div className="product-card-visual">
                  <span>0{index + 1}</span>
                  <img src={product.logo} alt={`${product.name} logo`} />
                </div>
                <div className="product-card-content">
                  <span>{product.category}</span>
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  <ul>{product.features.map((feature) => <li key={feature}>{feature}</li>)}</ul>
                  <a href={product.url} target="_blank" rel="noopener noreferrer">
                    Visit {product.name} <FaArrowUpRightFromSquare />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="featured-resource">
          <div className="featured-resource-image"><img src={featuredBlog.image || featuredBlog.logo || "/beyondnull-official-logo.jpg"} alt={featuredBlog.title} /></div>
          <div className="featured-resource-copy">
            <span>Featured guide</span>
            <h2>{featuredBlog.title}</h2>
            <p>{featuredBlog.excerpt || featuredBlog.subtitle}</p>
            <div><span>{featuredBlog.category}</span><span><FaClock /> {featuredBlog.readTime}</span></div>
            <Link to={`/resources/${featuredBlog.slug}`}>Read the guide <FaArrowRight /></Link>
          </div>
        </section>

        <section className="resource-library">
          <header><span>Resource library</span><h2>Ideas your team can put to work.</h2><p>Built around common digital growth decisions, without unnecessary jargon.</p></header>
          <div className="resource-grid">
            {libraryBlogs.map((blog, index) => (
              <article className="resource-card" key={blog.slug}>
                <Link className="resource-card-image" to={`/resources/${blog.slug}`} aria-label={`Read ${blog.title}`}>
                  <img src={blog.image || blog.logo || "/beyondnull-official-logo.jpg"} alt="" loading="lazy" /><span>{String(index + 2).padStart(2, "0")}</span>
                </Link>
                <div className="resource-card-content">
                  <div className="resource-card-meta"><span>{blog.category}</span><span><FaClock /> {blog.readTime}</span></div>
                  <h3><Link to={`/resources/${blog.slug}`}>{blog.title}</Link></h3>
                  <p>{blog.excerpt || blog.subtitle}</p>
                  <Link className="resource-card-link" to={`/resources/${blog.slug}`}>Read article <FaArrowUpRightFromSquare /></Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="resources-callout">
          <div><span>Need a tailored answer?</span><h2>Bring us the business problem you are trying to solve.</h2></div>
          <button type="button" onClick={openDiscoveryCall}>Book a free discovery call <FaArrowRight /></button>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default Resources;
