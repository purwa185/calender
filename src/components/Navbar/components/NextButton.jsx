import React from "react";


const NextButton = ({ onClick }) => {
  return (
    <a onClick={onClick}>
      <img src="/right-arrow.png" alt="Next" id="rightarrow" />
    </a>
  );
};

export default NextButton;