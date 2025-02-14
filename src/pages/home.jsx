// src/pages/Home.jsx
import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1>Welcome to the Wallpaper App</h1>
      <p>Browse and download beautiful wallpapers!</p>
      <Link
        to="/gallery"
        style={{
          padding: "10px 20px",
          backgroundColor: "#007BFF",
          color: "white",
          textDecoration: "none",
          borderRadius: "5px",
        }}
      >
        Go to Gallery
      </Link>
    </div>
  );
};

export default Home;
