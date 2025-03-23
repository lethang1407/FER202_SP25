import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../css/admin-dashboard.css";
import ManageUsers from "./ManageUsers";
// import ManageClasses from "./ManageClasses";
// import ManageQuizzes from "./ManageQuizzes";
// import ManageQuestions from "./ManageQuestions";
// import ManageResults from "./ManageResults";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  // const [questions, setQuestions] = useState([]);
  // const [classes, setClasses] = useState([]);
  // const [quizzes, setQuizzes] = useState([]);
  // const [quizResults, setQuizResults] = useState([]);
  const [activeSection, setActiveSection] = useState("dashboard");

  useEffect(() => {
    fetch("http://localhost:8888/accounts").then(res => res.json()).then(setUsers);
    // fetch("http://localhost:8888/questions").then(res => res.json()).then(setQuestions);
    // fetch("http://localhost:8888/classes").then(res => res.json()).then(setClasses);
    // fetch("http://localhost:8888/quizzes").then(res => res.json()).then(setQuizzes);
    // fetch("http://localhost:8888/quiz_results").then(res => res.json()).then(setQuizResults);
  }, []);

  return (
    <div className="admin-dashboard d-flex">
      <nav className="sidebar bg-dark text-white p-3">
        <h4 className="text-center"><Link to="/admin" className="nav-link text-white">Admin Panel</Link></h4>
        <ul className="nav flex-column">
          <li className="nav-item">
            <button className="nav-link text-white" onClick={() => setActiveSection("users")}>Quản lý người dùng</button>
          </li>
          {/* <li className="nav-item">
            <button className="nav-link text-white" onClick={() => setActiveSection("classes")}>Quản lý lớp học</button>
          </li>
          <li className="nav-item">
            <button className="nav-link text-white" onClick={() => setActiveSection("quizzes")}>Quản lý bài kiểm tra</button>
          </li>
          <li className="nav-item">
            <button className="nav-link text-white" onClick={() => setActiveSection("questions")}>Quản lý câu hỏi</button>
          </li>
          <li className="nav-item">
            <button className="nav-link text-white" onClick={() => setActiveSection("results")}>Kết quả bài kiểm tra</button>
          </li> */}
        </ul>
      </nav>

      <div className="content p-4 w-100">
        {activeSection === "dashboard" && (
          <>
            <h2 className="text-center mb-4">Admin Dashboard</h2>
            <div className="row text-center">
              <div className="col-md-3"><div className="card p-3 bg-primary text-white"><h5>Người dùng</h5><p>{users.length}</p></div></div>
              {/* <div className="col-md-3"><div className="card p-3 bg-success text-white"><h5>Lớp học</h5><p>{classes.length}</p></div></div>
              <div className="col-md-3"><div className="card p-3 bg-warning text-white"><h5>Bài kiểm tra</h5><p>{quizzes.length}</p></div></div>
              <div className="col-md-3"><div className="card p-3 bg-danger text-white"><h5>Câu hỏi</h5><p>{questions.length}</p></div></div> */}
            </div>
          </>
        )}

        {activeSection === "users" && <ManageUsers users={users} />}
        {/* {activeSection === "classes" && <ManageClasses classes={classes} />}
        {activeSection === "quizzes" && <ManageQuizzes quizzes={quizzes} />}
        {activeSection === "questions" && <ManageQuestions questions={questions} />}
        {activeSection === "results" && <ManageResults results={quizResults} />} */}
      </div>
    </div>
  );
};

export default AdminDashboard;
