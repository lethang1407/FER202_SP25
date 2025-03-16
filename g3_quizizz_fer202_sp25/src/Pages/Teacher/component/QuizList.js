import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

const QuizList = ({ classId }) => {
  const [quizzes, setQuizzes] = useState([]); // Danh sách quizzes trong lớp
  const [availableQuizzes, setAvailableQuizzes] = useState([]); // Danh sách tất cả quizzes
  const [selectedQuiz, setSelectedQuiz] = useState("");

  // Lấy danh sách quizzes của lớp học (Sử dụng useCallback để tránh re-render không cần thiết)
  const fetchQuizzes = useCallback(async () => {
    try {
      const classResponse = await axios.get(
        `http://localhost:8888/classes/${classId}`
      );
      const quizzesData = await axios.get("http://localhost:8888/quizzes");

      // Lọc danh sách quizzes theo danh sách ID trong lớp
      const filteredQuizzes = quizzesData.data.filter((quiz) =>
        classResponse.data.quizzes_id.includes(quiz.id)
      );

      setQuizzes(filteredQuizzes);
      setAvailableQuizzes(quizzesData.data);
    } catch (error) {
      console.error("Lỗi khi tải danh sách quizzes", error);
    }
  }, [classId]); // Đưa classId vào dependency của useCallback

  useEffect(() => {
    fetchQuizzes();
  }, [fetchQuizzes]); // Đưa fetchQuizzes vào dependency của useEffect

  // Hàm thêm quiz vào lớp học
  const addQuizToClass = async () => {
    if (!selectedQuiz) {
      alert("Vui lòng chọn một quiz hợp lệ!");
      return;
    }

    try {
      const classResponse = await axios.get(
        `http://localhost:8888/classes/${classId}`
      );

      // Không dùng parseInt để so sánh ID
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
      fetchQuizzes(); // Cập nhật lại danh sách mà không cần load trang
      setSelectedQuiz("");
    } catch (error) {
      console.error("Lỗi khi thêm quiz", error);
    }
  };

  // Hàm xóa quiz khỏi lớp học
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
            {quiz.title}
            <button
              className="btn btn-danger btn-sm"
              onClick={() => removeQuizFromClass(quiz.id)}
            >
              Xóa
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default QuizList;
