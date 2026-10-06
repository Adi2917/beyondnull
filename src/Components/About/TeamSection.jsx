import { motion as Motion } from "framer-motion";
import { FaLinkedinIn } from "react-icons/fa";
import piyushPhoto from "../../assets/team/piyush-singh.png";
import shubhamPhoto from "../../assets/team/shubham-kumar.png";
import adityaPhoto from "../../assets/team/aditya-kumar.jpeg";
import "./TeamSection.css";

const team = [
  {
    name: "Piyush Singh",
    role: "Founder | Marketing & Growth Strategy",
    bio: "$110K+ generated through Meta Ads and funnels. Helping businesses turn marketing into measurable growth.",
    photo: piyushPhoto,
    linkedin: "https://www.linkedin.com/in/piyush-singh-132010204/"
  },
  {
    name: "Shubham Kumar",
    role: "Founder",
    bio: "Building BeyondNull's digital capabilities and supporting the team in creating practical, growth-focused solutions.",
    photo: shubhamPhoto,
    linkedin: "https://www.linkedin.com/in/shubham-kumar-a54580252/"
  },
  {
    name: "Aditya Kumar",
    role: "Co-Founder",
    bio: "Supporting product, technology, and delivery across BeyondNull's web, application, and digital growth engagements.",
    photo: adityaPhoto,
    linkedin: "https://www.linkedin.com/in/aditya-kumar-7a431727a/"
  }
];

function TeamSection() {
  return (
    <section className="team-section" id="team">
      <div className="team-container">
        <div className="team-heading">
          <span className="section-kicker">The people behind BeyondNull</span>
          <h2>Strategy, creative thinking, and technology under one roof.</h2>
          <p>
            Meet the founding team building BeyondNull from Bangalore for businesses that want focused, measurable digital growth.
          </p>
        </div>

        <div className="team-grid">
          {team.map((member, index) => (
            <Motion.article
              className="team-card"
              key={member.name}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="team-photo-wrap">
                <img src={member.photo} alt={`${member.name}, ${member.role} at BeyondNull`} loading="lazy" />
              </div>
              <div className="team-card-content">
                <div>
                  <h3>{member.name}</h3>
                  <p className="team-role">{member.role}</p>
                </div>
                <a href={member.linkedin} target="_blank" rel="noopener noreferrer" aria-label={`${member.name} on LinkedIn`}>
                  <FaLinkedinIn />
                </a>
              </div>
              <p className="team-bio">{member.bio}</p>
            </Motion.article>
          ))}
        </div>

        <a className="team-company-link" href="https://www.linkedin.com/company/beyondnull/" target="_blank" rel="noopener noreferrer">
          Follow BeyondNull on LinkedIn <FaLinkedinIn />
        </a>
      </div>
    </section>
  );
}

export default TeamSection;
