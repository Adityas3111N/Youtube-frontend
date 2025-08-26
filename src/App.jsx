import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import {
  HomePage,
  ChannelPage,
  Login,
  Signup,
  YouPage,
  History,
  WatchLater,
  Playlists,
  LikedVideos,
  PlaylistDetail,
  Logout,
  Setting,
} from "./pages";
import VideoPlayerPage from "./pages/VideoPlayerPage"; // ✅ check it's exported
import Layout from "./pages/Nav/Layout";
import Settings from "./pages/Setting";

function App() {
  return (
    <>
      {/* Global toaster (works everywhere) */}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#333",
            color: "#fff",
            borderRadius: "8px",
            padding: "12px",
          },
          success: {
            style: {
              background: "#22c55e", // green
              color: "#fff",
            },
          },
          error: {
            style: {
              background: "#ef4444", // red
              color: "#fff",
            },
          },
        }}
      />
      {/* app routes */}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} /> {/* better than repeating "/" */}
          <Route path="videos/watch/:videoId" element={<VideoPlayerPage />} />
          <Route path="users/channel/:username/:owner" element={<ChannelPage />} />
          <Route path="you" element={<YouPage />} />
          <Route path="history" element={<History />} />
          <Route path="liked-videos" element={<LikedVideos />} />
          <Route path="playlists" element={<Playlists />} />
          <Route path="playlists/:playlistId" element={<PlaylistDetail />} />
          <Route path="watch-later" element={<WatchLater />} />
          <Route path="logout" element={<Logout />} />
          <Route path="settings" element={<Setting/>} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
