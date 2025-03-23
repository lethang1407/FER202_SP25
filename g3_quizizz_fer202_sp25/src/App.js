import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import QuizCreator from "./Pages/Teacher/QuizCreator";
import QuestionManager from "./Pages/Teacher/QuestionManager";
import TeacherClassManagement from "./Pages/Teacher/TeacherClassManagement";
import OwnerClass from "./Pages/Teacher/OwnerClass";
import LoginPage from "./Pages/LoginPage";
import TeacherHome from "./Pages/Teacher/TeacherHome";
import "bootstrap/dist/css/bootstrap.min.css";
// import HomePage from "./Pages/HomePage";
import GuestQuiz from "./Pages/Guest/GuestQuiz";
import Layout from "./Pages/Layout";
import StudentHome from "./Pages/Student/StudentHome";
import RegisterPage from "./Pages/Register";
import AdminDashboard from "./Pages/Admin/DashBoard";

const getUserRole = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user ? user.role_id : null;
};

const ProtectedRoute = ({ element, roles }) => {
  const userRole = getUserRole();
  return roles.includes(userRole) ? element : <Navigate to="/login" />;
};

const App = () => {
  return (
    <Router>
      <div className="container">
        <Routes>
          {/* <Route path="/" element={<HomePage />} /> */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute element={<AdminDashboard />} roles={[1]} />
            }
          />
          {/* <Route path="/admin/users" 
          element={<ProtectedRoute element={<ManageUser />} roles={[1]} />} /> */}
          <Route
            path="/"
            element={
              <Layout>
                <GuestQuiz />
              </Layout>
            }
          />
          <Route
            path="/questions"
            element={
              <ProtectedRoute element={<QuestionManager />} roles={[2]} />
            }
          />
          <Route
            path="/student-home"
            element={
              <ProtectedRoute
                element={
                  <Layout>
                    <StudentHome />
                  </Layout>
                }
                roles={[3]}
              />
            }
          />
          <Route
            path="/teacher-home"
            element={<ProtectedRoute element={<TeacherHome />} roles={[2]} />}
          />
          <Route
            path="/create-quiz"
            element={<ProtectedRoute element={<QuizCreator />} roles={[2]} />}
          />
          <Route
            path="/manage-classes"
            element={
              <ProtectedRoute
                element={<TeacherClassManagement />}
                roles={[2]}
              />
            }
          />
          <Route
            path="/your-class/:id"
            element={<ProtectedRoute element={<OwnerClass />} roles={[2, 3]} />}
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
