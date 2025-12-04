import React, { useEffect, useState } from "react";
import api from "../api";
import { Link } from "react-router-dom";

export default function PlaylistPage() {
  const [playlists, setPlaylists] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("accessToken");

  const fetchPlaylists = () => {
    api
      .get("/playlist/user", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setPlaylists(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPlaylists();
  }, []);

  const createPlaylist = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      await api.post(
        "/playlist",
        { name },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setName("");
      fetchPlaylists();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading)
    return <p className="text-center mt-10">Loading playlists...</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">My Playlists</h1>

      {/* CREATE PLAYLIST FORM */}
      <form onSubmit={createPlaylist} className="flex gap-3 mb-6">
        <input
          className="w-full p-2 rounded bg-gray-100 dark:bg-gray-800 dark:text-gray-200"
          placeholder="New playlist name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button className="px-4 py-2 bg-blue-600 text-white rounded">
          Create
        </button>
      </form>

      {/* PLAYLIST LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {playlists.map((pl) => (
          <Link
            key={pl._id}
            to={`/playlist/${pl._id}`}
            className="bg-white dark:bg-gray-800 p-4 rounded shadow hover:scale-[1.01] transition"
          >
            <h2 className="text-xl font-bold">{pl.name}</h2>
            <p className="text-gray-500 dark:text-gray-300">
              {pl.videos.length} videos
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
