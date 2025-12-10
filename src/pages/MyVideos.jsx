import React, { useEffect, useState } from "react";
import api from "../api/api.js";
import { Link } from "react-router-dom";

export default function MyVideos() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Extract userId from token
  const token = localStorage.getItem("accessToken");
  let userId = null;

  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      userId = payload?._id;
    } catch (err) {
      console.error("Invalid token:", err);
    }
  }

  const fetchMyVideos = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      const res = await api.get(`/videos?userId=${userId}`);
      setVideos(res.data?.data?.videos || []);
    } catch (err) {
      console.error("Error loading videos:", err);
    }

    setLoading(false);
  };

  const deleteVideo = async (id) => {
    if (!confirm("Delete this video permanently?")) return;

    try {
      await api.delete(`/videos/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setVideos(videos.filter((v) => v._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete video");
    }
  };

  const togglePublish = async (id) => {
    try {
      const res = await api.patch(`/videos/${id}/toggle-publish-status`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const updated = res.data?.data;

      setVideos((prev) =>
        prev.map((v) => (v._id === id ? updated : v))
      );
    } catch (err) {
      console.error(err);
      alert("Failed to toggle publish status");
    }
  };

  useEffect(() => {
    fetchMyVideos();
  }, []);

  if (!token) {
    return (
      <div className="text-center text-lg py-10">
        Please login to view your videos.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center text-xl py-10">Loading...</div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="text-center text-gray-600 py-10">
        You haven't uploaded any videos yet.
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">My Videos</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {videos.map((v) => (
          <div
            key={v._id}
            className="bg-white shadow rounded overflow-hidden"
          >
            <Link to={`/video/${v._id}`}>
              <div className="relative aspect-video bg-black">
                <img
                  src={v.thumbnail}
                  alt={v.title}
                  className="w-full h-full object-cover"
                />

                <span className="absolute bottom-1 right-1 bg-black text-white text-xs px-1 rounded">
                  {Math.floor(v.duration)}s
                </span>
              </div>
            </Link>

            <div className="p-3">
              <h3 className="font-semibold line-clamp-2">{v.title}</h3>
              <p className="text-sm text-gray-600">{v.views} views</p>

              <div className="flex justify-between mt-3">
                <button
                  onClick={() => togglePublish(v._id)}
                  className={`px-3 py-1 rounded text-white ${
                    v.isPublished ? "bg-red-500" : "bg-green-600"
                  }`}
                >
                  {v.isPublished ? "Unpublish" : "Publish"}
                </button>

                <button
                  onClick={() => deleteVideo(v._id)}
                  className="px-3 py-1 bg-gray-700 text-white rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
