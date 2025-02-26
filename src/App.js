import logo from "./logo.svg";
import "./App.css";
import Navbar from "./components/Navbar/Navbar.jsx"
import LeftSection from "./components/LeftSection/LeftSection.jsx";
import RightSection from "./components/RightSection/RightSection.jsx";
import {CalendarProvider}  from "./contexts/CalendarContext.jsx"
import Modal from "./common/Modal.jsx";

function App() {
  return (
    <CalendarProvider>
    <div>
      <Navbar />
      <div className="container">
      <LeftSection/>
      <RightSection/>
      </div>
    </div>
    </CalendarProvider>
  );
}

export default App;
