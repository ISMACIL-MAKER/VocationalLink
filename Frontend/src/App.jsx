import React from "react";
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import { Home } from "./pages/Home";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={
          <>
          <Navbar/>
          <Home/>
          </>
          } />
      </Routes>
    </div>
  );
};

export default App;
