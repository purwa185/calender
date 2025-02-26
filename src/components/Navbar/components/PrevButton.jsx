import React from "react";


const PrevButton = ({ onClick }) => {
  return (
    <a onClick={onClick}>
      <img src="/left-arrow.png" alt="Previous" id="leftarrow" />
    </a>
  );
};

export default PrevButton;