import React, { useState, useEffect } from 'react';
import supabase from '../supabaseClient';

function Home() {
  const [file, setFile] = useState(null);
  const [wallpapers, setWallpapers] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch wallpapers from the Supabase bucket
  useEffect(() => {
    async function fetchWallpapers() {
      setError('');
      setSuccess('');
      const { data, error } = await supabase.storage.from('wallpapers').list(); // Fetch list of uploaded files

      if (error) {
        console.error('Error fetching wallpapers:', error.message);
        setError('Failed to load wallpapers.');
      } else {
        setWallpapers(data || []);
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

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(selectedFile.type)) {
      setError('Only JPG, PNG, and WEBP files are allowed.');
      return;
    }

    // Validate file size (5MB max)
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

      // Properly construct the file path
      const filePath = `uploads/
${encodeURIComponent(file.name)}`;

      // Upload file to Supabase "wallpapers" bucket
      const { data, error } = await supabase.storage
        .from('wallpapers') // Bucket name
        .upload(filePath, file, { upsert: true });

      if (error) {
        console.error('Error uploading file:', error.message);
        setError(`Failed to upload wallpaper: $
{error.message}`);
      } else {
        setSuccess('Wallpaper uploaded successfully!');
        console.log('File uploaded to path:', data.path);
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

      {/* Display Uploaded Wallpapers */}
      <div>
        <h2>Available Wallpapers:</h2>
        <ul>
          {wallpapers.map((wallpaper) => (
            <li key={wallpaper.name}>
              <a
                href={`https://rptdmaistscgifwhnkzg.supabase.co/storage/v1/object/public/wallpapers/
${wallpaper.name}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {wallpaper.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Home;
