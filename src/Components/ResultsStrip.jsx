import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa6";
import "./ResultsStrip.css";

const metrics = [
  ["15M+", "Content views"],
  ["2K+", "Qualified leads"],
  ["₹20L+", "Reported sales"],
  ["4", "Industry case studies"]
];

function ResultsStrip() {
  return (
    <section className="home-results-strip" aria-label="Selected BeyondNull client outcomes">
      <div className="home-results-heading">
        <span>Selected outcomes</span>
        <h2>Proof behind the strategy.</h2>
        <Link to="/results">View client results <FaArrowRight /></Link>
      </div>
      <div className="home-results-metrics">
        {metrics.map(([value, label]) => (
          <div key={label}><strong>{value}</strong><span>{label}</span></div>
        ))}
      </div>
    </section>
  );
}

export default ResultsStrip;
