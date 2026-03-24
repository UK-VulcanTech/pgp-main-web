import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import { QueryProvider } from "./providers/QueryProvider";
import NavBar from "./components/ui/NavBar";
import Footer from "./components/ui/Footer";
import Homepage from "./pages/Homepage";
import ContactPage from "./pages/ContactPage";
import AboutPage from "./pages/AboutPage";
import SolutionPage from "./pages/SolutionPage";
import ImpactPage from "./pages/ImpactPage";
import TrainingDetailPage from "./pages/TrainingDetailPage";
import TechSolutionPage from "./pages/TechSolutionPage";
import TrainingAreasPage from "./pages/TrainingAreasPage";

function App() {
  return (
    <QueryProvider>
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/solutions/technology" element={<TechSolutionPage />} />
          <Route path="/solutions/:slug" element={<SolutionPage />} />
          <Route path="/impact" element={<ImpactPage />} />
          <Route path="/training" element={<TrainingAreasPage />} />
          <Route path="/training/:slug" element={<TrainingDetailPage />} />
        </Routes>
        <Footer />
      </Router>
    </QueryProvider>
  );
}

export default App;
