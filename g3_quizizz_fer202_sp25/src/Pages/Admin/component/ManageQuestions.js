import React, { useState, useEffect } from "react";
import { Table, Button, Form, Modal } from "react-bootstrap";
import axios from "axios";
import AdminNavbar from "./AdminNavbar";

const ManageQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [questionText, setQuestionText] = useState("");
  const [answer, setAnswer] = useState("");
  const [authorId, setAuthorId] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [questionsRes, teachersRes] = await Promise.all([
          axios.get("http://localhost:8888/questions"),
          axios.get("http://localhost:8888/teachers"),
        ]);
        setQuestions(questionsRes.data);
        setTeachers(teachersRes.data);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu từ API:", error);
      }
    };
    fetchData();
  }, []);

  const handleShowModal = () => {
    setEditingQuestion(null);
    setQuestionText("");
    setAnswer("");
    setAuthorId("");
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSubmit = async () => {
    if (!questionText || !answer || !authorId) {
      alert("Vui lòng nhập đầy đủ thông tin.");
      return;
    }
    const newQuestion = { question: questionText, answer, author_id: authorId };
    const method = editingQuestion ? "PATCH" : "POST";
    const url = editingQuestion
      ? `http://localhost:8888/questions/${editingQuestion.id}`
      : "http://localhost:8888/questions";
    try {
      await axios({ method, url, headers: { "Content-Type": "application/json" }, data: newQuestion });
      alert(editingQuestion ? "Câu hỏi đã được cập nhật!" : "Câu hỏi đã được thêm!");
      setShowModal(false);
      const res = await axios.get("http://localhost:8888/questions");
      setQuestions(res.data);
    } catch (error) {
      console.error("Lỗi khi lưu câu hỏi:", error);
    }
  };

  const handleEdit = (question) => {
    setEditingQuestion(question);
    setQuestionText(question.question);
    setAnswer(question.answer);
    setAuthorId(question.author_id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa câu hỏi này?")) {
      try {
        await axios.delete(`http://localhost:8888/questions/${id}`);
        setQuestions(questions.filter((q) => q.id !== id));
      } catch (error) {
        console.error("Lỗi khi xóa câu hỏi:", error);
      }
    }
  };

  const filteredQuestions = questions.filter((q) =>
    q.question.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedTeacher === "all" || Number(q.author_id) === Number(selectedTeacher))
  );

  return (
    <>
      <AdminNavbar />
      <div className="container mt-4">
        <Button variant="primary" onClick={handleShowModal}>
          Thêm Câu Hỏi
        </Button>
        <Form className="mt-3 d-flex gap-3">
          <Form.Control
            type="text"
            placeholder="Tìm kiếm câu hỏi"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Form.Select
            value={selectedTeacher}
            onChange={(e) => setSelectedTeacher(e.target.value)}
          >
            <option value="all">Tất cả giáo viên</option>
            {teachers.map((teacher) => (
              <option key={teacher.id} value={teacher.id}>
                {teacher.name}
              </option>
            ))}
          </Form.Select>
        </Form>
        <Table striped bordered hover className="mt-3">
          <thead>
            <tr>
              <th>ID</th>
              <th>Câu hỏi</th>
              <th>Đáp án</th>
              <th>Giáo viên</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredQuestions.map((q) => (
              <tr key={q.id}>
                <td>{q.id}</td>
                <td>{q.question}</td>
                <td>{q.answer}</td>
                <td>{teachers.find((t) => t.id === q.author_id)?.name || "Không rõ"}</td>
                <td>
                  <Button variant="warning" onClick={() => handleEdit(q)} className="me-2">
                    Sửa
                  </Button>
                  <Button variant="danger" onClick={() => handleDelete(q.id)}>
                    Xóa
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{editingQuestion ? "Chỉnh sửa Câu Hỏi" : "Thêm Câu Hỏi"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Câu hỏi</Form.Label>
              <Form.Control
                type="text"
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Đáp án</Form.Label>
              <Form.Control type="text" value={answer} onChange={(e) => setAnswer(e.target.value)} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Đóng
          </Button>
          <Button variant="success" onClick={handleSubmit}>
            {editingQuestion ? "Lưu thay đổi" : "Thêm Câu Hỏi"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ManageQuestions;
