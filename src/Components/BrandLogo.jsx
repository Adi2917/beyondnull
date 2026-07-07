import "./BrandLogo.css";

function BrandLogo({ compact = false, label = "BeyondNull" }) {
  return (
    <div className={`brandLogo ${compact ? "compact" : ""}`} aria-label={label}>
      <div className="brandLogo-mark">
        <span className="brandLogo-orbit"></span>
        <span className="brandLogo-core">BN</span>
      </div>
      {!compact && (
        <div className="brandLogo-text">
          <strong>Beyond</strong>
          <span>Null</span>
        </div>
      )}
    </div>
  );
}

export default BrandLogo;
