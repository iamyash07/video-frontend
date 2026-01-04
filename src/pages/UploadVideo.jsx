import React, { useState } from "react";
import api from "../api/api.js";

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

    const maxSize = 100 * 1024 * 1024;
    if (video.size > maxSize) {
      alert("Video file is too large! Maximum size is 100MB.");
      return;
    }

    setUploading(true);
    setMessage("");
    setProgress(0);

    const form = new FormData();
    form.append("title", title);
    form.append("description", description);
    form.append("video", video);

    try {
      const res = await api.post("/videos", form, {
        timeout: 600000,
        onUploadProgress: (event) => {
          if (event.lengthComputable) {
            const percent = Math.round((event.loaded * 100) / event.total);
            setProgress(percent);
          }
        },
      });

      setMessage("🎉 Video uploaded successfully!");
      setTitle("");
      setDescription("");
      setVideo(null);
      setProgress(0);

    } catch (error) {
      if (error.code === 'ECONNABORTED') {
        setMessage("❌ Upload timeout. Video might be too large or connection is slow.");
      } else if (error.code === 'ERR_NETWORK') {
        setMessage("❌ Network error. Please check your internet connection and try again.");
      } else if (error.response?.status === 401) {
        setMessage("❌ Authentication failed. Please log in again.");
      } else {
        setMessage("❌ Upload failed: " + (error.response?.data?.message || error.message));
      }
    }

    setUploading(false);
  };

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded shadow max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Upload Video</h2>

      <form onSubmit={handleUpload} className="space-y-4">
        <div>
          <label className="font-semibold">Title</label>
          <input
            className="w-full mt-1 p-2 rounded bg-gray-100 dark:bg-gray-800 dark:text-gray-200"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

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

        <div>
          <label className="font-semibold">Select Video (Max 100MB)</label>
          <input
            type="file"
            accept="video/*"
            className="mt-1"
            onChange={(e) => setVideo(e.target.files[0])}
            required
          />
          {video && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Selected: {video.name} ({(video.size / 1024 / 1024).toFixed(2)} MB)
            </p>
          )}
        </div>

        {uploading && (
          <div>
            <div className="w-full bg-gray-300 dark:bg-gray-700 rounded h-4 overflow-hidden">
              <div
                className="bg-blue-600 h-4 transition-all"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-center text-sm mt-2">
              {progress < 100 
                ? `Uploading to server... ${progress}%` 
                : "Processing on Cloudinary... Please wait"}
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={uploading}
          className="w-full py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:bg-gray-400"
        >
          {uploading ? `Uploading... (${progress}%)` : "Upload Video"}
        </button>
      </form>

      {message && (
        <p className="mt-4 text-center font-semibold">
          {message}
        </p>
      )}
    </div>
  );
}