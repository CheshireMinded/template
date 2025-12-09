import React, { useState } from "react";

export const App: React.FC = () => {
  const [message, setMessage] = useState("Hello from React frontend!");

  return (
    <main style={styles.page}>
      <h1>React Frontend</h1>
      <p>{message}</p>
      <button
        style={styles.button}
        onClick={() => setMessage("You clicked the button!")}
      >
        Click me
      </button>
    </main>
  );
};

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#020617",
    color: "#e5e7eb",
    fontFamily:
      'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  },
  button: {
    padding: "0.5rem 1rem",
    borderRadius: "999px",
    border: "none",
    backgroundColor: "#22c55e",
    color: "#0f172a",
    cursor: "pointer",
    fontWeight: 600
  }
};

