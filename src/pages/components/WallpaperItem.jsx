import React from 'react';
import supabase from '../supabaseClient';
import logDownload from '../helpers/logDownload';

function WallpaperItem({ wallpaper }) {
  const downloadWallpaper = async () => {
    const { name } = wallpaper;

    try {
      // Fetch the file from Supabase storage
      const { data, error } = await supabase.storage.from('wallpapers').download(name);

      if (error) {
        console.error('Error downloading wallpaper:', error.message);
        return;
      }

      // Trigger browser download
      const blob = await data.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = name;
      a.click();
      URL.revokeObjectURL(url);

      // Log the download to the downloads table
      const logged = await logDownload(name, 'wallpapers');
      if (!logged) {
        console.error('Failed to log the download.');
      }
    } catch (err) {
      console.error('Error downloading file:', err.message);
    }
  };

  return (
    <div>
      <span>{wallpaper.name}</span>
      <button onClick={downloadWallpaper}>Download</button>
    </div>
  );
}

export default WallpaperItem;
