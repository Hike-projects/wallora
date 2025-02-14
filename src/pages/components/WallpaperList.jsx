import React from 'react';
import WallpaperItem from './WallpaperItem';

function WallpaperList({ wallpapers }) {
  return (
    <div>
      {wallpapers.map((wallpaper) => (
        <WallpaperItem key={wallpaper.name} wallpaper={wallpaper} />
      ))}
    </div>
  );
}

export default WallpaperList;
