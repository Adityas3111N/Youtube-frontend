import { getAccessToken, setAccessToken, clearAccessToken } from "./tokenService";

const API_URL = import.meta.env.VITE_BASE_API_URL;

async function refreshToken() {
  const res = await fetch(`${API_URL}/users/refresh-token`, {
    method: "POST",
    credentials: "include", // sends cookie automatically
  });
   
    console.log("Refresh response:", res);

  if (!res.ok) throw new Error("Refresh failed");

  const json = await res.json(); // <-- parse bodyf
  console.log("Refresh response:", json);
  const newAccess = json?.data?.accessToken; // <-- correct path
  if (!newAccess) throw new Error("No access token in refresh response");

  setAccessToken(newAccess);
  return newAccess;
}

export async function apiFetch(path, options = {}) {
  const token = getAccessToken();

  const opts = {
    ...options,
    credentials: "include",
    headers: {
      ...(options.headers || {}),
      Authorization: token ? `Bearer ${token}` : "",
      "Content-Type": "application/json",
    },
  };

  let res = await fetch(API_URL + path, opts);

  if (res.status === 401) {
    try {
      const newToken = await refreshToken();
      // retry with fresh token (cookies are also updated by backend)
      opts.headers.Authorization = `Bearer ${newToken}`;
      res = await fetch(API_URL + path, opts);
    } catch (err) {
      clearAccessToken();
      throw err;
    }
  }

  return res;
}