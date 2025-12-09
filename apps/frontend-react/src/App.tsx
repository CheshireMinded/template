import React, { useState, useEffect } from "react";
import { TodoList } from "./components/TodoList";
import { Login } from "./components/Login";
import { isAuthenticated, getAuthUser, removeAuthToken, AuthUser } from "./utils/auth";

export const App: React.FC = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated()) {
      const authUser = getAuthUser();
      if (authUser) {
        setUser(authUser);
        setAuthenticated(true);
      } else {
        removeAuthToken();
      }
    }
    setLoading(false);
  }, []);

  const handleLogin = (authUser: AuthUser) => {
    setUser(authUser);
    setAuthenticated(true);
  };

  const handleLogout = () => {
    removeAuthToken();
    setUser(null);
    setAuthenticated(false);
  };

  if (loading) {
    return (
      <main style={styles.page}>
        <div style={styles.loading}>Loading...</div>
      </main>
    );
  }

  return (
    <main style={styles.page}>
      {authenticated ? (
        <>
          <div style={styles.header}>
            <span style={styles.userInfo}>Logged in as: {user?.username}</span>
            <button onClick={handleLogout} style={styles.logoutButton}>
              Logout
            </button>
          </div>
          <TodoList />
        </>
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </main>
  );
};

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#020617",
    color: "#e5e7eb"
  },
  loading: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    fontSize: "1.25rem"
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem 2rem",
    borderBottom: "1px solid #374151"
  },
  userInfo: {
    color: "#9ca3af"
  },
  logoutButton: {
    padding: "0.5rem 1rem",
    borderRadius: "0.5rem",
    border: "1px solid #374151",
    backgroundColor: "#1f2937",
    color: "#e5e7eb",
    cursor: "pointer",
    fontSize: "0.875rem"
  }
};
