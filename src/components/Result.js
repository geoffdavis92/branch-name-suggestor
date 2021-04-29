import React from "react";
import { camelCaseToDashCase } from "../utils/functions";

export function Result({
  data: { id, resultType, resultHeading = "", resultContent = [] } = {}
} = {}) {
  const resultClassName = camelCaseToDashCase(id);

  return (
    <article
      key={id}
      className={`result result-${resultType} ${resultClassName}`}
    >
      <h4 className="result-heading">{resultHeading}</h4>
      <ul className="result-content-list">
        {resultContent.map((text) => (
          <li
            key={text.split(" ").slice(0, 5).join("_")}
            className="result-content-item"
          >
            {text}
          </li>
        ))}
      </ul>
    </article>
  );
}
