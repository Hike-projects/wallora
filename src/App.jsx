import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home'; // Check this carefully
import WallpaperGallery from './pages/WallpaperGallery'; // Check this too

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/gallery" element={<WallpaperGallery />} />
      </Routes>
    </Router>
  );
}

export default App;
