import React from "react";


const SelectView = ({ currentView, onViewChange }) => {
  return (
    <a id="selectbox">
    <select id="views" name="views" value={currentView} onChange={(e) => onViewChange(e.target.value)}>
      <option value="MONTH_VIEW">Month</option>
      <option value="DAY_VIEW">Day</option>
      <option value="WEEK_VIEW">Week</option>
    </select>
    </a>
  );
};

export default SelectView;