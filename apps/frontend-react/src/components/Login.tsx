import React, { useState } from "react";
import { setAuthToken, setAuthUser, AuthUser } from "../utils/auth";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

interface LoginProps {
  onLogin: (user: AuthUser) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const endpoint = isRegister ? "/api/v1/auth/register" : "/api/v1/auth/login";
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || "Authentication failed");
      }

      const data = await response.json();
      setAuthToken(data.token);
      setAuthUser(data.user);
      onLogin(data.user);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>{isRegister ? "Register" : "Login"}</h1>
        {error && <div style={styles.error}>{error}</div>}
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={styles.input}
            required
            autoComplete="username"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
            autoComplete={isRegister ? "new-password" : "current-password"}
            minLength={isRegister ? 6 : undefined}
          />
          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Loading..." : isRegister ? "Register" : "Login"}
          </button>
        </form>
        <button
          onClick={() => {
            setIsRegister(!isRegister);
            setError(null);
          }}
          style={styles.switchButton}
        >
          {isRegister ? "Already have an account? Login" : "Don't have an account? Register"}
        </button>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  },
  card: {
    backgroundColor: "#1f2937",
    padding: "2rem",
    borderRadius: "0.5rem",
    border: "1px solid #374151",
    width: "100%",
    maxWidth: "400px"
  },
  title: {
    color: "#e5e7eb",
    marginBottom: "1.5rem",
    textAlign: "center"
  },
  error: {
    backgroundColor: "#ef4444",
    color: "white",
    padding: "0.75rem",
    borderRadius: "0.5rem",
    marginBottom: "1rem",
    fontSize: "0.875rem"
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem"
  },
  input: {
    padding: "0.75rem",
    borderRadius: "0.5rem",
    border: "1px solid #374151",
    backgroundColor: "#111827",
    color: "#e5e7eb",
    fontSize: "1rem"
  },
  button: {
    padding: "0.75rem",
    borderRadius: "0.5rem",
    border: "none",
    backgroundColor: "#22c55e",
    color: "#0f172a",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "1rem",
    marginTop: "0.5rem"
  },
  switchButton: {
    marginTop: "1rem",
    padding: "0.5rem",
    borderRadius: "0.5rem",
    border: "none",
    backgroundColor: "transparent",
    color: "#9ca3af",
    cursor: "pointer",
    fontSize: "0.875rem",
    textDecoration: "underline",
    width: "100%"
  }
};

