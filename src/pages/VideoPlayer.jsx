import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/api';

function VideoPlayer() {
  const { id } = useParams(); // Extract video ID from URL
  const [videoData, setVideoData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Use correct endpoint with video ID
        const response = await api.get(`/videos/${id}`);
        setVideoData(response.data?.data);
        
      } catch (err) {
        console.error('Failed to fetch video:', err);
        
        if (err.response) {
          setError(`Error: ${err.response.status} - ${err.response.data?.message || 'Server error'}`);
        } else if (err.request) {
          setError('No response from server. Check your connection.');
        } else {
          setError(`Error: ${err.message}`);
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchVideo();
    }
  }, [id]);

  if (loading) {
    return <div className="text-center py-10 text-xl">Loading video...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  if (!videoData) {
    return <div className="text-center py-10">No video data available.</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-4">
      {/* Video Player */}
      <div className="bg-black rounded-lg overflow-hidden mb-4">
        <video 
          controls 
          className="w-full"
          src={videoData.videoFile}  // Now flattened by transform
          poster={videoData.thumbnail} // Now flattened by transform
        >
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Video Info */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-2">{videoData.title}</h1>
        
        <div className="flex items-center gap-4 text-gray-600 text-sm mb-4">
          <span>{videoData.views} views</span>
          <span>•</span>
          <span>{videoData.duration ? `${Math.floor(videoData.duration)}s` : '0s'}</span>
          <span>•</span>
          <span>{new Date(videoData.createdAt).toLocaleDateString()}</span>
        </div>

        {/* Owner Info */}
        {videoData.owner && (
          <div className="flex items-center gap-3 mb-4 pb-4 border-b">
            <img 
              src={videoData.owner.avatar} 
              alt={videoData.owner.username}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <p className="font-semibold">{videoData.owner.fullName}</p>
              <p className="text-sm text-gray-600">@{videoData.owner.username}</p>
            </div>
          </div>
        )}

        {/* Description */}
        <div className="bg-gray-50 p-4 rounded">
          <h2 className="font-semibold mb-2">Description</h2>
          <p className="text-gray-700 whitespace-pre-wrap">{videoData.description}</p>
        </div>

        {/* Like/Dislike Buttons (if you have the system) */}
        {videoData.likesCount !== undefined && (
          <div className="flex gap-4 mt-4">
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              👍 {videoData.likesCount} {videoData.isLiked ? 'Liked' : 'Like'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default VideoPlayer;