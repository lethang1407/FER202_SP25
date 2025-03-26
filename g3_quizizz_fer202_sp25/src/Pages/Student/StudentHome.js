"use client"

import { useEffect, useState } from "react"
import { Alert, Button, Card, Container } from "react-bootstrap"
import JoinClass from "./component/JoinClass"
import {  Nav } from "react-bootstrap";
const StudentHome = () => {
  const [questions, setQuestions] = useState([])
  const [selectedAnswers, setSelectedAnswers] = useState({})
  const [score, setScore] = useState(null)
  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState("")
  const [alertVariant, setAlertVariant] = useState("success")
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch questions from API
    fetch("http://localhost:8888/questions")
      .then((response) => response.json())
      .then((data) => {
        setQuestions(data)
        setLoading(false)
      })
      .catch((error) => {
        console.error("Error fetching questions:", error)
        setLoading(false)
      })
  }, [])

  const handleSelectAnswer = (id, value) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [id]: value,
    }))
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const handleSubmitTest = () => {
    // Check if all questions have been answered
    const unanswered = questions.some((q) => !selectedAnswers[q.id])
    if (unanswered) {
      showAlertMessage("⚠️ Bạn cần chọn hết đáp án trước khi nộp bài!", "danger")
      return
    }

    // Calculate score
    let newScore = 0
    questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.answer) {
        newScore += 1
      }
    })

    setScore(newScore)
    showAlertMessage(`🎉 Bạn đã đạt ${newScore} / ${questions.length} điểm!`, "success")
  }

  const showAlertMessage = (message, variant) => {
    setAlertMessage(message)
    setAlertVariant(variant)
    setShowAlert(true)
    setTimeout(() => setShowAlert(false), 3000)
  }

  // Calculate progress
  const answeredCount = Object.keys(selectedAnswers).length
  const totalQuestions = questions.length
  const progressPercentage = totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4">📚 Student Dashboard</h2>
      <Nav>
        <Nav.Link href="/profile" className="text-info">
              <i className="bi bi-person-circle"></i> View Profile
            </Nav.Link>
       </Nav>
      <Card className="mb-4 p-3 shadow-sm">
        <Card.Body>
          <h4 className="mb-3">Tham gia lớp học</h4>
          <JoinClass />
        </Card.Body>
      </Card>

      {showAlert && (
        <Alert variant={alertVariant} className="text-center mb-4">
          {alertMessage}
        </Alert>
      )}

      <Card className="p-3 shadow-sm">
        <Card.Body>
          <h4 className="mb-3">📝 Bài kiểm tra</h4>

          {loading ? (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2">Đang tải câu hỏi...</p>
            </div>
          ) : questions.length > 0 ? (
            <>
              {/* Progress bar */}
              <div className="progress mb-3">
                <div
                  className="progress-bar"
                  role="progressbar"
                  style={{ width: `${progressPercentage}%` }}
                  aria-valuenow={progressPercentage}
                  aria-valuemin="0"
                  aria-valuemax="100"
                ></div>
              </div>
              <div className="text-end mb-3">
                <small>
                  Đã trả lời: {answeredCount}/{totalQuestions}
                </small>
              </div>

              {/* Current question */}
              <div className="mb-4">
                <div className="mb-3 fs-5 fw-bold">
                  Câu hỏi {currentQuestionIndex + 1}: {questions[currentQuestionIndex].question}
                </div>

                <div className="d-grid gap-2">
                  {questions[currentQuestionIndex].options.map((option, index) => (
                    <div
                      key={index}
                      onClick={() => handleSelectAnswer(questions[currentQuestionIndex].id, option)}
                      className={`p-3 border rounded cursor-pointer ${
                        selectedAnswers[questions[currentQuestionIndex].id] === option
                          ? "bg-primary text-white"
                          : "bg-light"
                      }`}
                    >
                      <div className="d-flex align-items-center">
                        <div
                          className={`me-3 rounded-circle d-flex justify-content-center align-items-center ${
                            selectedAnswers[questions[currentQuestionIndex].id] === option
                              ? "bg-white text-primary"
                              : "border"
                          }`}
                          style={{ width: "24px", height: "24px" }}
                        >
                          {selectedAnswers[questions[currentQuestionIndex].id] === option && (
                            <i className="bi bi-check-circle-fill"></i>
                          )}
                        </div>
                        <span>{option}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation buttons */}
              <div className="d-flex justify-content-between mt-4">
                <Button
                  variant="outline-secondary"
                  onClick={handlePreviousQuestion}
                  disabled={currentQuestionIndex === 0}
                >
                  ← Câu trước
                </Button>

                {currentQuestionIndex < questions.length - 1 ? (
                  <Button variant="primary" onClick={handleNextQuestion}>
                    Câu tiếp theo →
                  </Button>
                ) : (
                  <Button variant="success" onClick={handleSubmitTest} disabled={answeredCount < totalQuestions}>
                    ✅ Nộp bài
                  </Button>
                )}
              </div>
            </>
          ) : (
            <div className="text-center py-4">
              <p>Không có câu hỏi nào.</p>
            </div>
          )}

          {score !== null && (
            <Alert variant="info" className="mt-4 text-center">
              <strong>
                🎯 Bạn đã đạt {score} / {questions.length} điểm!
              </strong>
            </Alert>
          )}
        </Card.Body>
      </Card>
    </Container>
  )
}

export default StudentHome

