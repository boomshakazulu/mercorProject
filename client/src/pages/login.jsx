import { useState } from "react";
import Auth from "../utils/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (email && password) {
      try {
        const response = await fetch("/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Login failed");
        }
        // Handle successful login (e.g., store token, redirect)
        Auth.login(data.token);
      } catch (err) {
        console.error("Login error:", err);
      }
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        <button type="submit" onSubmit={handleSubmit}>
          Login
        </button>
      </form>
    </div>
  );
}
