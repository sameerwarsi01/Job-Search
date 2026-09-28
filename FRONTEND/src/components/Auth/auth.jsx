import axios from "axios";

// User session check
export const getCurrentUser = () => {
  try {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

export const isAuthenticated = () => {
  return !!localStorage.getItem("token") || !!localStorage.getItem("user");
};

// Global Logout Handler
export const handleUserLogout = async (navigate) => {
  const confirmLogout = window.confirm("Are you sure you want to log out?");
  if (!confirmLogout) return;

  try {
    // Backend cookie / session revoke (agar set ho)
    await axios.post(
      "http://localhost:3000/user/logout",
      {},
      { withCredentials: true }
    );
  } catch (err) {
    console.warn("Backend logout notice:", err.message);
  } finally {
    // Client storage clear
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.clear();

    // Redirect to Login page
    if (navigate) {
      navigate("/login", { replace: true });
    } else {
      window.location.href = "/login";
    }
  }
};