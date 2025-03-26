import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ChangePassword = () => {
  const navigate = useNavigate();

  // Lấy thông tin user từ localStorage
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user")) || {});

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (!user || !user.id) {
      alert("User not found! Please log in again.");
      navigate("/login");
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (passwords.currentPassword !== user.password) {
      alert("Current password is incorrect!");
      return;
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      alert("New passwords do not match!");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8888/accounts/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: passwords.newPassword }),
      });

      if (response.ok) {
        const updatedUser = { ...user, password: passwords.newPassword };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        alert("Password changed successfully!");
        navigate("/profile");
      } else {
        alert("Failed to update password!");
      }
    } catch (error) {
      console.error("Error updating password:", error);
      alert("An error occurred while updating password!");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Change Password</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Current Password</label>
          <input
            type="password"
            className="form-control"
            name="currentPassword"
            value={passwords.currentPassword}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">New Password</label>
          <input
            type="password"
            className="form-control"
            name="newPassword"
            value={passwords.newPassword}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Confirm New Password</label>
          <input
            type="password"
            className="form-control"
            name="confirmPassword"
            value={passwords.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-danger">Change Password</button>
      </form>
    </div>
  );
};

export default ChangePassword;
