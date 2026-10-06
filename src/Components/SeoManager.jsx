import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const pageMeta = {
  "/": {
    title: "Digital Marketing Agency in Bangalore | BeyondNull",
    description: "BeyondNull is a digital marketing agency in Bangalore offering web development, app development, SEO, social media marketing, LinkedIn management, Google Business Profile and performance advertising."
  },
  "/about": {
    title: "Who We Are | BeyondNull Digital Growth Company",
    description: "Meet BeyondNull, a Bangalore-based digital marketing and consulting company combining strategy, technology, content, SEO and performance marketing for measurable growth."
  },
  "/services": {
    title: "Web Development, SEO & Digital Marketing Services | BeyondNull",
    description: "Explore BeyondNull services for website and app development, SEO, social media, LinkedIn management, Google Business Profile, video editing and performance advertising in Bangalore."
  },
  "/results": {
    title: "Digital Marketing Case Studies & Results | BeyondNull",
    description: "Explore BeyondNull digital marketing case studies across automotive, hospitality, building materials and industrial services, including content views, qualified leads, audience growth and reported sales outcomes."
  },
  "/resources": {
    title: "Digital Growth Resources | BeyondNull",
    description: "Explore practical BeyondNull resources on websites, SEO, social media, performance marketing, lead generation and measurable business growth."
  },
  "/contact": {
    title: "Contact BeyondNull | Digital Marketing Agency Bangalore",
    description: "Contact BeyondNull in Bangalore for websites, apps, SEO, social media management, LinkedIn marketing, paid advertising and digital growth consulting."
  }
};

function SeoManager() {
  const { pathname } = useLocation();

  useEffect(() => {
    const metaKey = pathname.startsWith("/resources/") ? "/resources" : pathname;
    const meta = pageMeta[metaKey];
    if (!meta) return;

    document.title = meta.title;
    const description = document.querySelector('meta[name="description"]');
    const canonical = document.querySelector('link[rel="canonical"]');
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDescription = document.querySelector('meta[property="og:description"]');
    const ogUrl = document.querySelector('meta[property="og:url"]');
    const url = `https://beyondnull.in${pathname === "/" ? "/" : pathname}`;

    description?.setAttribute("content", meta.description);
    canonical?.setAttribute("href", url);
    ogTitle?.setAttribute("content", meta.title);
    ogDescription?.setAttribute("content", meta.description);
    ogUrl?.setAttribute("content", url);
  }, [pathname]);

  return null;
}

export default SeoManager;
