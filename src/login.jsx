import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { authState, setAuthState } from "./home.jsx";

const apiUrl = import.meta.env.VITE_API_URL ?? import.meta.env.VITE_URI ?? "http://localhost:5000";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (authState.token) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  const handleLogin = async () => {
    try {
      const res = await axios.post(`${apiUrl}/login`, { email, password });
      setAuthState(res.data.user, res.data.token);
      navigate("/", { replace: true });
    } catch (error) {
      setMessage(error.response?.data?.message ?? "Invalid User");
    }
  };

  return (
    <div>
      <h3>Login Form</h3>
      {message ? <p>{message}</p> : null}
      <p>
        <input
          type="text"
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
      </p>
      <p>
        <input
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
      </p>
      <button onClick={handleLogin}>Login</button>
      <p>
        <Link to="/register">New User Register Here</Link>
      </p>
    </div>
  );
}