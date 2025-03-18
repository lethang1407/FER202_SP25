import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import '../../css/guest.css';

const GuestQuiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [lock, setLock] = useState(false);

  useEffect(() => {
    axios.get("http://localhost:8888/questions")
      .then((response) => {
        const guestQuestions = response.data.slice(0, 3);
        setQuestions(guestQuestions);
      })
      .catch((error) => {
        console.error("Error fetching questions:", error);
      });
  }, []);

  // Reset class mỗi khi câu hỏi thay đổi
  useEffect(() => {
    document.querySelectorAll("li").forEach((li) => {
      li.classList.remove("correct", "wrong");
    });
  }, [currentIndex]);

  const checkAns = (e, answer) => {
    if (lock) return;
    setLock(true);

    if (answer === questions[currentIndex].answer) {
      setScore(score + 1);
      e.target.classList.add("correct");
    } else {
      e.target.classList.add("wrong");
    }
  };

  const nextQuestion = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
      setLock(false);
    } else {
      setQuizFinished(true);
    }
  };

  return (
    <div className="quiz-container">
      <h2>Quiz</h2>
      <hr />
      {!quizFinished ? (
        questions.length > 0 && (
          <div>
            <h3>{questions[currentIndex].question}</h3>
            <ul>
              {questions[currentIndex].options.map((option, index) => (
                <li key={index} onClick={(e) => checkAns(e, option)}>
                  {option}
                </li>
              ))}
            </ul>
            {lock && (
              <button onClick={nextQuestion}>
                {currentIndex + 1 === questions.length ? "Hoàn thành" : "Tiếp theo"}
              </button>
            )}
            <div className="question-index">
              Câu hỏi {currentIndex + 1} / {questions.length}
            </div>
          </div>
        )
      ) : (
        <div>
          <p>
            Bạn đã hoàn thành quiz với số điểm: {score} / {questions.length}
          </p>
          <p>Đăng nhập để tiếp tục chơi nhiều câu hỏi hơn!</p>
          <Link to="/login">Đăng nhập</Link>
        </div>
      )}
    </div>
  );
};

export default GuestQuiz;
