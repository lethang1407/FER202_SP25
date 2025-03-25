import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const UpdateProfile = () => {
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem("user"));

  const [updatedUser, setUpdatedUser] = useState({
    username: storedUser?.username || "",
    dob: storedUser?.dob || "",
    gender: storedUser?.gender || "",
    img: storedUser?.img || "img/avt_df.png",
  });

  useEffect(() => {
    if (!storedUser) {
      alert("User not found. Please log in.");
      navigate("/login");
    }
  }, [storedUser, navigate]);

  const handleChange = (e) => {
    setUpdatedUser({ ...updatedUser, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:8888/accounts/${storedUser.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedUser),
      });

      if (response.ok) {
        const updatedData = await response.json();
        localStorage.setItem("user", JSON.stringify(updatedData)); // Cập nhật user trong localStorage
        alert("Profile updated successfully!");
        navigate("/profile");
      } else {
        alert("Failed to update profile!");
      }
    } catch (error) {
      alert("Error connecting to server!");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Update Profile</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Username</label>
          <input type="text" className="form-control" name="username" value={updatedUser.username} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Date of Birth</label>
          <input type="date" className="form-control" name="dob" value={updatedUser.dob} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label className="form-label">Gender</label>
          <select className="form-control" name="gender" value={updatedUser.gender} onChange={handleChange}>
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Profile Image URL</label>
          <input type="text" className="form-control" name="img" value={updatedUser.img} onChange={handleChange} />
        </div>
        <button type="submit" className="btn btn-success">Save Changes</button>
      </form>
    </div>
  );
};

export default UpdateProfile;
