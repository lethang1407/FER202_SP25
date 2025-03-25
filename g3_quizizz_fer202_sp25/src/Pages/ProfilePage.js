import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const [showActions, setShowActions] = useState(false);

  if (!user) return <p className="text-danger">User not found</p>;
  const getHomeRoute = () => {
    switch (user.role) {
      case "admin":
        return "/admin/*";
      case "student":
        return "/student-home";
      default:
        return "/teacher-home";
    }
  };
 

  return (
    <div className="container mt-4 text-center">
      <h2>Profile</h2>
      <img src={user.img || "img/avt_df.png"} alt="Profile" className="img-thumbnail rounded-circle" width="150" />
      <p><strong>Username:</strong> {user.username}</p>
      <p><strong>Date of Birth:</strong> {user.dob || "N/A"}</p>
      <p><strong>Gender:</strong> {user.gender || "N/A"}</p>
      <p><strong>Role:</strong> {user.role}</p>

      <button className="btn btn-primary mt-3 me-2" onClick={() => setShowActions(!showActions)}>
        {showActions ? "Hide Options" : "View Profile"}
      </button>

      {showActions && (
        <div className="mt-3">
          <button className="btn btn-warning me-2" onClick={() => navigate("/update-profile")}>
            Update Profile
          </button>
          <button className="btn btn-danger me-2" onClick={() => navigate("/change-password")}>
            Change Password
          </button>
        </div>
      )}

       {/* Nút Back */}
      <div className="mt-4">
        <button className="btn btn-outline-secondary" onClick={() => navigate(getHomeRoute())}>
          Back
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
