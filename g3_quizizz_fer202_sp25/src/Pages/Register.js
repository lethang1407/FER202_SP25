import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import bcrypt from "bcryptjs";
import "bootstrap/dist/css/bootstrap.min.css";
import '../css/register.css';

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [roleId, setRoleId] = useState("3"); // Mặc định là học sinh
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    // Hàm kiểm tra mật khẩu có đủ mạnh không
    const isValidPassword = (password) => {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
      return passwordRegex.test(password);
    };
    if (!username || !password || !confirmPassword) {
      setError("Vui lòng điền đầy đủ thông tin.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }

    if (!isValidPassword(password)) {
      setError("Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8888/accounts");
      const users = await response.json();

      if (users.find((u) => u.username === username)) {
        setError("Tên tài khoản đã tồn tại.");
        return;
      }
      // Mã hóa mk
      const hashedPassword = bcrypt.hashSync(password, 10);
      // Tìm ID lớn nhất hiện có trong database và cộng thêm 1
      const maxId = users.length > 0 ? Math.max(...users.map((u) => u.id)) : 0;
      const newId = maxId + 1;
      // Tạo tài khoản mới
      const newUser = { id: newId, username, password: hashedPassword, role_id: Number(roleId) };

      const postResponse = await fetch("http://localhost:8888/accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });

      if (postResponse.ok) {
        setSuccess("Đăng ký thành công! Đang chuyển hướng...");
        setTimeout(() => navigate("/login"), 1000);
      } else {
        setError("Lỗi đăng ký. Vui lòng thử lại.");
      }
    } catch (err) {
      setError("Lỗi kết nối đến server.");
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h2 className="text-center">Đăng Ký</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        <form onSubmit={handleRegister}>
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
            <small className="form-text text-muted">
              Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số.
            </small>
          </div>
          <div className="mb-3">
            <label className="form-label">Xác nhận mật khẩu</label>
            <input
              type="password"
              className="form-control"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Vai trò</label>
            <select className="form-control" value={roleId} onChange={(e) => setRoleId(e.target.value)}>
              <option value="2">Giáo viên</option>
              <option value="3">Học sinh</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary w-100">Đăng ký</button>
        </form>
        <p className="mt-3 text-center">
          Đã có tài khoản? <a href="/login" className="login-link">Đăng nhập</a>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
