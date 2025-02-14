import React, { useEffect, useState } from 'react';
import supabase from '../supabaseClient';
import WallpaperList from '../components/WallpaperList';

function Home() {
  const [wallpapers, setWallpapers] = useState([]);
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch wallpapers from the Supabase bucket
  useEffect(() => {
    async function fetchWallpapers() {
      const { data, error } = await supabase.storage.from('wallpapers').list();
      if (error) {
        console.error('Error fetching wallpapers:', error.message);
        setError('Failed to load wallpapers.');
      } else {
        setWallpapers(data || []);
        setError('');
      }
    }
    fetchWallpapers();
  }, [success]);

  // Handle file selection
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Handle file upload
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file to upload.');
      return;
    }
    setError('');
    setSuccess('');

    const { data, error } = await supabase.storage
      .from('wallpapers')
      .upload(file.name, file);

    if (error) {
      console.error('Error uploading file:', error.message);
      setError('Failed to upload the wallpaper.');
    } else {
      console.log('File uploaded successfully:', data);
      setSuccess('Wallpaper uploaded successfully!');
      setFile(null); // Reset file input
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1>Wallpaper Gallery</h1>
      </header>
      <div style={styles.uploadSection}>
        <p>Upload a new wallpaper:</p>
        <form onSubmit={handleUpload}>
          <input type="file" accept="image/*" onChange={handleFileChange} />
          <button type="submit" style={styles.uploadButton}>
            Upload
          </button>
        </form>
        {error && <p style={styles.error}>{error}</p>}
        {success && <p style={styles.success}>{success}</p>}
      </div>
      <WallpaperList wallpapers={wallpapers} />
    </div>
  );
}

const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    padding: '20px',
    backgroundColor: '#f5f5f5',
    minHeight: '100vh',
  },
  header: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  uploadSection: {
    textAlign: 'center',
    marginBottom: '30px',
  },
  uploadButton: {
    marginLeft: '10px',
    padding: '10px 15px',
    backgroundColor: '#007BFF',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
  },
  error: {
    color: 'red',
    marginTop: '10px',
  },
  success: {
    color: 'green',
    marginTop: '10px',
  },
};

export default Home;
