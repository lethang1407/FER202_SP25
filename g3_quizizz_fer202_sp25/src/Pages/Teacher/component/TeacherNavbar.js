import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";

const TeacherNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Lấy đường dẫn hiện tại

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mx-auto">
            <Nav.Link
              href="/teacher-home"
              className={
                location.pathname === "/teacher-home"
                  ? "fw-bold text-light"
                  : ""
              }
            >
              Trang giáo viên
            </Nav.Link>
            <Nav.Link
              href="/questions"
              className={
                location.pathname === "/questions" ? "fw-bold text-light" : ""
              }
            >
              Quản lý câu hỏi
            </Nav.Link>
            <Nav.Link
              href="/create-quiz"
              className={
                location.pathname === "/create-quiz" ? "fw-bold text-light" : ""
              }
            >
              Quản lí Quizzes
            </Nav.Link>
            <Nav.Link
              href="/manage-classes"
              className={
                location.pathname === "/manage-classes"
                  ? "fw-bold text-light"
                  : ""
              }
            >
              Quản lý lớp học
            </Nav.Link>
          </Nav>
          <Nav>
            <Nav.Link onClick={handleLogout} className="text-danger">
              Đăng xuất
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default TeacherNavbar;
