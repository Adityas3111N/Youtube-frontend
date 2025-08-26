import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const BASE_API_URL = import.meta.env.VITE_BASE_API_URL; 

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    const logout = async () => {
      try {
        const res = await fetch(`${BASE_API_URL}/users/logout`, {
          method: "POST",
          credentials: "include", 
        });

        const data = await res.json();

        if (data.success) {
          // Clear any local storage/session storage
          localStorage.clear();
          sessionStorage.clear();

          // Redirect to login or home
          navigate("/login");
        } else {
          console.error("Logout failed:", data.message);
        }
      } catch (err) {
        console.error("Logout error:", err);
      }
    };

    logout();
  }, [navigate]);

  return <p>Logging out...</p>;
}
