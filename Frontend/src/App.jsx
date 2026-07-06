import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import { Home } from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashoard_employe from "./pages/emmploye-Dashoard";
import Dashoard_seeker from "./pages/Jop-seeker-Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import Profile from "./pages/Profile";
import LayoutSeeker from "./components/LayoutSeeker";
import Applications from "./pages/Applications";
import PostJop from "./pages/PostJob";

const App = () => {
  return (
    <div>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <Home />
            </>
          }
        />
        <Route path="/Login" element={<Login />} />
        <Route path="/Register" element={<Register />} />

        <Route element={<ProtectedRoute role="Employer" />}>
          <Route element={<Layout />}>
            <Route path="/emmploye-Dashoard" element={<Dashoard_employe />} />

            <Route path="/sidebarlinks/Profile" element={<Profile />} />
            <Route path="/PostJob" element={<PostJop />} />
          </Route>
        </Route>
        {/* 
        Job-siker
        */}

        <Route element={<ProtectedRoute role="Job-Seeker" />}>
          <Route element={<LayoutSeeker />}>
            <Route path="/Jop-seeker-Dashboard" element={<Dashoard_seeker />} />

            <Route path="/Profile" element={<Profile />} />
            <Route path="/Applications" element={<Applications />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

export default App;
