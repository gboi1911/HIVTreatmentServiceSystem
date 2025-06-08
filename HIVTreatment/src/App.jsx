import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./components/Layout";
import Home from "./pages/Home";
import AboutUs from "./pages/About";
import HealthAndLife from "./pages/HealthAndLife";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<AboutUs />} />
          <Route path="health-and-life" element={<HealthAndLife />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
