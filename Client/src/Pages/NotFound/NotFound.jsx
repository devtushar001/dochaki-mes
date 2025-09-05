import React from "react";
import { Link } from "react-router-dom";
import "./NotFound.css";

const NotFound = () => {
  return (
    <main className="notfound-page" role="main">
      <div className="nf-card">
        <div className="nf-art">
          {/* simple friendly SVG illustration */}
          <svg viewBox="0 0 500 300" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <defs>
              <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
                <stop offset="0" stopColor="#60a5fa" />
                <stop offset="1" stopColor="#7c3aed" />
              </linearGradient>
            </defs>
            <rect x="0" y="0" width="500" height="300" rx="18" fill="url(#g)" opacity="0.12" />
            <g transform="translate(50,40)">
              <circle cx="130" cy="80" r="48" fill="#fff" opacity="0.95" />
              <text x="130" y="95" textAnchor="middle" fontSize="34" fontWeight="700" fill="#111">404</text>

              <g transform="translate(240,10)">
                <rect x="0" y="14" width="160" height="94" rx="12" fill="#fff" opacity="0.95" />
                <circle cx="24" cy="36" r="8" fill="#f97316" />
                <rect x="12" y="56" width="120" height="10" rx="5" fill="#e6eefb" />
                <rect x="12" y="76" width="90" height="10" rx="5" fill="#e6eefb" />
              </g>
            </g>
          </svg>
        </div>

        <div className="nf-body">
          <h1>Page not found</h1>
          <p>
            Oops — we can’t find the page you’re looking for. It may have been moved or
            removed, or the URL might be incorrect.
          </p>

          <div className="nf-actions">
            <Link to="/" className="btn btn-primary">Go to homepage</Link>
            <button
              className="btn btn-ghost"
              onClick={() => window.history.back()}
              aria-label="Go back"
            >
              Go back
            </button>
          </div>

          <small className="nf-hint">If you think this is a mistake, contact the site administrator.</small>
        </div>
      </div>
    </main>
  );
};

export default NotFound;
