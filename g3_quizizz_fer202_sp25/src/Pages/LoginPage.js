import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8888/accounts");
      const users = await response.json();
      const user = users.find(
        (u) => u.username === username && u.password === password
      );

      if (user) {
        localStorage.setItem("user", JSON.stringify(user));

        // Điều hướng theo `role_id`
        switch (user.role_id) {
          case 1:
            navigate("/admin-home");
            break;
          case 2:
            navigate("/teacher-home");
            break;
          case 3:
            navigate("/student-home");
            break;
          default:
            setError("Unauthorized role");
        }
      } else {
        setError("Invalid username or password");
      }
    } catch (err) {
      setError("Error connecting to server");
    }
  };

  return (
    <div className="container mt-5">
      <header className="header">
        {/* Logo */}
        <Link to="/" className="logo">
          QuizApp
        </Link>
      </header>
      <div className="row justify-content-center">
        <div className="col-md-4">
          <h2 className="text-center">Login</h2>
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label className="form-label">Username</label>
              <input
                type="text"
                className="form-control"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
