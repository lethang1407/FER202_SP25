import React, { useEffect, useState } from "react";
import { Card, Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";

const Student_Home = () => {
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    // Giả sử API lấy dữ liệu từ database.json
    axios.get("http://localhost:8888/quizzes")
      .then(response => {
        setQuizzes(response.data);
      })
      .catch(error => console.error("Error fetching quizzes:", error));
  }, []);

  return (
    <Container className="py-5">
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
                Logout
              </Link>
            </header>
      <h1 className="text-white mb-4">Chọn bài Quiz</h1>
      <Row>
        {quizzes.map((quiz) => (
          <Col key={quiz.id} md={4} sm={6} xs={12} className="mb-4">
            <Card className="text-white shadow-lg p-3" style={{ backgroundColor: "#553f9a" }}>
              <Card.Body>
                <Card.Title className="fs-5">{quiz.title}</Card.Title>
                <Card.Text>{quiz.questions.length} câu hỏi</Card.Text>
                <Link to={`/quiz/${quiz.id}`} className="btn btn-primary btn-sm">
                  Bắt đầu
                </Link>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Student_Home;
