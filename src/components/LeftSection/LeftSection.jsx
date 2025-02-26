import React, { useState } from "react";
import Left1 from "./components/Left1.jsx";
import Left2 from "./components/Left2/Left2.jsx";
import "./leftsection.css"
import Modal from "../../common/Modal.jsx";

const LeftSection = () => {
  
  return (
    <div className="section-left">
      <Left1 />
      <Left2 />
    </div>
  );
};

export default LeftSection;