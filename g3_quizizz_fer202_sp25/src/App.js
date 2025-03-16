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
import "bootstrap/dist/css/bootstrap.min.css";

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
      <div className="container mt-4">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/questions"
            element={
              <ProtectedRoute element={<QuestionManager />} roles={[2]} />
            }
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
            element={<ProtectedRoute element={<OwnerClass />} roles={[2]} />}
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
