import React from "react";

const StudentList = ({ students, removeStudent }) => {
  return (
    <div>
      <h3>Danh sách học sinh</h3>
      <ul className="list-group">
        {students.map((student) => (
          <li
            key={student.id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            {student.username} ({student.gender === "male" ? "Nam" : "Nữ"})
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
