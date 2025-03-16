import React, { useState, useEffect } from "react";
import { Table, Button, Form, Modal } from "react-bootstrap";
import axios from "axios";

const QuizCreator = () => {
  const [questions, setQuestions] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [quizTitle, setQuizTitle] = useState("");
  const [isGuest, setIsGuest] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [showQuizQuestions, setShowQuizQuestions] = useState(null);

  const teacherId = "3";

  useEffect(() => {
    const fetchQuestionsAndQuizzes = async () => {
      try {
        const [questionsRes, quizzesRes] = await Promise.all([
          axios.get("http://localhost:8888/questions"),
          axios.get("http://localhost:8888/quizzes"),
        ]);

        console.log("Dữ liệu từ API questions:", questionsRes.data);
        console.log("Dữ liệu từ API quizzes:", quizzesRes.data);

        // Lọc câu hỏi theo author_id
        const filteredQuestions = questionsRes.data.filter(
          (q) => Number(q.author_id) === teacherId
        );
        setQuestions(filteredQuestions);

        // Lọc quizzes theo teacher_id
        const filteredQuizzes = quizzesRes.data.filter(
          (quiz) => Number(quiz.teacher_id) === teacherId
        );
        setQuizzes(filteredQuizzes);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu từ API:", error);
      }
    };

    fetchQuestionsAndQuizzes();
  }, []);

  const handleCheckboxChange = (id) => {
    setSelectedQuestions((prev) =>
      prev.includes(id) ? prev.filter((q) => q !== id) : [...prev, id]
    );
  };

  const handleSubmit = () => {
    if (!quizTitle || selectedQuestions.length === 0) {
      alert("Vui lòng nhập tiêu đề và chọn ít nhất một câu hỏi.");
      return;
    }

    const newQuiz = {
      title: quizTitle,
      teacher_id: teacherId,
      questions: selectedQuestions,
      is_guest: isGuest,
    };

    const method = editingQuiz ? "PUT" : "POST";
    const url = editingQuiz
      ? `http://localhost:8888/quizzes/${editingQuiz.id}`
      : "http://localhost:8888/quizzes";

    fetch(url, {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newQuiz),
    }).then(() => {
      alert(editingQuiz ? "Quiz đã được cập nhật!" : "Quiz đã được tạo!");
      setQuizTitle("");
      setSelectedQuestions([]);
      setIsGuest(false);
      setEditingQuiz(null);
      setShowModal(false);
      fetch("http://localhost:8888/quizzes")
        .then((res) => res.json())
        .then((data) => setQuizzes(data));
    });
  };

  const handleEdit = (quiz) => {
    setQuizTitle(quiz.title);
    setSelectedQuestions(quiz.questions);
    setIsGuest(quiz.is_guest);
    setEditingQuiz(quiz);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa quiz này?")) {
      fetch(`http://localhost:8888/quizzes/${id}`, { method: "DELETE" }).then(
        () => {
          setQuizzes(quizzes.filter((quiz) => quiz.id !== id));
        }
      );
    }
  };

  const handleShowModal = () => {
    setEditingQuiz(null);
    setQuizTitle("");
    setSelectedQuestions([]);
    setIsGuest(false);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleQuizClick = (quiz) => {
    if (showQuizQuestions === quiz.id) {
      setShowQuizQuestions(null);
    } else {
      const quizQuestions = quiz.questions.map((questionId) => {
        return questions.find((q) => q.id === questionId);
      });
      setSelectedQuiz(quizQuestions);
      setShowQuizQuestions(quiz.id);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Tạo Quiz</h2>

      <Button variant="primary" onClick={handleShowModal}>
        Tạo Quiz
      </Button>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingQuiz ? "Chỉnh sửa Quiz" : "Tạo Quiz"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Tiêu đề Quiz</Form.Label>
              <Form.Control
                type="text"
                value={quizTitle}
                onChange={(e) => setQuizTitle(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Cho phép khách chơi (Công khai)"
                checked={isGuest}
                onChange={(e) => setIsGuest(e.target.checked)}
              />
            </Form.Group>
          </Form>

          <h4>Chọn câu hỏi</h4>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Chọn</th>
                <th>Câu hỏi</th>
              </tr>
            </thead>
            <tbody>
              {questions.map((q) => (
                <tr key={q.id}>
                  <td>
                    <Form.Check
                      type="checkbox"
                      checked={selectedQuestions.includes(q.id)}
                      onChange={() => handleCheckboxChange(q.id)}
                    />
                  </td>
                  <td>{q.question}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Đóng
          </Button>
          <Button variant="success" onClick={handleSubmit}>
            {editingQuiz ? "Lưu thay đổi" : "Tạo Quiz"}
          </Button>
        </Modal.Footer>
      </Modal>

      <h2 className="mt-5">Danh sách Quizzes</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Số thứ tự</th>
            <th>Tiêu đề</th>
            <th>Chế độ hiển thị</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {quizzes.map((quiz, index) => (
            <tr key={quiz.id}>
              <td>{index + 1}</td>
              <td>{quiz.title}</td>
              <td>{quiz.is_guest ? "Công khai" : "Riêng tư"}</td>
              <td>
                <Button
                  variant="info"
                  onClick={() => handleQuizClick(quiz)}
                  className="me-2"
                >
                  Xem Câu Hỏi
                </Button>
                <Button
                  variant="warning"
                  onClick={() => handleEdit(quiz)}
                  className="me-2"
                >
                  Sửa
                </Button>
                <Button variant="danger" onClick={() => handleDelete(quiz.id)}>
                  Xóa
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {selectedQuiz && selectedQuiz.length > 0 && showQuizQuestions && (
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
                <tr key={question.id}>
                  <td>{question.question}</td>
                  <td>{question.answer}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default QuizCreator;
