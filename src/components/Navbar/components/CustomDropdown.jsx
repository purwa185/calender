import { useEffect, useState } from "react";
import { useCalendar } from "../../../contexts/CalendarContext";
import { VIEW_MODE } from "../../../constants/constants";

const CustomDropdown = () => {
  const [open, setOpen] = useState(false);
  const { selectedView, setSelectedView } = useCalendar();

  const getLabel = (view) => {
    switch (view) {
      case VIEW_MODE.WEEK_VIEW:
        return "Week";
      case VIEW_MODE.DAY_VIEW:
        return "Day";
      case VIEW_MODE.MONTH_VIEW:
      default:
        return "Month";
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".dropdown")) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div className="dropdown">
      <div className="dropdown-selected" onClick={() => setOpen(!open)}>
        {getLabel(selectedView)}
      </div>
      {open && (
        <div className="dropdown-options">
          <div className="dropdown-option" onClick={() => { setSelectedView(VIEW_MODE.MONTH_VIEW); setOpen(false); }}>
            Month
          </div>
          <div className="dropdown-option" onClick={() => { setSelectedView(VIEW_MODE.WEEK_VIEW); setOpen(false); }}>
            Week
          </div>
          <div className="dropdown-option" onClick={() => { setSelectedView(VIEW_MODE.DAY_VIEW); setOpen(false); }}>
            Day
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
