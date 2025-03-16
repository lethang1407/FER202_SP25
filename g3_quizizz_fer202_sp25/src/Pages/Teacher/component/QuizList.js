import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

const QuizList = ({ classId }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [availableQuizzes, setAvailableQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState("");
  const [editingQuizId, setEditingQuizId] = useState(null);
  const [newDuration, setNewDuration] = useState("");

  // Lấy danh sách quizzes của lớp
  const fetchQuizzes = useCallback(async () => {
    try {
      const classResponse = await axios.get(
        `http://localhost:8888/classes/${classId}`
      );
      const quizzesData = await axios.get("http://localhost:8888/quizzes");

      // Lọc danh sách quizzes theo lớp
      const filteredQuizzes = quizzesData.data.filter((quiz) =>
        classResponse.data.quizzes_id.includes(quiz.id)
      );

      setQuizzes(filteredQuizzes);
      setAvailableQuizzes(quizzesData.data);
    } catch (error) {
      console.error("Lỗi khi tải danh sách quizzes", error);
    }
  }, [classId]);

  useEffect(() => {
    fetchQuizzes();
  }, [fetchQuizzes]);

  // Thêm quiz vào lớp
  const addQuizToClass = async () => {
    if (!selectedQuiz) {
      alert("Vui lòng chọn một quiz hợp lệ!");
      return;
    }

    try {
      const classResponse = await axios.get(
        `http://localhost:8888/classes/${classId}`
      );

      if (classResponse.data.quizzes_id.includes(selectedQuiz)) {
        alert("Quiz này đã có trong danh sách!");
        return;
      }

      const updatedQuizzes = [...classResponse.data.quizzes_id, selectedQuiz];

      await axios.put(`http://localhost:8888/classes/${classId}`, {
        ...classResponse.data,
        quizzes_id: updatedQuizzes,
      });

      alert("Thêm quiz thành công!");
      fetchQuizzes();
      setSelectedQuiz("");
    } catch (error) {
      console.error("Lỗi khi thêm quiz", error);
    }
  };

  // Xóa quiz khỏi lớp
  const removeQuizFromClass = async (quizId) => {
    try {
      const classResponse = await axios.get(
        `http://localhost:8888/classes/${classId}`
      );

      const updatedQuizzes = classResponse.data.quizzes_id.filter(
        (id) => id !== quizId
      );

      await axios.put(`http://localhost:8888/classes/${classId}`, {
        ...classResponse.data,
        quizzes_id: updatedQuizzes,
      });

      alert("Đã xóa quiz khỏi lớp!");
      fetchQuizzes();
    } catch (error) {
      console.error("Lỗi khi xóa quiz", error);
    }
  };

  // Bắt đầu chỉnh sửa thời gian
  const startEditingDuration = (quiz) => {
    setEditingQuizId(quiz.id);
    setNewDuration(quiz.duration || "");
  };

  // Lưu thời gian làm bài mới
  const saveNewDuration = async (quizId) => {
    try {
      await axios.patch(`http://localhost:8888/quizzes/${quizId}`, {
        duration: newDuration === "" ? null : Number(newDuration),
      });

      alert("Cập nhật thời gian thành công!");
      setEditingQuizId(null);
      fetchQuizzes();
    } catch (error) {
      console.error("Lỗi khi cập nhật thời gian làm bài", error);
    }
  };

  return (
    <div className="mt-4">
      <h3>Danh sách Quizzes</h3>

      <div className="mb-3 d-flex">
        <select
          className="form-select me-2"
          value={selectedQuiz}
          onChange={(e) => setSelectedQuiz(e.target.value)}
        >
          <option value="">Chọn quiz</option>
          {availableQuizzes.map((quiz) => (
            <option key={quiz.id} value={quiz.id}>
              {quiz.title}
            </option>
          ))}
        </select>
        <button className="btn btn-primary" onClick={addQuizToClass}>
          Thêm Quiz
        </button>
      </div>

      <ul className="list-group">
        {quizzes.map((quiz) => (
          <li
            key={quiz.id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            <div>
              <strong>{quiz.title}</strong> -{" "}
              {quiz.duration !== null
                ? `${quiz.duration} phút`
                : "Không có thời hạn"}
            </div>
            <div>
              {editingQuizId === quiz.id ? (
                <>
                  <input
                    type="number"
                    className="form-control d-inline-block"
                    style={{ width: "80px", marginRight: "8px" }}
                    value={newDuration}
                    onChange={(e) => setNewDuration(e.target.value)}
                    min="1"
                  />
                  <button
                    className="btn btn-success btn-sm me-2"
                    onClick={() => saveNewDuration(quiz.id)}
                  >
                    Lưu
                  </button>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => setEditingQuizId(null)}
                  >
                    Hủy
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => startEditingDuration(quiz)}
                  >
                    Sửa
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => removeQuizFromClass(quiz.id)}
                  >
                    Xóa
                  </button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default QuizList;
