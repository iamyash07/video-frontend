import { Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";

import Login from "./pages/Login";
import Register from "./pages/Register";
import UploadVideo from "./pages/UploadVideo";
import VideosList from "./pages/VideosList";
import VideoPlayer from "./pages/VideoPlayer";
import MyVideos from "./pages/MyVideos";
import ChannelPage from "./pages/ChannelPage";
import WatchHistory from "./pages/WatchHistory";
import Navbar from "./components/Navbar";

function TestConnection() {
  const [status, setStatus] = useState("Connecting...");
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8000/api/v1/healthcheck")
      .then(res => res.json())
      .then(d => { setStatus("CONNECTED"); setData(d); })
      .catch(e => setStatus("FAILED: " + e.message));
  }, []);

  return (
    <div style={{ padding: 50, textAlign: "center" }}>
      <h1>{status}</h1>
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
}

export default function App() {
  return (
    <div className="font-sans bg-gray-50 min-h-screen">
      <Navbar />
      <div className="max-w-6xl mx-auto mt-6 px-4">
        <Routes>
           <Route path="/" element={<VideosList />} />
          <Route path="/video/:id" element={<VideoPlayer />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/upload" element={<UploadVideo />} />
          <Route path="/my-videos" element={<MyVideos />} />
          <Route path="/users/c" element={<ChannelPage />} />
          <Route path="/users/c/:username" element={<ChannelPage />} />
          <Route path="/history" element={<WatchHistory />} />
          <Route path="/logout" element={<Logout />} />
        </Routes>
      </div>
    </div>
  );
}

function Logout() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("user");
  window.location.href = "/login";
  return null;
}