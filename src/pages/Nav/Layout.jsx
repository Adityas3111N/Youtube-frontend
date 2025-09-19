import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./SideBar";
import Nav from "./Nav";
import { fetchWithAuth } from "../../services/apiClient";

const Layout = () => {

  const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  // just replace userAvatar state with full user state
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetchWithAuth(`/users/current-user`);
        if (!res.ok) throw new Error("Failed to fetch user");
        const data = await res.json();
        console.log(data);
        setUser(data?.data || null);  //keep full user
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
  }, []);


  return (
    <div className="relative min-h-screen font-inter text-gray-900">
      <Nav
        sidebarExpanded={sidebarExpanded}
        toggleSidebar={() => setSidebarExpanded((prev) => !prev)}
        user={user}   //pass full user instead of just avatar
      />

      <Sidebar
        sidebarExpanded={sidebarExpanded}
        toggleSidebar={() => setSidebarExpanded((prev) => !prev)}
      />

      {/* Main content */}
      <main
        className={`transition-all duration-300 ease-in-out ${sidebarExpanded ? "ml-40" : "ml-16"
          }`}
      >
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
