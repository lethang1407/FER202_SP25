import React, { useState, useEffect } from "react";
import { Form, Button, Alert, Container } from "react-bootstrap";
import axios from "axios";

const JoinClass = () => {
  const [classList, setClassList] = useState([]); // Danh sách lớp
  const [selectedClass, setSelectedClass] = useState(""); // Lớp được chọn
  const [message, setMessage] = useState(null);
  const [variant, setVariant] = useState("success");
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Lấy user từ localStorage
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUserId(storedUser.id);
    }

    // Lấy danh sách lớp từ API
    axios
      .get("http://localhost:8888/classes")
      .then((response) => {
        setClassList(response.data);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy danh sách lớp:", error);
        setMessage("Không thể tải danh sách lớp.");
        setVariant("danger");
      });
  }, []);

  const handleJoinClass = () => {
    if (!selectedClass) {
      setMessage("Vui lòng chọn lớp!");
      setVariant("danger");
      return;
    }

    const foundClass = classList.find((cls) => cls.id === selectedClass);

    if (foundClass) {
      if (foundClass.students.includes(userId)) {
        setMessage(`Bạn đã tham gia lớp ${foundClass.name} rồi!`);
        setVariant("warning");
      } else {
        axios
          .patch(`http://localhost:8888/classes/${foundClass.id}`, {
            students: [...foundClass.students, userId],
          })
          .then(() => {
            setMessage(`Tham gia lớp ${foundClass.name} thành công!`);
            setVariant("success");
            setSelectedClass("");
          })
          .catch((error) => {
            console.error("Lỗi khi tham gia lớp:", error);
            setMessage("Có lỗi xảy ra, vui lòng thử lại!");
            setVariant("danger");
          });
      }
    } else {
      setMessage("Lớp học không hợp lệ!");
      setVariant("danger");
    }
  };

  return (
    <Container className="mt-4">
      {message && <Alert variant={variant}>{message}</Alert>}

      <Form.Group className="mb-3">
        <Form.Label>Chọn lớp học</Form.Label>
        <Form.Select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
        >
          <option value="">-- Chọn lớp --</option>
          {classList.map((cls) => (
            <option key={cls.id} value={cls.id}>
              {cls.name} ({cls.code})
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      <Button
        variant="primary"
        onClick={handleJoinClass}
        disabled={!userId || !selectedClass}
      >
        Tham gia lớp
      </Button>
    </Container>
  );
};

export default JoinClass;
