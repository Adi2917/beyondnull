import "./BrandLogo.css";

function BrandLogo({ compact = false, label = "BeyondNull" }) {
  return (
    <div className={`brandLogo ${compact ? "compact" : ""}`} aria-label={label}>
      <div className="brandLogo-mark">
        <img src="/beyondnull-official-logo.jpg" alt="" aria-hidden="true" />
      </div>
      {!compact && (
        <div className="brandLogo-text">
          <strong>BEYOND</strong>
          <span>NULL</span>
        </div>
      )}
    </div>
  );
}

export default BrandLogo;
