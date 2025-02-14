import React, { useState, useEffect } from 'react';
import supabase from '../supabaseClient';
import Uploader from '../components/Uploader';

function Home() {
  const [wallpapers, setWallpapers] = useState([]);
  const [error, setError] = useState('');

  // Fetch wallpapers and generate public URLs
  useEffect(() => {
    async function fetchWallpapers() {
      setError('');

      try {
        const { data, error } = await supabase.storage.from('wallpapers').list('uploads'); // Files in "uploads" folder

        if (error) {
          console.error('Error fetching wallpapers:', error.message);
          setError('Failed to load wallpapers.');
          return;
        }

        // Generate public URLs for each file
        const wallpaperWithUrls = data.map((wallpaper) => {
          const { publicUrl } = supabase.storage
            .from('wallpapers')
            .getPublicUrl(`uploads/$
{wallpaper.name}`);
          return { name: wallpaper.name, url: publicUrl };
        });

        setWallpapers(wallpaperWithUrls);
      } catch (err) {
        console.error('Unexpected error:', err.message);
        setError('An unexpected error occurred while fetching wallpapers.');
      }
    }

    fetchWallpapers();
  }, []);

  // Handle successful upload (trigger re-fetch of wallpapers)
  const handleUploadSuccess = () => {
    async function updateWallpapers() {
      setError('');

      try {
        const { data, error } = await supabase.storage.from('wallpapers').list('uploads');

        if (error) {
          console.error('Error fetching wallpapers after upload:', error.message);
          setError('Failed to refresh wallpapers list.');
          return;
        }

        // Update wallpaper list with new public URLs
        const wallpaperWithUrls = data.map((wallpaper) => {
          const { publicUrl } = supabase.storage
            .from('wallpapers')
            .getPublicUrl(`uploads/
${wallpaper.name}`);
          return { name: wallpaper.name, url: publicUrl };
        });

        setWallpapers(wallpaperWithUrls);
      } catch (err) {
        console.error('Error updating wallpapers preview:', err.message);
        setError('Failed to update wallpapers.');
      }
    }

    updateWallpapers();
  };

  return (
    <div>
      <h1>Wallpaper Gallery</h1>

      {/* Uploader Component */}
      <Uploader onUploadSuccess={handleUploadSuccess} />

      {/* Wallpaper Previews */}
      <div>
        <h2>Uploaded Wallpapers:</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
          {wallpapers.map((wallpaper) => (
            <div key={wallpaper.name} style={{ textAlign: 'center' }}>
              <img
                src={wallpaper.url}
                alt={wallpaper.name}
                style={{
                  width: '150px',
                  height: 'auto',
                  borderRadius: '8px',
                  boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.2)',
                }}
              />
              <p>{wallpaper.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
