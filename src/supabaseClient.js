import supabase from './supabaseClient';

async function getSignedUrl(bucket, fileName) {
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(fileName, 60); // URL valid for 60 seconds

  if (error) {
    console.error('Error generating signed URL:', error.message);
    return null;
  }

  return data.signedUrl;
}

// Example usage:
const bucket = 'wallpapers';
const fileName = 'example.jpg';
getSignedUrl(bucket, fileName).then((url) => {
  console.log('Signed URL:', url);
});
