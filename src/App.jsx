// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import WallpaperGallery from "./pages/WallpaperGallery";

function App() {
  return (
    <Router>
      <Routes>
        {/* Route for Home page */}
        <Route path="/" element={<Home />} />

        {/* Route for Wallpaper Gallery page */}
        <Route path="/gallery" element={<WallpaperGallery />} />
      </Routes>
    </Router>
  );
}

export default App;
