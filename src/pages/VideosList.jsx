import React, { useEffect, useState } from "react";
import api from "../api/api.js";
import { Link } from "react-router-dom";

export default function VideosList() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

 const fetchVideos = async () => {
  try {
    // get query from URL
    const search = new URLSearchParams(window.location.search).get("query");

    const res = await api.get(`/videos`, {
      params: { query: search }
    });

    setVideos(res.data?.data?.videos || []);
  } catch (err) {
    console.error("Error fetching videos:", err);
  }
  setLoading(false);
};

useEffect(() => {
  fetchVideos();
}, [window.location.search]);


  if (loading) {
    return (
      <div className="text-center text-xl py-10 font-semibold">
        Loading videos...
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="text-center text-gray-600 py-10">
        No videos found. Upload one!
      </div>
    );
  }

  return (
    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {videos.map((v) => (
        <Link
          key={v._id}
          to={`/video/${v._id}`}
          className="group bg-white rounded shadow hover:shadow-lg transition overflow-hidden"
        >
          {/* Thumbnail */}
          <div className="relative w-full aspect-video bg-black">
            <img
              src={v.thumbnail}
              alt={v.title}
              className="w-full h-full object-cover"
            />

            {/* Duration badge */}
            <span className="absolute bottom-1 right-1 bg-black text-white text-xs px-2 py-1 rounded">
              {v.duration ? `${Math.floor(v.duration)}s` : "0s"}
            </span>
          </div>

          {/* Video Info */}
          <div className="p-3 flex gap-3">
            <img
              src={v.owner?.avatar}
              alt="avatar"
              className="w-10 h-10 rounded-full object-cover"
            />

            <div>
              <h3 className="font-semibold line-clamp-2 group-hover:text-blue-600">
                {v.title}
              </h3>
              <p className="text-sm text-gray-600">{v.owner?.username}</p>
              <p className="text-xs text-gray-500">{v.views} views</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
