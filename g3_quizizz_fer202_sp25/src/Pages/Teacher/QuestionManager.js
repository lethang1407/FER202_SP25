import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const QuestionManager = () => {
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState({
    question: "",
    options: ["", "", "", ""],
    answer: "",
    img: "",
  });
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  // Fetch questions on component mount
  useEffect(() => {
    axios.get("http://localhost:8888/questions").then((response) => {
      setQuestions(response.data);
    });
  }, []);

  // Handle input change for new/edited question
  const handleChange = (e) => {
    setNewQuestion({ ...newQuestion, [e.target.name]: e.target.value });
  };

  // Handle option changes (for multiple choice)
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
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingQuestion) {
      axios
        .put(
          `http://localhost:8888/questions/${editingQuestion.id}`,
          newQuestion
        )
        .then((response) => {
          setQuestions(
            questions.map((q) =>
              q.id === editingQuestion.id ? response.data : q
            )
          );
        })
        .catch((error) => {
          console.error("There was an error updating the question:", error);
        });
    } else {
      axios
        .post("http://localhost:8888/questions", newQuestion)
        .then((response) => {
          setQuestions((prev) => [...prev, response.data]);
        })
        .catch((error) => {
          console.error("There was an error adding the question:", error);
        });
    }
    // Reset state after submission
    resetForm();
    setShowPopup(false);
  };

  // Reset the form when closing the modal or after submission
  const resetForm = () => {
    setNewQuestion({
      question: "",
      options: ["", "", "", ""],
      answer: "",
      img: "",
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

  return (
    <div className="container">
      <h2>Question Manager</h2>
      <button
        className="btn btn-primary"
        onClick={() => setShowPopup(true)}
        disabled={showPopup} // Disable "Add Question" if modal is already open
      >
        Add Question
      </button>

      {/* Modal for adding/editing question */}
      {showPopup && (
        <div className="modal d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingQuestion ? "Edit Question" : "Add Question"}
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
                    <label className="form-label">Question</label>
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
                    <label className="form-label">Options</label>
                    {newQuestion.options.map((option, index) => (
                      <div key={index} className="form-check">
                        <input
                          type="text"
                          className="form-control d-inline w-75"
                          value={option}
                          onChange={(e) =>
                            handleOptionChange(index, e.target.value)
                          }
                          required
                        />
                        <input
                          type="radio"
                          name="answer"
                          className="form-check-input ms-2"
                          checked={newQuestion.answer === option}
                          onChange={() => handleAnswerSelect(option)}
                        />
                      </div>
                    ))}
                  </div>
                  <button type="submit" className="btn btn-success">
                    {editingQuestion ? "Update" : "Add"} Question
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
                <h5 className="modal-title">Question Details</h5>
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
                    <h5 className="card-title">{selectedQuestion.question}</h5>
                    <ul className="list-group">
                      {selectedQuestion.options.map((option, index) => (
                        <li
                          key={index}
                          className={`list-group-item ${
                            option === selectedQuestion.answer ? "fw-bold" : ""
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
      <h3 className="mt-4">Existing Questions</h3>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Question</th>
            <th>Answer</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {questions.map((q) => (
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
                  Edit
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(q.id);
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default QuestionManager;
