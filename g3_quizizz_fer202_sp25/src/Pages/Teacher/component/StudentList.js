import React, { useState } from "react";

const StudentList = ({ students, removeStudent }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [genderFilter, setGenderFilter] = useState("all");

  const filteredStudents = students.filter((student) => {
    const matchesSearch = student.username
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesGender =
      genderFilter === "all" || student.gender === genderFilter;
    return matchesSearch && matchesGender;
  });

  return (
    <div>
      <h3>Danh sách học sinh</h3>
      <div className="mb-3 d-flex gap-2">
        <input
          type="text"
          className="form-control"
          placeholder="Tìm kiếm theo tên..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="form-control"
          value={genderFilter}
          onChange={(e) => setGenderFilter(e.target.value)}
        >
          <option value="all">Tất cả</option>
          <option value="male">Nam</option>
          <option value="female">Nữ</option>
        </select>
      </div>
      <ul className="list-group">
        {filteredStudents.map((student) => (
          <li
            key={student.id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            {student.username} - {student.gender === "male" ? "Nam" : "Nữ"}
            <button
              className="btn btn-danger btn-sm"
              onClick={() => removeStudent(parseInt(student.id))}
            >
              Xóa
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StudentList;
