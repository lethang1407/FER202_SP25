import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import TeacherNavbar from "./component/TeacherNavbar";

const TeacherClassManagement = () => {
  const [ownedClasses, setOwnedClasses] = useState([]);
  const [joinedClasses, setJoinedClasses] = useState([]);
  const [className, setClassName] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newClassCode, setNewClassCode] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));
  const teacherId = user ? user.id : null; // Lấy ID của giáo viên
  const navigate = useNavigate();

  const fetchClasses = useCallback(async () => {
    try {
      const { data } = await axios.get("http://localhost:8888/classes");

      const owned = data.filter((cls) => cls.teacher_id === teacherId);
      const joined = data.filter(
        (cls) => Array.isArray(cls.students) && cls.students.includes(teacherId)
      );

      setOwnedClasses(owned);
      setJoinedClasses(joined);
    } catch (error) {
      console.error("Error fetching classes:", error);
    }
  }, [teacherId]); // Thêm teacherId vào dependency array của useCallback

  useEffect(() => {
    if (teacherId) {
      fetchClasses();
    }
  }, [teacherId, fetchClasses]); // Thêm fetchClasses vào dependency array

  const generateClassCode = () => {
    return "class-" + Math.random().toString(36).substr(2, 6);
  };

  const createClass = async () => {
    if (!className.trim()) return;
    const newClass = {
      id: Date.now().toString(),
      code: generateClassCode(),
      name: className,
      teacher_id: teacherId,
      students: [],
    };
    try {
      await axios.post("http://localhost:8888/classes", newClass);
      setOwnedClasses([...ownedClasses, newClass]);
      setNewClassCode(newClass.code);
      setShowModal(true);
      setClassName("");
    } catch (error) {
      console.error("Error creating class", error);
    }
  };

  const joinClass = async () => {
    if (!joinCode.trim()) return;
    try {
      const response = await axios.get(
        `http://localhost:8888/classes?code=${joinCode}`
      );
      if (response.data.length > 0) {
        const classToJoin = response.data[0];
        if (classToJoin.teacher_id === teacherId) {
          alert("Bạn không thể tham gia lớp học mà bạn là chủ nhiệm.");
          return;
        }
        if (!classToJoin.students.includes(teacherId)) {
          classToJoin.students.push(teacherId);
          await axios.put(
            `http://localhost:8888/classes/${classToJoin.id}`,
            classToJoin
          );
        }
        alert("Bạn đã tham gia lớp học thành công!");
        setJoinCode(""); // Reset lại input sau khi tham gia
        fetchClasses();
      } else {
        alert("Mã lớp học không tồn tại.");
      }
    } catch (error) {
      console.error("Error joining class", error);
    }
  };

  const deleteClass = async (classId) => {
    try {
      await axios.delete(`http://localhost:8888/classes/${classId}`);
      setOwnedClasses(ownedClasses.filter((cls) => cls.id !== classId));
    } catch (error) {
      console.error("Error deleting class", error);
    }
  };

  const leaveClass = async (classId) => {
    try {
      const classToLeave = joinedClasses.find((cls) => cls.id === classId);
      if (classToLeave) {
        classToLeave.students = classToLeave.students.filter(
          (id) => id !== teacherId
        );
        await axios.put(
          `http://localhost:8888/classes/${classId}`,
          classToLeave
        );
        setJoinedClasses(joinedClasses.filter((cls) => cls.id !== classId));
      }
    } catch (error) {
      console.error("Error leaving class", error);
    }
  };

  return (
    <>
      <TeacherNavbar />
      <div className="container mt-4">
        <div className="card mb-4">
          <div className="card-body">
            <h2 className="card-title">Tạo lớp học</h2>
            <input
              type="text"
              className="form-control mb-2"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              placeholder="Nhập tên lớp"
            />
            <button className="btn btn-primary" onClick={createClass}>
              Tạo lớp
            </button>
          </div>
        </div>

        <div className="card mb-4">
          <div className="card-body">
            <h2 className="card-title">Tham gia lớp học</h2>
            <input
              type="text"
              className="form-control mb-2"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              placeholder="Nhập mã lớp"
            />
            <button className="btn btn-success" onClick={joinClass}>
              Tham gia
            </button>
          </div>
        </div>

        <h2 className="mb-3">Lớp do bạn làm chủ nhiệm</h2>
        {ownedClasses.map((cls) => (
          <div
            key={cls.id}
            className="card mb-2"
            onClick={() => navigate(`/your-class/${cls.id}`)}
          >
            <div className="card-body">
              <h5 className="card-title">{cls.name}</h5>
              <p className="card-text">Mã lớp: {cls.code}</p>
              <button
                className="btn btn-danger"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteClass(cls.id);
                }}
              >
                Xóa lớp
              </button>
            </div>
          </div>
        ))}

        <h2 className="mb-3 mt-4">Lớp bạn tham gia</h2>
        {joinedClasses.map((cls) => (
          <div
            key={cls.id}
            className="card mb-2"
            onClick={() => navigate(`/join-class/${cls.id}`)}
          >
            <div className="card-body">
              <h5 className="card-title">{cls.name}</h5>
              <p className="card-text">Mã lớp: {cls.code}</p>
              <button
                className="btn btn-warning"
                onClick={(e) => {
                  e.stopPropagation();
                  leaveClass(cls.id);
                }}
              >
                Rời lớp
              </button>
            </div>
          </div>
        ))}

        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Mã lớp học</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Mã lớp của bạn: <strong>{newClassCode}</strong>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Đóng
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};

export default TeacherClassManagement;
