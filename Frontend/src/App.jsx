import React from "react";
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import { Home } from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashoard_employe from "./pages/emmploye-Dashoard";
import Dashoard_seeker from "./pages/Jop-seeker-Dashboard";


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

        <Route path="/emmploye-Dashoard" element={<Dashoard_employe />} />
        <Route path="/Jop-seeker-Dashboard" element={<Dashoard_seeker />} />
      </Routes>
    </div>
  );
};

export default App;
