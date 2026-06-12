import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { authState } from "./home.jsx";

const apiUrl = import.meta.env.VITE_API_URL ?? import.meta.env.VITE_URI ?? "http://localhost:5000";

export default function Register() {
  const [user, setUser] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (authState.token) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  const handleRegister = async () => {
    try {
      await axios.post(`${apiUrl}/register`, user);
      setMessage("Registration successful. Please log in.");
      navigate("/login", { replace: true });
    } catch (error) {
      setMessage(error.response?.data?.message ?? "Unable to register");
    }
  };

  return (
    <div>
      <h3>Registration Form</h3>
      {message ? <p>{message}</p> : null}
      <p>
        <input
          type="text"
          onChange={(e) => setUser({ ...user, name: e.target.value })}
          placeholder="Name"
        />
      </p>
      <p>
        <input
          type="text"
          onChange={(e) => setUser({ ...user, email: e.target.value })}
          placeholder="Email"
        />
      </p>
      <p>
        <input
          type="password"
          onChange={(e) => setUser({ ...user, password: e.target.value })}
          placeholder="Password"
        />
      </p>
      <button onClick={handleRegister}>Register</button>
      <p>
        <Link to="/login">Already a member? Login here</Link>
      </p>
    </div>
  );
}