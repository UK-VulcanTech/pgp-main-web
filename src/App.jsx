import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import { QueryProvider } from "./providers/QueryProvider";
import Homepage from "./pages/Homepage";

function App() {
  return (
    <QueryProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Homepage />} />
        </Routes>
      </Router>
    </QueryProvider>
  );
}

export default App;
