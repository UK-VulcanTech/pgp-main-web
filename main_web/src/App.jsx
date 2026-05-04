import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import NavBar from "./components/ui/NavBar";
import Footer from "./components/ui/Footer";
import Homepage from "./pages/Homepage";
import AboutPage from "./pages/AboutPage";
import ApproachPage from "./pages/ApproachPage";
import ContactPage from "./pages/ContactPage";
import SolutionsPage from "./pages/SolutionsPage";
import SolutionDetailPage from "./pages/SolutionDetailPage";
import TrainingPage from "./pages/TrainingPage";
import TrainingDetailPage from "./pages/TrainingDetailPage";
import DigitalFastTrackPage from "./pages/DigitalFastTrackPage";

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/approach" element={<ApproachPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/solutions" element={<SolutionsPage />} />
        <Route path="/solutions/:slug" element={<SolutionDetailPage />} />
        <Route path="/training" element={<TrainingPage />} />
        <Route path="/training/:slug" element={<TrainingDetailPage />} />
        <Route path="/digital-fast-track" element={<DigitalFastTrackPage />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
