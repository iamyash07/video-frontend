import React, { useState } from "react";
import api from "../api";

export default function UploadVideo() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [video, setVideo] = useState(null);

  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!video) {
      alert("Please select a video file.");
      return;
    }

    setUploading(true);
    setMessage("");

    const form = new FormData();
    form.append("title", title);
    form.append("description", description);
    form.append("video", video);

    try {
      const token = localStorage.getItem("accessToken");

      const res = await api.post("/videos", form, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },

        // ⭐ TRACK UPLOAD PROGRESS
        onUploadProgress: (event) => {
          const percent = Math.round((event.loaded * 100) / event.total);
          setProgress(percent);
        },
      });

      setMessage("🎉 Video uploaded successfully!");
      setTitle("");
      setDescription("");
      setVideo(null);
      setProgress(0);
    } catch (error) {
      console.error(error);
      setMessage("❌ Upload failed: " + (error.response?.data?.message || ""));
    }

    setUploading(false);
  };

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded shadow max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Upload Video</h2>

      <form onSubmit={handleUpload} className="space-y-4">
        {/* Title */}
        <div>
          <label className="font-semibold">Title</label>
          <input
            className="w-full mt-1 p-2 rounded bg-gray-100 dark:bg-gray-800 dark:text-gray-200"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="font-semibold">Description</label>
          <textarea
            className="w-full mt-1 p-2 rounded bg-gray-100 dark:bg-gray-800 dark:text-gray-200"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>

        {/* Video File */}
        <div>
          <label className="font-semibold">Select Video</label>
          <input
            type="file"
            accept="video/*"
            className="mt-1"
            onChange={(e) => setVideo(e.target.files[0])}
            required
          />
        </div>

        {/* ⭐ Upload Progress Bar */}
        {uploading && (
          <div className="w-full bg-gray-300 dark:bg-gray-700 rounded h-4 overflow-hidden">
            <div
              className="bg-blue-600 h-4 transition-all"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}

        {/* Button */}
        <button
          type="submit"
          disabled={uploading}
          className="w-full py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:bg-gray-400"
        >
          {uploading ? `Uploading... (${progress}%)` : "Upload Video"}
        </button>
      </form>

      {/* Message */}
      {message && (
        <p className="mt-4 text-center font-semibold">
          {message}
        </p>
      )}
    </div>
  );
}
