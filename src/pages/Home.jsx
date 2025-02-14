import React, { useState, useEffect } from 'react';
import supabase from '../supabaseClient';

function Home() {
  const [file, setFile] = useState(null);
  const [wallpapers, setWallpapers] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch wallpapers and generate public URLs
  useEffect(() => {
    async function fetchWallpapers() {
      setError('');
      setSuccess('');

      try {
        const { data, error } = await supabase.storage.from('wallpapers').list('uploads'); // Get files in the 'uploads' folder

        if (error) {
          console.error('Error fetching wallpapers:', error.message);
          setError('Failed to load wallpapers.');
          return;
        }

        // Generate public URLs for all wallpapers
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
  }, [success]);

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) {
      setError('Please select a file.');
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(selectedFile.type)) {
      setError('Only JPG, PNG, and WEBP files are allowed.');
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5 MB
    if (selectedFile.size > maxSize) {
      setError('File size must be less than 5 MB.');
      return;
    }

    setFile(selectedFile);
    setError('');
  };

  // Handle file upload
  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      setError('No file selected for upload. Please choose a file.');
      return;
    }

    try {
      setError('');
      setSuccess('');

      const filePath = `uploads/
${encodeURIComponent(file.name)}`;
      const { data, error } = await supabase.storage
        .from('wallpapers')
        .upload(filePath, file, { upsert: true });

      if (error) {
        console.error('Error uploading file:', error.message);
        setError(`Failed to upload wallpaper: ${error.message}`);
      } else {
        setSuccess('Wallpaper uploaded successfully!');
        setFile(null);
      }
    } catch (err) {
      console.error('Unexpected error during upload:', err.message);
      setError('An unexpected error occurred during upload.');
    }
  };

  return (
    <div>
      <h1>Wallpaper Gallery</h1>

      {/* Upload Form */}
      <form onSubmit={handleUpload}>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <button type="submit">Upload</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}

      {/* Wallpaper Previews */}
      <div>
        <h2>Uploaded Wallpapers:</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
          {wallpapers.map((wallpaper) => (
            <div key={wallpaper.name} style={{ textAlign: 'center' }}>
              <img
                src={wallpaper.url}
                alt={wallpaper.name}
                style={{ width: '150px', height: 'auto', borderRadius: '8px', boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.2)' }}
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
