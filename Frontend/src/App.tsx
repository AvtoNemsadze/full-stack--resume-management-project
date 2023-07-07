import { useContext, lazy, Suspense } from "react";
import { ThemeContext } from "./context/theme.context";
import Navbar from "./components/navbar/Navbar";
import { Routes, Route } from "react-router-dom";
import ProgressLiner from "./components/customLinerSpinner/ProgressLiner";

//imports with lazy loading
const Home = lazy(() => import("./Pages/home/Home"));
const Companies = lazy(() => import("./Pages/companies/Companies.page"));
const AddCompany = lazy(() => import("./Pages/companies/AddCompany"));
const Jobs = lazy(() => import("./Pages/jobs/Jobs.page"));
const AddJob = lazy(() => import("./Pages/jobs/AddJob"));
const Candidates = lazy(() => import("./Pages/candidates/Candidate.page"));
const AddCandidate = lazy(() => import("./Pages/candidates/AddCandidate"));

const App = () => {
  const { darkMode } = useContext(ThemeContext);
  
  return (
    <div className={darkMode ? "app dark" : "app"}>
      <Navbar />
      <div className="wrapper">
        <Suspense fallback={<ProgressLiner />}>
          <Routes>
            <Route path="/" element={<Home />} />

            <Route path="/companies">
              <Route index element={<Companies />} />
              <Route path="add" element={<AddCompany />} />
            </Route>

            <Route path="/jobs">
              <Route index element={<Jobs />} />
              <Route path="add" element={<AddJob />} />
            </Route>

            <Route path="/candidates">
              <Route index element={<Candidates />} />
              <Route path="add" element={<AddCandidate />} />
            </Route>

          </Routes>
        </Suspense>
      </div>
    </div>
  );
};
export default App;
