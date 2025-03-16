import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import TeacherNavbar from "./component/TeacherNavbar";

const QuestionManager = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const teacherId = user ? user.id : null; // Lấy ID của giáo viên
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState({
    question: "",
    options: ["", "", "", ""],
    answer: "",
    author_id: teacherId,
  });
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [, setLoading] = useState(false);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch questions on component mount
  useEffect(() => {
    if (!teacherId) return;

    fetch(`http://localhost:8888/questions?author_id=${teacherId}`)
      .then((res) => res.json())
      .then((data) => {
        setQuestions(data);
      })
      .catch((err) => console.error("Lỗi khi lấy câu hỏi:", err));
  }, [teacherId]); // Thêm teacherId vào đây

  console.log(teacherId);

  // Handle input change for new/edited question
  const handleChange = (e) => {
    setNewQuestion({ ...newQuestion, [e.target.name]: e.target.value });
  };

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...newQuestion.options];
    updatedOptions[index] = value;
    setNewQuestion({ ...newQuestion, options: updatedOptions });
  };

  // Set the answer for the question
  const handleAnswerSelect = (answer) => {
    setNewQuestion({ ...newQuestion, answer });
  };

  // Submit new or edited question
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra xem đã chọn đáp án chưa
    if (!newQuestion.answer) {
      alert("Bạn phải chọn một đáp án!");
      return;
    }

    setLoading(true);

    try {
      if (editingQuestion) {
        const response = await axios.put(
          `http://localhost:8888/questions/${editingQuestion.id}`,
          newQuestion
        );
        setQuestions(
          questions.map((q) =>
            q.id === editingQuestion.id ? response.data : q
          )
        );
      } else {
        const response = await axios.post(
          "http://localhost:8888/questions",
          newQuestion
        );
        setQuestions((prev) => [...prev, response.data]);
      }
      resetForm();
      setShowPopup(false);
    } catch (error) {
      console.error("Lỗi khi gửi dữ liệu:", error);
    }

    setLoading(false);
  };

  // Reset the form when closing the modal or after submission
  const resetForm = () => {
    setNewQuestion({
      question: "",
      options: ["", "", "", ""],
      answer: "",
      author_id: teacherId,
    });
    setEditingQuestion(null);
  };

  // Open the modal for editing a question
  const handleEdit = (question) => {
    setNewQuestion(question);
    setEditingQuestion(question);
    setShowPopup(true);
  };

  // Delete a question
  const handleDelete = (id) => {
    axios.delete(`http://localhost:8888/questions/${id}`).then(() => {
      setQuestions(questions.filter((q) => q.id !== id));
    });
  };

  // View details of a selected question
  const handleQuestionClick = (question) => {
    setSelectedQuestion(question);
  };

  // Close the question details modal
  const handleCloseDetails = () => {
    setSelectedQuestion(null);
  };

  // Close the modal and reset form
  const handleClosePopup = () => {
    resetForm();
    setShowPopup(false);
  };

  useEffect(() => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    setFilteredQuestions(
      questions.filter(
        (q) =>
          q.question.toLowerCase().includes(lowerSearchTerm) ||
          q.answer.toLowerCase().includes(lowerSearchTerm)
      )
    );
  }, [searchTerm, questions]);

  return (
    <>
      <TeacherNavbar />
      <div className="container">
        <h2 className="text-center">Quản lí câu hỏi</h2>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <button
            className="btn btn-primary"
            onClick={() => setShowPopup(true)}
            disabled={showPopup}
          >
            Tạo câu hỏi
          </button>
          <input
            type="text"
            className="form-control ms-auto"
            style={{ width: "300px" }}
            placeholder="Tìm kiếm câu hỏi hoặc đáp án..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {/* Modal for adding/editing question */}
        {showPopup && (
          <div className="modal d-block" tabIndex="-1">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    {editingQuestion ? "Chỉnh sửa" : "Tạo câu hỏi"}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={handleClosePopup}
                  ></button>
                </div>
                <div className="modal-body">
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label className="form-label">Câu hỏi</label>
                      <input
                        type="text"
                        className="form-control"
                        name="question"
                        value={newQuestion.question}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Lựa chọn</label>
                      <div className="d-flex flex-column gap-2">
                        {newQuestion.options.map((option, index) => (
                          <div
                            key={index}
                            className={`p-2 border rounded d-flex justify-content-between align-items-center
          ${
            newQuestion.answer && newQuestion.answer === option
              ? "bg-success text-white"
              : ""
          }`}
                            style={{ cursor: "pointer" }}
                            onClick={() => handleAnswerSelect(option)}
                          >
                            <input
                              type="text"
                              className="form-control me-2"
                              value={option}
                              onChange={(e) =>
                                handleOptionChange(index, e.target.value)
                              }
                              placeholder="Nhập đáp án..."
                              required
                            />
                            {newQuestion.answer &&
                              newQuestion.answer === option && <span></span>}
                          </div>
                        ))}
                      </div>
                    </div>
                    <button type="submit" className="btn btn-success">
                      {editingQuestion ? "Cập nhật" : "Tạo"} Câu hỏi
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal for viewing question details */}
        {selectedQuestion && (
          <div className="modal d-block" tabIndex="-1">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Mô tả câu hỏi</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={handleCloseDetails}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="card">
                    {selectedQuestion.img && (
                      <img
                        src={selectedQuestion.img}
                        className="card-img-top"
                        alt="Question"
                      />
                    )}
                    <div className="card-body">
                      <h5 className="card-title">
                        {selectedQuestion.question}
                      </h5>
                      <ul className="list-group">
                        {selectedQuestion.options.map((option, index) => (
                          <li
                            key={index}
                            className={`list-group-item ${
                              option === selectedQuestion.answer
                                ? "fw-bold"
                                : ""
                            }`}
                          >
                            {option}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Existing Questions Table */}
        <h3 className="mt-4">Danh sách câu hỏi</h3>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Câu hỏi</th>
              <th>Đáp án</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredQuestions.map((q) => (
              <tr
                key={q.id}
                onClick={() => handleQuestionClick(q)}
                style={{ cursor: "pointer" }}
              >
                <td>{q.question}</td>
                <td>
                  <strong>{q.answer}</strong>
                </td>
                <td>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(q);
                    }}
                  >
                    Sửa
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(q.id);
                    }}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default QuestionManager;
