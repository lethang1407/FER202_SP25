  import React, { useState } from "react";
  import { useNavigate } from "react-router-dom";
  import "bootstrap/dist/css/bootstrap.min.css"
  import bcrypt from "bcryptjs";
  import "../css/login.css"; // Import CSS tùy chỉnh

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
        const user = users.find((u) => u.username === username);
        const validPassword = bcrypt.compareSync(password, user.password);

        if (user) {
          localStorage.setItem("user", JSON.stringify(user));

          switch (user.role_id) {
            case 1:
              navigate("/admin");
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
        } else if (!validPassword || !user) {
          setError("Invalid username or password");
        }
      } catch (err) {
        console.error("Lỗi",err);
        setError("Error connecting to server");
      }
    };

    return (
      <div className="login-container">
        <div className="login-box">
          <h2 className="text-center">Đăng Nhập</h2>
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label className="form-label">Tên tài khoản</label>
              <input
                type="text"
                className="form-control"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Mật khẩu</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">Đăng nhập</button>
          </form>
          <p className="mt-3 text-center">
            Chưa có tài khoản? <a href="/register" className="register-link">Đăng ký</a>
          </p>
        </div>
      </div>
    );
  };

  export default LoginPage;
