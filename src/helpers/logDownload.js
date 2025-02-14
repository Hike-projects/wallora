import supabase from '../supabaseClient';

export default async function logDownload(fileName, bucketId, userId = null) {
  try {
    const { data, error } = await supabase.from('downloads').insert([
      {
        file_name: fileName, // Name of the file being downloaded
        bucket_id: bucketId, // The bucket where the file resides
        user_id: userId,     // Optional: authenticated user's ID
      },
    ]);

    if (error) {
      console.error('Failed to log download:', error.message);
      return false;
    }
    console.log('Download logged successfully:', data);
    return true;
  } catch (err) {
    console.error('Error logging download:', err.message);
    return false;
  }
}
