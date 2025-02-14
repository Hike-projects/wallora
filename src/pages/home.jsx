import React, { useState, useEffect } from 'react';
import supabase from '../supabaseClient';
import WallpaperList from '../components/WallpaperList';

function Home() {
  const [wallpapers, setWallpapers] = useState([]);

  useEffect(() => {
    async function fetchWallpapers() {
      const { data, error } = await supabase.storage.from('wallpapers').list();

      if (error) {
        console.error('Error fetching wallpapers:', error.message);
      } else {
        setWallpapers(data || []);
      }
    }

    fetchWallpapers();
  }, []);

  return (
    <div>
      <h1>Wallpaper Gallery</h1>
      <WallpaperList wallpapers={wallpapers} />
    </div>
  );
}

export default Home;
