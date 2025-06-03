import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./components/Layout";
import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AboutUs from "./pages/About";
import Guides from "./pages/Guides";
import BlogDetail from "./pages/BlogDetail";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<AboutUs />} />
          <Route path="/guides" element={<Guides/>}/>
          <Route path="/BlogDetail" element={<BlogDetail/>}/>
        </Route>
        <Route path="/login" element={<LoginPage/>} />
        <Route path="/register" element={<RegisterPage/>} />
        
      </Routes>
    </Router>
  );
}

export default App;
