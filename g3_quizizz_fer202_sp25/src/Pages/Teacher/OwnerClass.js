import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import StudentList from "./component/StudentList";
import ClassInfo from "./component/ClassInfo";
import QuizList from "./component/QuizList";

const OwnerClass = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("students");
  const [classInfo, setClassInfo] = useState(null);
  const [students, setStudents] = useState([]);
  const [newClassName, setNewClassName] = useState("");
  const [newClassCode, setNewClassCode] = useState("");

  const fetchClassDetails = useCallback(async () => {
    try {
      const classResponse = await axios.get(
        `http://localhost:8888/classes/${id}`
      );
      setClassInfo(classResponse.data);
      setNewClassName(classResponse.data.name);
      setNewClassCode(classResponse.data.code);

      if (classResponse.data.students.length > 0) {
        const studentsResponse = await axios.get(
          "http://localhost:8888/accounts"
        );

        // So sánh trực tiếp ID thay vì ép kiểu
        const studentDetails = studentsResponse.data.filter((acc) =>
          classResponse.data.students.includes(acc.id)
        );
        setStudents(studentDetails);
      }
    } catch (error) {
      console.error("Lỗi khi lấy thông tin lớp học", error);
    }
  }, [id]);

  useEffect(() => {
    fetchClassDetails();
  }, [fetchClassDetails]);

  const updateClassInfo = async () => {
    try {
      await axios.put(`http://localhost:8888/classes/${id}`, {
        ...classInfo,
        name: newClassName,
        code: newClassCode,
      });
      alert("Cập nhật thông tin lớp học thành công!");
      fetchClassDetails();
    } catch (error) {
      console.error("Error updating class info", error);
    }
  };

  const removeStudent = async (studentId) => {
    try {
      const updatedStudents = classInfo.students.filter(
        (sId) => sId !== studentId
      );
      await axios.put(`http://localhost:8888/classes/${id}`, {
        ...classInfo,
        students: updatedStudents,
      });

      alert("Đã xóa học sinh khỏi lớp!");
      fetchClassDetails();
    } catch (error) {
      console.error("Error removing student", error);
    }
  };

  return (
    <div className="container mt-4">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <ul className="navbar-nav">
          <li className="nav-item">
            <button
              className="nav-link"
              onClick={() => navigate("/manage-classes")}
            >
              Home
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "students" ? "active" : ""}`}
              onClick={() => setActiveTab("students")}
            >
              Danh sách học sinh
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${
                activeTab === "classInfo" ? "active" : ""
              }`}
              onClick={() => setActiveTab("classInfo")}
            >
              Thông tin lớp học
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "quizzes" ? "active" : ""}`}
              onClick={() => setActiveTab("quizzes")}
            >
              Danh sách Quiz
            </button>
          </li>
        </ul>
      </nav>

      {/* Nội dung */}
      <div className="mt-4">
        {activeTab === "students" && (
          <StudentList students={students} removeStudent={removeStudent} />
        )}
        {activeTab === "classInfo" && (
          <ClassInfo
            newClassName={newClassName}
            setNewClassName={setNewClassName}
            newClassCode={newClassCode}
            setNewClassCode={setNewClassCode}
            updateClassInfo={updateClassInfo}
          />
        )}
        {activeTab === "quizzes" && <QuizList classId={id} />}
      </div>
    </div>
  );
};

export default OwnerClass;
