import React, { useEffect, useState } from "react";
import api from "../api";
import { Link } from "react-router-dom";

export default function WatchHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    api
      .get("/users/history", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setHistory(res.data.data.history || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p className="text-center mt-10">Loading history...</p>;
  }

  if (history.length === 0) {
    return (
      <p className="text-center mt-10 text-gray-600 dark:text-gray-300">
        You haven’t watched any videos yet.
      </p>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-5">Watch History</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {history.map((video) => (
          <Link
            to={`/video/${video._id}`}
            key={video._id}
            className="flex gap-3 bg-white dark:bg-gray-800 p-3 rounded shadow hover:scale-[1.01] transition"
          >
            {/* Thumbnail */}
            <img
              src={video.thumbnail?.url}
              alt={video.title}
              className="w-40 h-24 object-cover rounded"
            />

            {/* Video Info */}
            <div>
              <h2 className="text-lg font-semibold">{video.title}</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2">
                {video.description}
              </p>
              <p className="text-sm mt-1 text-gray-400">
                {video.views} views
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
