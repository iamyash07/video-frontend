import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import UploadVideo from "./pages/UploadVideo";
import VideosList from "./pages/VideosList";
import VideoPlayer from "./pages/VideoPlayer";
import MyVideos from "./pages/MyVideos";
import ChannelPage from "./pages/ChannelPage";
import WatchHistory from "./pages/WatchHistory";
import Navbar from "./components/Navbar";

export default function App() {
  return (
    <div className="font-sans bg-gray-50 min-h-screen">
      {/* GLOBAL NAVBAR */}
      <Navbar />

      {/* PAGE CONTENT */}
      <div className="max-w-6xl mx-auto mt-6 px-4">
        <Routes>

          {/* PUBLIC ROUTES */}
          <Route path="/" element={<VideosList />} />
          <Route path="/video/:id" element={<VideoPlayer />} />

          {/* AUTH ROUTES */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* USER ROUTES */}
          <Route path="/upload" element={<UploadVideo />} />
          <Route path="/my-videos" element={<MyVideos />} />

          {/* CHANNEL ROUTES */}
          <Route path="/users/c" element={<ChannelPage />} />
          <Route path="/users/c/:username" element={<ChannelPage />} />
          
          {/* whatch History Rooutes */}
          <Route path="/history" element={<WatchHistory />} />

          {/* LOGOUT ROUTE */}
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
