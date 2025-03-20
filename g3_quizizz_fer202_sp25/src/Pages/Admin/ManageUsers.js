import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterRole, setFilterRole] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedUser, setSelectedUser] = useState(null);
    const [newRole, setNewRole] = useState("");
    const [showModal, setShowModal] = useState(false);
    const usersPerPage = 6;
    useEffect(() => {
        // Fetch users
        fetch("http://localhost:8888/accounts")
            .then((res) => res.json())
            .then((data) => setUsers(data))
            .catch((error) => console.error("Error fetching users:", error));

        // Fetch roles
        fetch("http://localhost:8888/roles")
            .then((res) => res.json())
            .then((data) => setRoles(data))
            .catch((error) => console.error("Error fetching roles:", error));
    }, []);

    const handleDelete = (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa người dùng này?")) {
            fetch(`http://localhost:8888/accounts/${id}`, { method: "DELETE" })
                .then(() => setUsers(users.filter(user => user.id !== id)))
                .catch(error => console.error("Error deleting user:", error));
        }
    };

    const handleEdit = (user) => {
        setSelectedUser(user);
        setNewRole(user.role_id);
        setShowModal(true);
    };

    const handleSave = () => {
        if (selectedUser) {
            fetch(`http://localhost:8888/accounts/${selectedUser.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...selectedUser, role_id: newRole }),
            })
                .then((res) => {
                    if (!res.ok) {
                        throw new Error("Failed to update user");
                    }
                    return res.json();
                })
                .then((updatedUser) => {
                    setUsers((prevUsers) =>
                        prevUsers.map((user) => (user.id === updatedUser.id ? updatedUser : user))
                    );
                    setShowModal(false);
                    setSelectedUser(null);
                })
                .catch((error) => console.error("Error updating user:", error));
        }
    };


    // Kết hợp users với roles
    const usersWithRoles = users.map(user => {
        const role = roles.find(r => Number(r.id) === Number(user.role_id));
        return {
            ...user,
            roleName: role ? role.name : "N/A"
        };
    });


    // Lọc theo tên và vai trò
    const filteredUsers = usersWithRoles.filter(user => {
        const name = user.username ? user.username.toLowerCase() : "";
        const role = user.roleName ? user.roleName.toLowerCase() : "";
        const matchesSearch = name.includes(searchTerm.toLowerCase());
        const matchesRole = filterRole === "all" || role === filterRole.toLowerCase();
        return matchesSearch && matchesRole;
    });

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
 

    return (
        <div className="container mt-4">
            <h2 className="mb-3">Quản lý Người dùng</h2>
            <div className="d-flex mb-3">
                <input
                    type="text"
                    className="form-control me-2"
                    placeholder="Tìm kiếm người dùng..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select
                    className="form-select"
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                >
                    <option value="all">Tất cả vai trò</option>
                    {roles.map((role) => (
                        <option key={role.id} value={role.name.toLowerCase()}>{role.name}</option>
                    ))}
                </select>
            </div>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Tên</th>
                        <th>Vai trò</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {currentUsers.map((user) => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.username || "N/A"}</td>
                            <td>{user.roleName || "N/A"}</td>
                            <td>
                                <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(user)}>Sửa</button>
                                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(user.id)}>Xóa</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="d-flex justify-content-center mt-3">
                <button className="btn btn-primary me-2 pagination-btn" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
                    Prev
                </button>
                <span className="align-self-center">Trang {currentPage} / {totalPages}</span>
                <button className="btn btn-primary ms-2 pagination-btn" onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>
                    Next
                </button>
            </div>
            {showModal && (
                <div className="modal fade show d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,0.5)" }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Chỉnh sửa quyền</h5>
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <label className="form-label">Chọn vai trò:</label>
                                <select className="form-select" value={newRole} onChange={(e) => setNewRole(e.target.value)}>
                                    {roles.map((role) => (
                                        <option key={role.id} value={role.id}>{role.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Hủy</button>
                                <button className="btn btn-primary" onClick={handleSave}>Lưu thay đổi</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <style>{`
        .pagination-btn {
          padding: 8px 16px;
          font-size: 16px;
          border-radius: 5px;
          transition: all 0.3s;
        }
        .pagination-btn:hover {
          background-color: #0056b3;
          color: white;
        }
        .pagination-btn:disabled {
          background-color: #ccc;
          cursor: not-allowed;
        }
      `}</style>
        </div>
    );
};

export default ManageUsers;
