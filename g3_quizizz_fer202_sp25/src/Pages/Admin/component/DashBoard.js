import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Nav, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../../css/admin-dashboard.css";  // Sửa đường dẫn này

import ManageUsers from "./ManageUsers";
import ManageQuizzes from "./ManageQuizzes";
import ManageQuestions from "./ManageQuestions";
import ManageClasses from "./ManageClasses";
import axios from "axios"; // Đặt axios sau các import nội bộ

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [classes, setClasses] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  // const [quizResults, setQuizResults] = useState([]);
  const [activeSection, setActiveSection] = useState("dashboard");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, questionsRes, classesRes, quizzesRes] = await Promise.all([
          axios.get("http://localhost:8888/accounts"),
          axios.get("http://localhost:8888/questions"),
          axios.get("http://localhost:8888/classes"),
          axios.get("http://localhost:8888/quizzes"),
          // axios.get("http://localhost:8888/quiz_results"),
        ]);
        setUsers(usersRes.data);
        setQuestions(questionsRes.data);
        setClasses(classesRes.data);
        setQuizzes(quizzesRes.data);
        // setQuizResults(quizResultsRes.data);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu từ API:", error);
      }
    };
    fetchData();
  }, []);

  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="admin-dashboard d-flex">
      {/* Sidebar */}
      <nav className="sidebar bg-dark text-white p-3">
        <h4 className="text-center">
          <Link to="/admin" className="nav-link text-white">
            Admin Panel
          </Link>
        </h4>

        <ul className="nav flex-column">
          <li className="nav-item">
            <button
              className={`nav-link text-white ${activeSection === "dashboard" ? "fw-bold" : ""}`}
              onClick={() => setActiveSection("dashboard")}
            >
              📊 Dashboard
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link text-white ${activeSection === "users" ? "fw-bold" : ""}`}
              onClick={() => setActiveSection("users")}
            >
              👤 Quản lý người dùng
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link text-white ${activeSection === "classes" ? "fw-bold" : ""}`}
              onClick={() => setActiveSection("classes")}
            >
              🏫 Quản lý lớp học
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link text-white ${activeSection === "quizzes" ? "fw-bold" : ""}`}
              onClick={() => setActiveSection("quizzes")}
            >
              📝 Quản lý bài kiểm tra
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link text-white ${activeSection === "questions" ? "fw-bold" : ""}`}
              onClick={() => setActiveSection("questions")}
            >
              ❓ Quản lý câu hỏi
            </button>
          </li>
          {/* <li className="nav-item">
            <button
              className={`nav-link text-white ${activeSection === "results" ? "fw-bold" : ""}`}
              onClick={() => setActiveSection("results")}
            >
              📑 Kết quả bài kiểm tra
            </button>
          </li> */}
        </ul>

        <div className="mt-4">
          <Nav.Link href="/profile" className="text-info">
            <i className="bi bi-person-circle"></i> View Profile
          </Nav.Link>
          <Button variant="danger" onClick={handleLogout} className="mt-2">
            Logout
          </Button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="content p-4 w-100">
        {activeSection === "dashboard" && (
          <>
            <h2 className="text-center mb-4">📊 Admin Dashboard</h2>
            <div className="row text-center">
              <div className="col-md-3">
                <div className="card p-3 bg-primary text-white">
                  <h5>Người dùng</h5>
                  <p>{users.length}</p>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card p-3 bg-success text-white">
                  <h5>Lớp học</h5>
                  <p>{classes.length}</p>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card p-3 bg-warning text-white">
                  <h5>Bài kiểm tra</h5>
                  <p>{quizzes.length}</p>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card p-3 bg-danger text-white">
                  <h5>Câu hỏi</h5>
                  <p>{questions.length}</p>
                </div>
              </div>
            </div>
          </>
        )}

        {activeSection === "users" && <ManageUsers users={users} />}
        {activeSection === "classes" && <ManageClasses />}
        {activeSection === "quizzes" && <ManageQuizzes />}
        {activeSection === "questions" && <ManageQuestions />}
        {/* {activeSection === "results" && <ManageResults />} */}
      </div>
    </div>
  );
};

export default AdminDashboard;
