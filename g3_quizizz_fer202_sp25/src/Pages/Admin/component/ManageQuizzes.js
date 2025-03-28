import React, { useState, useEffect } from "react";
import { Table, Button, Form } from "react-bootstrap";
import axios from "axios";
import AdminNavbar from "./AdminNavbar";

const ManageQuizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterGuest, setFilterGuest] = useState("all");
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [showQuizQuestions, setShowQuizQuestions] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [quizzesRes, questionsRes] = await Promise.all([
          axios.get("http://localhost:8888/quizzes"),
          axios.get("http://localhost:8888/questions"),
        ]);
        setQuizzes(quizzesRes.data);
        setQuestions(questionsRes.data);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu từ API:", error);
      }
    };
    fetchData();
  }, []);

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa quiz này?")) {
      axios.delete(`http://localhost:8888/quizzes/${id}`).then(() => {
        setQuizzes((prevQuizzes) => prevQuizzes.filter((quiz) => quiz.id !== id));
      });
    }
  };

  const handleQuizClick = (quiz) => {
    if (showQuizQuestions === quiz.id) {
      setShowQuizQuestions(null);
      setSelectedQuiz(null);
    } else {
      const quizQuestions = quiz.questions.map((questionId) =>
        questions.find((q) => q.id === questionId)
      );
      setSelectedQuiz(quizQuestions);
      setShowQuizQuestions(quiz.id);
    }
  };

  const filteredQuizzes = quizzes.filter(
    (quiz) =>
      quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterGuest === "all" || (filterGuest === "guest" ? quiz.is_guest : !quiz.is_guest))
  );

  return (
    <>
      <AdminNavbar />
      <div className="container mt-4">
        <h2>Quản lý Quiz</h2>
        <Form className="mt-3 d-flex gap-3">
          <Form.Control
            type="text"
            placeholder="Tìm kiếm theo tiêu đề"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Form.Select value={filterGuest} onChange={(e) => setFilterGuest(e.target.value)}>
            <option value="all">Tất cả</option>
            <option value="guest">Công khai</option>
            <option value="private">Riêng tư</option>
          </Form.Select>
        </Form>

        <Table striped bordered hover className="mt-4">
          <thead>
            <tr>
              <th>Số thứ tự</th>
              <th>Tiêu đề</th>
              <th>Chế độ hiển thị</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredQuizzes.map((quiz, index) => (
              <tr key={quiz.id}>
                <td>{index + 1}</td>
                <td>{quiz.title}</td>
                <td>{quiz.is_guest ? "Công khai" : "Riêng tư"}</td>
                <td>
                  <Button variant="info" onClick={() => handleQuizClick(quiz)} className="me-2">
                    Xem Câu Hỏi
                  </Button>
                  <Button variant="danger" onClick={() => handleDelete(quiz.id)}>
                    Xóa
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {selectedQuiz && showQuizQuestions && (
          <div>
            <h4>Câu hỏi trong Quiz</h4>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Câu hỏi</th>
                  <th>Đáp án</th>
                </tr>
              </thead>
              <tbody>
                {selectedQuiz.map((question) => (
                  <tr key={question?.id}>
                    <td>{question?.question || "Câu hỏi không tồn tại"}</td>
                    <td>{question?.answer || "Không có đáp án"}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </div>
    </>
  );
};

export default ManageQuizzes;
