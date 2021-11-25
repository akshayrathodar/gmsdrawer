import React from "react";
import "./CTAButton.css";

const CTAButton = (props) => {
  return (
    <div className="cta-button" onClick={props.onClick}>
      <div class="cta">
        <span>{props.text}</span>
        <svg width="13px" height="10px" viewBox="0 0 13 10">
          <path d="M1,5 L11,5"></path>
          <polyline points="8 1 12 5 8 9"></polyline>
        </svg>
      </div>
    </div>
  );
};

export default CTAButton;
