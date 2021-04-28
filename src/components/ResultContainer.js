import React from "react";

export function ResultContainer({ children, heading, className }) {
  return (
    <section className={`result-container ${className}`}>
      {heading ? <h3 className="result-heading">{heading}</h3> : null}
      {children}
    </section>
  );
}
