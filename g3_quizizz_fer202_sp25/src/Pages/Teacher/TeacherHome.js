import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";
import TeacherNavbar from "./component/TeacherNavbar"; 

const TeacherHome = () => {
  const [teacher, setTeacher] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser || storedUser.role_id !== 2) {
      navigate("/login");
      return;
    }
    setTeacher(storedUser);
  }, [navigate]);

  return (
    <>
      <TeacherNavbar />
      <Container className="mt-5 text-center">
        <h2>Chào mừng, {teacher?.username}!</h2>
        <p>
          Bạn đang đăng nhập với vai trò giáo viên. Hãy sử dụng thanh điều hướng
          để quản lý câu hỏi, bài kiểm tra và lớp học.
        </p>
      </Container>
    </>
  );
};

export default TeacherHome;
