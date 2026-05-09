import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { ToastProvider } from "./components/Toast";
import Shell from "./components/Shell";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import PageEditor from "./components/PageEditor";
import CollectionList from "./pages/CollectionList";
import CollectionEdit from "./pages/CollectionEdit";
import Submissions from "./pages/Submissions";
import {
  ABOUT_SCHEMA,
  APPROACH_SCHEMA,
  CONTACT_SCHEMA,
  DFT_SCHEMA,
  HOME_SCHEMA,
  SITE_SCHEMA,
  SOLUTIONS_PAGE_SCHEMA,
  SOLUTION_FIELDS,
  TRAINING_FIELDS,
  TRAINING_PAGE_SCHEMA,
} from "./schemas";

function Protected({ children }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-ink-soft">
        Loading…
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function Page({ schema }) {
  return (
    <PageEditor
      title={schema.title}
      description={schema.description}
      endpoint={schema.endpoint}
      sections={schema.sections}
      inlines={schema.inlines}
    />
  );
}

export default function App() {
  return (
    <ToastProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          element={
            <Protected>
              <Shell />
            </Protected>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="site" element={<Page schema={SITE_SCHEMA} />} />
          <Route path="home" element={<Page schema={HOME_SCHEMA} />} />
          <Route path="about" element={<Page schema={ABOUT_SCHEMA} />} />
          <Route path="approach" element={<Page schema={APPROACH_SCHEMA} />} />
          <Route path="contact-page" element={<Page schema={CONTACT_SCHEMA} />} />
          <Route path="solutions-page" element={<Page schema={SOLUTIONS_PAGE_SCHEMA} />} />
          <Route path="training-page" element={<Page schema={TRAINING_PAGE_SCHEMA} />} />
          <Route path="digital-fast-track" element={<Page schema={DFT_SCHEMA} />} />

          <Route
            path="solutions"
            element={
              <CollectionList
                title="Solutions"
                description="Industry sectors. Each row gets its own page on the public site."
                endpoint="/solutions/"
                detailPath={(slug) => `/solutions/${slug}`}
              />
            }
          />
          <Route
            path="solutions/:slug"
            element={
              <CollectionEdit
                schema={SOLUTION_FIELDS}
                listPath="/solutions"
                listLabel="All solutions"
                parentKey="solution"
                adjacency={{
                  title: "Adjacent sectors",
                  help: "Programs we often deliver alongside this one. Order controls how they appear on the public page.",
                  listEndpoint: "/solutions/",
                  throughEndpoint: "/solutions-children/adjacency/",
                  fromKey: "from_solution",
                  toKey: "to_solution",
                }}
              />
            }
          />
          <Route
            path="training"
            element={
              <CollectionList
                title="Training programs"
                description="Each program gets its own detail page; the cybersecurity one optionally renders the framework section."
                endpoint="/training-areas/"
                detailPath={(slug) => `/training/${slug}`}
              />
            }
          />
          <Route
            path="training/:slug"
            element={
              <CollectionEdit
                schema={TRAINING_FIELDS}
                listPath="/training"
                listLabel="All programs"
                parentKey="training"
                adjacency={{
                  title: "More training programs",
                  help: "Other practice areas linked from this program's detail page.",
                  listEndpoint: "/training-areas/",
                  throughEndpoint: "/training-children/adjacency/",
                  fromKey: "from_training",
                  toKey: "to_training",
                }}
              />
            }
          />
          <Route path="submissions" element={<Submissions />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </ToastProvider>
  );
}
