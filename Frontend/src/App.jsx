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

        <Route
          path="/emmploye-Dashoard"
          element={
            <ProtectedRoute role="Employer">
              <Dashoard_employe />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Jop-seeker-Dashboard"
          element={
            <ProtectedRoute role="Job-Seeker">
              <Dashoard_seeker />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

export default App;
