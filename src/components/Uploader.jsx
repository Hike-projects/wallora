import React, { useState } from 'react';
import supabase from '../supabaseClient';

function Uploader({ onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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
    setSuccess('');
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

      // Generate file path
      const filePath = `uploads/$
{encodeURIComponent(file.name)}`;

      // Upload to Supabase
      const { data, error } = await supabase.storage
        .from('wallpapers')
        .upload(filePath, file, { upsert: true });

      if (error) {
        console.error('Error uploading file:', error.message);
        setError(`Failed to upload wallpaper:
${error.message}`);
      } else {
        setSuccess('Wallpaper uploaded successfully!');
        console.log('File successfully uploaded to:', data.path);
        setFile(null);

        // Notify parent of successful upload
        if (onUploadSuccess) onUploadSuccess();
      }
    } catch (err) {
      console.error('Unexpected error during upload:', err.message);
      setError('An unexpected error occurred during upload.');
    }
  };

  return (
    <div>
      <form onSubmit={handleUpload}>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <button type="submit">Upload</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
    </div>
  );
}

export default Uploader;
