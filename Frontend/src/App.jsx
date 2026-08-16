import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useDispatch } from "react-redux";
import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashoard_employe from "./pages/emmploye-Dashoard";
import Dashoard_seeker from "./pages/Jop-seeker-Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import LayoutEmployer from "./components/LayoutEmployer";
import LayoutSeeker from "./components/LayoutSeeker";
import LayoutAdmin from "./components/LayoutAdmin";
import EmployerProfile from "./pages/EmployerProfile";
import AdminDashboard from "./pages/AdminDashboard";
import JobSearch from "./pages/JobSearch";
import JobDetails from "./pages/JobDetails";
import CategoriesSection from "./components/CategoriesSection";
import FeaturedJobsSection from "./components/FeaturedJobsSection";
import TrustSection from "./components/TrustSection";
import CTASection from "./components/CTASection";
import Footer from "./components/Footer";
import { bootstrapAuth } from "./features/authSlice";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(bootstrapAuth());
  }, [dispatch]);

  return (
    <div>
      <Routes>
        {/* <Route
          path="/"
          element={
            <>
              <Navbar />
              <LandingPage />
              <CategoriesSection />
              <FeaturedJobsSection />
              <TrustSection />
              <CTASection />
              <Footer />
            </>
          }
        /> */}
        <Route
          path="/jobs"
          element={
            <>
              <Navbar />
              <JobSearch />
              <Footer />
            </>
          }
        />
        <Route
          path="/jobs/:id"
          element={
            <>
              <Navbar />
              <JobDetails />
              <Footer />
            </>
          }
        />
        <Route path="/" element={<Login />} />
        <Route path="/Register" element={<Register />} />

        <Route element={<ProtectedRoute allowedRoles={["Employer"]} />}>
          <Route element={<LayoutEmployer />}>
            <Route path="/emmploye-Dashoard" element={<Dashoard_employe />} />

            <Route path="/employer-profile" element={<EmployerProfile />} />
          </Route>
        </Route>
        {/*
        Job-siker
        */}

        <Route element={<ProtectedRoute allowedRoles={["Job-Seeker"]} />}>
          <Route element={<LayoutSeeker />}>
            <Route path="/Jop-seeker-Dashboard" element={<Dashoard_seeker />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["Super-Admin"]} />}>
          <Route element={<LayoutAdmin />}>
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

export default App;
