import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Shell from "./pages/Shell";
import Overview from "./pages/Overview";
import SitePage from "./pages/SitePage";
import HomeEditor from "./pages/HomePage";
import AboutEditor from "./pages/AboutPage";
import ContactEditor from "./pages/ContactPage";
import ImpactEditor from "./pages/ImpactPage";
import TechnologyEditor from "./pages/TechnologyPage";
import SolutionsList from "./pages/SolutionsList";
import SolutionEdit from "./pages/SolutionEdit";
import TrainingList from "./pages/TrainingList";
import TrainingEdit from "./pages/TrainingEdit";
import FooterLinksPage from "./pages/FooterLinksPage";
import SubmissionsPage from "./pages/SubmissionsPage";
import UsersPage from "./pages/UsersPage";

function Private({ children }) {
  const { isAuthed, authReady } = useAuth();
  if (!isAuthed) return <Navigate to="/login" replace />;
  if (!authReady) {
    return <div className="cms-loading-screen">Loading session…</div>;
  }
  return children;
}

function routerBasename() {
  const url = import.meta.env.BASE_URL || "/";
  if (url === "/") return undefined;
  return url.replace(/\/$/, "") || undefined;
}

export default function App() {
  return (
    <BrowserRouter basename={routerBasename()}>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/app"
            element={
              <Private>
                <Shell />
              </Private>
            }
          >
            <Route index element={<Overview />} />
            <Route path="site" element={<SitePage />} />
            <Route path="home" element={<HomeEditor />} />
            <Route path="about" element={<AboutEditor />} />
            <Route path="contact" element={<ContactEditor />} />
            <Route path="impact" element={<ImpactEditor />} />
            <Route path="technology" element={<TechnologyEditor />} />
            <Route path="solutions" element={<SolutionsList />} />
            <Route path="solutions/:slug" element={<SolutionEdit />} />
            <Route path="training" element={<TrainingList />} />
            <Route path="training/:slug" element={<TrainingEdit />} />
            <Route path="footer-links" element={<FooterLinksPage />} />
            <Route path="submissions" element={<SubmissionsPage />} />
            <Route path="users" element={<UsersPage />} />
          </Route>
          <Route path="/" element={<Navigate to="/app" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
