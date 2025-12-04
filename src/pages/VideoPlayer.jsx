import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api";
import PlaylistModal from "../components/PlaylistModal";

export default function VideoPlayer() {
  const { id } = useParams();
  const [video, setVideo] = useState(null);

  const [openPlaylist, setOpenPlaylist] = useState(false);

  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  const token = localStorage.getItem("accessToken");

  const fetchVideo = () => {
    api
      .get(`/videos/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      .then((res) => {
        const v = res.data.data;
        setVideo(v);
        setLikes(v.likesCount || 0);
        setIsLiked(v.isLiked || false);
      })
      .catch(console.error);
  };

  useEffect(() => {
    fetchVideo();
  }, [id]);

  // LIKE / UNLIKE Video
  const toggleLike = async () => {
    if (!token) {
      alert("Please login to like videos");
      return;
    }

    try {
      const route = isLiked
        ? "/likes/toggle-like/video?videoId=" + id
        : "/likes/toggle-like/video?videoId=" + id;

      const res = await api.post(
        route,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Update UI instantly
      setIsLiked(!isLiked);
      setLikes(!isLiked ? likes + 1 : likes - 1);
    } catch (err) {
      console.error(err);
    }
  };

  if (!video) return <p className="text-center mt-10">Loading video...</p>;

  return (
    <div className="max-w-4xl mx-auto">

      {/* Video Player */}
      <video
        controls
        src={`http://localhost:8000/api/v1/videos/${video._id}/stream`}
        className="w-full rounded-lg shadow mb-5"
      ></video>

      {/* Title */}
      <h1 className="text-2xl font-bold mb-2">{video.title}</h1>

      <div className="flex items-center justify-between mb-4">

        {/* LEFT: Views */}
        <p className="text-gray-500">{video.views} views</p>

        {/* RIGHT: Action Buttons */}
        <div className="flex gap-3">

          {/* LIKE BUTTON */}
          <button
            onClick={toggleLike}
            className={`px-4 py-2 rounded flex items-center gap-2 ${
              isLiked
                ? "bg-red-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 dark:text-gray-200"
            }`}
          >
            {isLiked ? "❤️ Liked" : "🤍 Like"} {likes}
          </button>

          {/* SAVE BUTTON */}
          <button
            onClick={() => setOpenPlaylist(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded"
          >
            Save
          </button>

        </div>
      </div>

      {/* Description */}
      <p className="text-gray-700 dark:text-gray-300">{video.description}</p>

      {/* Playlist Modal */}
      <PlaylistModal
        videoId={video._id}
        isOpen={openPlaylist}
        onClose={() => setOpenPlaylist(false)}
      />
    </div>
  );
}

