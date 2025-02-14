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
      const { data, error } = await supabase.storage.from('wallpapers').list(); // Fetch list of files in the bucket

      if (error) {
        console.error('Error fetching wallpapers:', error.message);
        setError('Failed to load wallpapers.');
      } else {
        setWallpapers(data || []);
      }
    }

    fetchWallpapers();
  }, [success]); // Re-fetch wallpapers when a new upload succeeds

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) {
      setError('Please select a file.');
      return;
    }

    // Validate file type (only image files allowed)
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(selectedFile.type)) {
      setError('Only JPG, PNG, and WEBP file types are allowed.');
      return;
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5 MB
    if (selectedFile.size > maxSize) {
      setError('File size must be less than 5 MB.');
      return;
    }

    setFile(selectedFile);
    setError(''); // Clear previous errors
  };

  // Handle file upload
  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      setError('Please select a file before uploading.');
      return;
    }

    try {
      setError('');
      setSuccess('');

      // Upload file to Supabase storage
      const { data, error } = await supabase.storage
        .from('wallpapers') // The storage bucket name
        .upload(`uploads/$
{file.name}`, file, { upsert: true }); // Place files in an "uploads" folder

      if (error) {
        console.error('Error uploading file:', error.message);
        setError(`Failed to upload wallpaper:
${error.message}`);
        return;
      }

      setSuccess('Wallpaper uploaded successfully!');
      setFile(null); // Reset file state after successful upload
    } catch (err) {
      console.error('Unexpected error during upload:', err.message);
      setError('An unexpected error occurred during upload.');
    }
  };

  return (
    <div>
      <h1>Wallpaper Gallery</h1>

      {/* File Upload Section */}
      <div>
        <form onSubmit={handleUpload}>
          <input type="file" accept="image/*" onChange={handleFileChange} />
          <button type="submit">Upload</button>
        </form>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}
      </div>

      {/* Display Uploaded Wallpapers */}
      <div>
        <h2>Available Wallpapers:</h2>
        <ul>
          {wallpapers.map((wallpaper) => (
            <li key={wallpaper.name}>
              <a
                href={`https://rptdmaistscgifwhnkzg.supabase.co/storage/v1/object/public/wallpapers/${wallpaper.name}`} // Accessible wallpaper URL
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
