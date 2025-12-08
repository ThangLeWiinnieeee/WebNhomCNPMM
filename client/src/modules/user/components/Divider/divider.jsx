import React from "react";
import "./divider.css";

const Divider = ({ text }) => {
  return (
    <div className="divider">
        <span> {text || 'OR'} </span>
    </div>
  );
}

export default Divider;