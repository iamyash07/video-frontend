import axios from 'axios';
import React, { useEffect, useState } from 'react';

function VideoPlayer() {
  const [videoData, setVideoData] = useState(null);
  const [error, setError] = useState(null); // State to store error messages
  const [loading, setLoading] = useState(true); // State to indicate loading

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        setLoading(true);
        setError(null); // Clear previous errors
        const response = await axios.get('/api/video'); // Replace with your actual API endpoint
        setVideoData(response.data);
      } catch (err) {
        console.error('Failed to fetch video:', err);
        // Set a user-friendly error message
        if (err.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          setError(`Error fetching video: ${err.response.status} - ${err.response.data?.message || 'Server error'}. Please try again later.`);
        } else if (err.request) {
          // The request was made but no response was received
          setError('Error fetching video: No response from server. Please check your internet connection.');
        } else {
          // Something happened in setting up the request that triggered an Error
          setError(`Error fetching video: ${err.message}.`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, []);

  if (loading) {
    return <div>Loading video...</div>;
  }

  if (error) {
    // Display the error message to the user
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  if (!videoData) {
    return <div>No video data available.</div>;
  }

  return (
    <div>
      <h1>{videoData.title}</h1>
      <video controls src={videoData.url} width="600"></video>
    </div>
  );
}

export default VideoPlayer;
