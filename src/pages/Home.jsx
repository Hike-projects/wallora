import React, { useState, useEffect } from 'react';
import supabase from '../supabaseClient';
import Uploader from '../components/Uploader';

function Home() {
  const [wallpapers, setWallpapers] = useState([]);
  const [error, setError] = useState('');

  // Fetch wallpapers from storage
  const fetchWallpapers = async () => {
    try {
      setError('');
      const { data, error } = await supabase.storage.from('wallpapers').list('uploads'); // Fetch the list of uploaded wallpapers

      if (error) {
        console.error('Error fetching wallpapers:', error.message);
        setError('Failed to load wallpapers.');
        return;
      }

      // Generate public URLs for each wallpaper
      const wallpaperWithUrls = data.map((wallpaper) => {
        const { publicUrl } = supabase.storage
          .from('wallpapers')
          .getPublicUrl(`uploads/${wallpaper.name}`);
        console.log('Public URL:', publicUrl); // Debug public URL
        return { name: wallpaper.name, url: publicUrl };
      });

      setWallpapers(wallpaperWithUrls);
    } catch (err) {
      console.error('Error during wallpaper fetch:', err.message);
      setError('An error occurred while fetching wallpapers.');
    }
  };

  // Load wallpapers on component mount
  useEffect(() => {
    fetchWallpapers();
  }, []);

  return (
    <div style={{ padding: '1rem' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '1rem' }}>Wallpaper Gallery</h1>

      {/* Uploader Component */}
      <Uploader onUploadSuccess={() => fetchWallpapers()} />

      {/* Error Display */}
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

      {/* Display Wallpapers */}
      <div style={styles.galleryGrid}>
        {wallpapers.map((wallpaper) => (
          <div key={wallpaper.name} style={styles.card}>
            {/* Image Preview */}
            <img
              src={wallpaper.url}
              alt={wallpaper.name}
              style={styles.cardImage}
              onError={() => setError('Image failed to load. Check the URL or upload.')}
            />
            {/* Card Footer */}
            <div style={styles.cardFooter}>
              <div>
                <p style={styles.cardTitle}>{wallpaper.name.split('.')[0]}</p>
                <p style={styles.cardSubtitle}>Uploader Name</p>
              </div>
              <button style={styles.likeButton}>❤️</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  galleryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
  },
  card: {
    backgroundColor: '#333',
    borderRadius: '12px',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  },
  cardImage: {
    width: '100%',
    height: '150px',
    objectFit: 'cover',
  },
  cardFooter: {
    padding: '0.75rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    color: '#fff',
  },
  cardTitle: {
    fontSize: '1rem',
    fontWeight: 'bold',
    margin: 0,
  },
  cardSubtitle: {
    fontSize: '0.85rem',
    margin: 0,
  },
  likeButton: {
    background: 'none',
    border: 'none',
    color: 'red',
    fontSize: '1.25rem',
    cursor: 'pointer',
    padding: 0,
  },
};

export default Home;
