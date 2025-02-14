// src/pages/WallpaperGallery.jsx
import React, { useState, useEffect } from "react";
import supabase from "../supabaseClient";

const WallpaperGallery = () => {
  const [wallpapers, setWallpapers] = useState([]); // Store wallpapers

  useEffect(() => {
    fetchWallpapers();
  }, []);

  const fetchWallpapers = async () => {
    try {
      // Fetch the wallpaper file list from the Supabase bucket
      const { data, error } = await supabase.storage.from("wallpapers").list();
      if (error) {
        console.error("Error fetching wallpapers:", error.message);
        return;
      }

      // Generate public URLs for each wallpaper file
      const urls = await Promise.all(
        data.map((file) =>
          supabase.storage.from("wallpapers").getPublicUrl(file.name)
        )
      );

      setWallpapers(urls.map((urlObj) => urlObj.data.publicUrl)); // Extract public URLs
    } catch (error) {
      console.error("Unexpected error fetching wallpapers:", error.message);
    }
  };

  const handleDownload = async (url, fileName) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob); // Convert blob to a downloadable URL
      link.download = fileName;
      link.click(); // Trigger file download
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error("Error downloading image:", error.message);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Wallpaper Gallery</h1>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "20px",
        }}
      >
        {wallpapers.map((url, index) => (
          <div key={index} style={{ textAlign: "center" }}>
            {/* Render each wallpaper */}
            <img
              src={url}
              alt={`Wallpaper-$
{index}`}
              style={{
                width: "100%",
                height: "auto",
                borderRadius: "10px",
                boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 6px",
              }}
            />
            {/* Download button */}
            <button
              onClick={() => handleDownload(url, `wallpaper-
${index + 1}.jpg`)}
              style={{
                marginTop: "10px",
                padding: "10px 20px",
                backgroundColor: "#007BFF",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Download
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WallpaperGallery;
