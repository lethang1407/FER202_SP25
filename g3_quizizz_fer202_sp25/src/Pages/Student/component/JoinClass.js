import React, { useState, useEffect } from "react";
import { Form, Button, Alert, Container } from "react-bootstrap";
import axios from "axios";

const JoinClass = () => {
  const [classCode, setClassCode] = useState("");
  const [message, setMessage] = useState(null);
  const [variant, setVariant] = useState("success");
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Lấy user từ localStorage
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUserId(storedUser.id);
    }
  }, []);

  const handleJoinClass = () => {
    if (!classCode.trim()) {
      setMessage("Vui lòng nhập mã lớp!");
      setVariant("danger");
      return;
    }

    axios.get("http://localhost:8888/classes")
      .then((response) => {
        const classes = response.data;
        const foundClass = classes.find(cls => cls.code === classCode);

        if (foundClass) {
          if (foundClass.students.includes(userId)) {
            setMessage(`Bạn đã tham gia lớp ${foundClass.name} rồi!`);
            setVariant("warning");
          } else {
            axios.patch(`http://localhost:8888/classes/${foundClass.id}`, {
              students: [...foundClass.students, userId]
            })
            .then(() => {
              setMessage(`Join class ${foundClass.name} thành công!`);
              setVariant("success");
              setClassCode("");
            })
            .catch(error => {
              console.error("Error joining class:", error);
              setMessage("Có lỗi xảy ra, vui lòng thử lại!");
              setVariant("danger");
            });
          }
        } else {
          setMessage("Mã lớp không hợp lệ!");
          setVariant("danger");
        }
      })
      .catch(error => {
        console.error("Error fetching classes:", error);
        setMessage("Có lỗi xảy ra, vui lòng thử lại!");
        setVariant("danger");
      });
  };

  return (
    <Container className="mt-4">
     

      {message && <Alert variant={variant}>{message}</Alert>}

      <Form.Group className="mb-3">
        <Form.Control
          type="text"
          value={classCode}
          onChange={(e) => setClassCode(e.target.value)}
          placeholder="Nhập mã lớp học"
        />
      </Form.Group>

      <Button variant="primary" onClick={handleJoinClass} disabled={!userId}>
        Tham gia lớp
      </Button>
    </Container>
  );
};

export default JoinClass;
