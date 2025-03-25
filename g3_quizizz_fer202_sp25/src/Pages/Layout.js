import React from "react";
import { Link } from "react-router-dom";
import "../css/layout.css"; // Import file CSS
const Layout = ({ children }) => {
  return (
    <div>
      {/* Header */}
      <header className="header">
        {/* Logo */}
        <Link to="/" className="logo">
          QuizApp
        </Link>

        {/* Thanh tìm kiếm */}
        <input
          type="text"
          placeholder="Tìm kiếm câu hỏi"
          className="search-box"
        />
      
        
        {/* Đăng nhập */}
        <Link to="/login" className="login-btn">
          Đăng nhập
        </Link>
      </header>

      {/* Nội dung chính */}
      <main className="main-content">{children}</main>
    </div>
  );
};

export default Layout;
