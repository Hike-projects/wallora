import React, { useState, useEffect } from 'react';
import supabase from '../supabaseClient';
import Uploader from '../components/Uploader';

function Home() {
  const [wallpapers, setWallpapers] = useState([]);
  const [error, setError] = useState('');

  // Fetch wallpapers with public URLs
  useEffect(() => {
    async function fetchWallpapers() {
      setError('');

      try {
        const { data, error } = await supabase.storage.from('wallpapers').list('uploads');
        if (error) {
          setError('Failed to load wallpapers.');
          console.error(error.message);
          return;
        }

        // Generate public URLs
        const wallpaperWithUrls = data.map((wallpaper) => {
          const { publicUrl } = supabase.storage
            .from('wallpapers')
            .getPublicUrl(`uploads/
${wallpaper.name}`);
          return { name: wallpaper.name, url: publicUrl };
        });

        setWallpapers(wallpaperWithUrls);
      } catch (err) {
        setError('An error occurred while fetching wallpapers.');
        console.error(err.message);
      }
    }

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
            {/* Image */}
            <img
              src={wallpaper.url}
              alt={wallpaper.name}
              style={styles.cardImage}
              onError={() => setError('Image failed to load.')}
            />
            {/* Card Footer */}
            <div style={styles.cardFooter}>
              <div>
                <p style={styles.cardTitle}>{wallpaper.name.split('.')[0]}</p>
                <p style={styles.cardSubtitle}>Kxnt</p>
              </div>
              {/* Like Button */}
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
