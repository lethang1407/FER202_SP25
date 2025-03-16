import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const QuizResults = () => {
  const [quizResults, setQuizResults] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8888/quiz_results").then((response) => {
      setQuizResults(response.data);
    });
    axios.get("http://localhost:8888/quizzes").then((response) => {
      setQuizzes(response.data);
    });
    axios.get("http://localhost:8888/accounts").then((response) => {
      setAccounts(response.data);
    });
  }, []);

  const getQuizTitle = (quizId) => {
    const quiz = quizzes.find((q) => String(q.id) === String(quizId));
    return quiz ? quiz.title : `${quizId}`;
  };

  const getStudentName = (studentId) => {
    const student = accounts.find((s) => s.id === studentId);
    return student ? student.username : "Unknown";
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Quiz Results</h2>
      <table className="table table-striped table-bordered">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Quiz</th>
            <th>Student</th>
            <th>Score</th>
            <th>Attempt</th>
            <th>Start Time</th>
            <th>Submission Time</th>
          </tr>
        </thead>
        <tbody>
          {quizResults.map((result, index) => (
            <tr key={result.id}>
              <td>{index + 1}</td>
              <td>{getQuizTitle(result.quiz_id)}</td>
              <td>{getStudentName(result.student_id)}</td>
              <td>{result.score}%</td>
              <td>{result.attempt}</td>
              <td>{new Date(result.start_time).toLocaleString()}</td>
              <td>{new Date(result.timestamp).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default QuizResults;
