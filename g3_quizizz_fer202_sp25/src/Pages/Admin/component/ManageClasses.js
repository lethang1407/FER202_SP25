    import React, { useState, useEffect } from "react";
    import { Table, Button, Form, Modal } from "react-bootstrap";
    import axios from "axios";
    import AdminNavbar from "./AdminNavbar";

    const ManageClasses = () => {
    const [classes, setClasses] = useState([]);
    const [className, setClassName] = useState("");
    const [editingClass, setEditingClass] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        axios.get("http://localhost:8888/classes").then((res) => {
        setClasses(res.data);
        });
    }, []);

    const handleSubmit = () => {
        if (!className) {
        alert("Vui lòng nhập tên lớp học.");
        return;
        }

        const newClass = { name: className };
        const method = editingClass ? "PATCH" : "POST";
        const url = editingClass
        ? `http://localhost:8888/classes/${editingClass.id}`
        : "http://localhost:8888/classes";

        axios({ method, url, data: newClass }).then(() => {
        alert(editingClass ? "Lớp học đã được cập nhật!" : "Lớp học đã được tạo!");
        setClassName("");
        setEditingClass(null);
        setShowModal(false);
        axios.get("http://localhost:8888/classes").then((res) => {
            setClasses(res.data);
        });
        });
    };

    const handleEdit = (classItem) => {
        setClassName(classItem.name);
        setEditingClass(classItem);
        setShowModal(true);
    };

    const handleDelete = (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa lớp học này?")) {
        axios.delete(`http://localhost:8888/classes/${id}`).then(() => {
            setClasses((prevClasses) => prevClasses.filter((c) => c.id !== id));
        });
        }
    };

    const filteredClasses = classes.filter((c) =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
        <AdminNavbar />
        <div className="container mt-4">
            <Button variant="primary" onClick={() => setShowModal(true)}>
            Thêm Lớp Học
            </Button>

            <Form className="mt-3">
            <Form.Control
                type="text"
                placeholder="Tìm kiếm lớp học"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            </Form>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
            <Modal.Header closeButton>
                <Modal.Title>{editingClass ? "Chỉnh sửa lớp học" : "Thêm lớp học"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                <Form.Group className="mb-3">
                    <Form.Label>Tên lớp học</Form.Label>
                    <Form.Control
                    type="text"
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                    />
                </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowModal(false)}>
                Đóng
                </Button>
                <Button variant="success" onClick={handleSubmit}>
                {editingClass ? "Lưu thay đổi" : "Thêm lớp"}
                </Button>
            </Modal.Footer>
            </Modal>

            <h2 className="mt-5">Danh sách Lớp Học</h2>
            <Table striped bordered hover>
            <thead>
                <tr>
                <th>Số thứ tự</th>
                <th>Tên lớp</th>
                <th>Hành động</th>
                </tr>
            </thead>
            <tbody>
                {filteredClasses.map((classItem, index) => (
                <tr key={classItem.id}>
                    <td>{index + 1}</td>
                    <td>{classItem.name}</td>
                    <td>
                    <Button
                        variant="warning"
                        onClick={() => handleEdit(classItem)}
                        className="me-2"
                    >
                        Sửa
                    </Button>
                    <Button
                        variant="danger"
                        onClick={() => handleDelete(classItem.id)}
                    >
                        Xóa
                    </Button>
                    </td>
                </tr>
                ))}
            </tbody>
            </Table>
        </div>
        </>
    );
    };

    export default ManageClasses;