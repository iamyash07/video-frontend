import { useEffect, useState } from "react";
import api from "../api/api.js";

export default function PlaylistModal({ videoId, isOpen, onClose }) {
  const [playlists, setPlaylists] = useState([]);
  const [newPlaylist, setNewPlaylist] = useState("");
  const token = localStorage.getItem("accessToken");

  const fetchPlaylists = () => {
    api
      .get("/playlist/user", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setPlaylists(res.data.data))
      .catch(console.error);
  };

  useEffect(() => {
    if (isOpen) fetchPlaylists();
  }, [isOpen]);

  const createPlaylist = async () => {
    if (!newPlaylist.trim()) return;

    await api.post(
      "/playlist",
      { name: newPlaylist },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setNewPlaylist("");
    fetchPlaylists();
  };

  const toggleVideoInPlaylist = async (playlistId, contains) => {
    const route = contains
      ? `/playlist/remove/${playlistId}/${videoId}`
      : `/playlist/add/${playlistId}/${videoId}`;

    await api.post(
      route,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    fetchPlaylists();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-900 px-6 py-5 rounded-lg w-96 shadow-xl relative">
        
        <h2 className="text-xl font-bold mb-4">Save to Playlist</h2>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-2xl text-gray-600 hover:text-black"
        >
          ✖
        </button>

        {/* Playlist List */}
        <div className="max-h-60 overflow-y-auto mb-4">
          {playlists.map((pl) => {
            const contains = pl.videos.some((v) => v === videoId);

            return (
              <label
                key={pl._id}
                className="flex justify-between items-center py-2 cursor-pointer"
              >
                <span>{pl.name}</span>

                <input
                  type="checkbox"
                  checked={contains}
                  onChange={() => toggleVideoInPlaylist(pl._id, contains)}
                />
              </label>
            );
          })}
        </div>

        {/* Create New Playlist */}
        <div className="flex gap-2 mt-3">
          <input
            className="flex-1 p-2 rounded bg-gray-100 dark:bg-gray-800"
            placeholder="New playlist name"
            value={newPlaylist}
            onChange={(e) => setNewPlaylist(e.target.value)}
          />
          <button
            onClick={createPlaylist}
            className="px-3 py-2 bg-blue-600 text-white rounded"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
