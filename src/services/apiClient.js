const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;

export async function fetchWithAuth(url, options = {}) {
  const finalUrl = url.startsWith("http") ? url : `${BASE_API_URL}${url}`;
  
  const res = await fetch(finalUrl, {
    credentials: "include",
    ...options,
  });

  // If 401, try refresh once and retry
  if (res.status === 401) {
    try {
      const refreshRes = await fetch(`${BASE_API_URL}/users/refresh-token`, {
        method: "POST",
        credentials: "include",
      });
      
      // If refresh also fails with 401, user needs to login
      if (refreshRes.status === 401) {
        window.location.href = "/login";
        return res;
      }
      
      // If refresh succeeded, retry the original request
      return fetch(finalUrl, {
        credentials: "include",
        ...options,
      });
    } catch (err) {
      // Refresh failed, redirect to login
      window.location.href = "/login";
      return res;
    }
  }

  return res;
}
