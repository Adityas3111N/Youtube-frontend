const BASE_API_URL = "http://localhost:8000/api/v1/playlist";

export const createPlaylist = async (name, description) => {
  const res = await fetch(`${BASE_API_URL}/create-playlist`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ name, description }),
  });
  return res.json();
};

export const getPlaylistById = async (playlistId) => {
  const res = await fetch(`${BASE_API_URL}/${playlistId}`, {
    credentials: "include",
  });
  return res.json();
};


export const getPlaylists = async () => {
  const res = await fetch(BASE_API_URL, { credentials: "include" });
  return res.json();
};

export const deletePlaylist = async (playlistId) => {
  const res = await fetch(`${BASE_API_URL}/delete-playlist/${playlistId}`, {
    method: "POST",
    credentials: "include",
  });
  return res.json();
};

export const addVideoToPlaylist = async (playlistId, videoId) => {
  const res = await fetch(`${BASE_API_URL}/add-video`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ playlistId, videoId }),
  });
  return res.json();
};

export const removeVideoFromPlaylist = async (playlistId, videoId) => {
  const res = await fetch(`${BASE_API_URL}/remove-video`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ playlistId, videoId }),
  });
  return res.json();
};
