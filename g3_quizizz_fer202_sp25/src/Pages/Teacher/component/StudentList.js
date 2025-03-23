import React, { useState, useEffect } from "react";
import axios from "axios";

const StudentList = ({ classId }) => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [genderFilter, setGenderFilter] = useState("all");
  const [allStudents, setAllStudents] = useState([]);

  // Fetch toàn bộ danh sách học sinh khi component mount
  useEffect(() => {
    const fetchAllStudents = async () => {
      try {
        const response = await axios.get("http://localhost:8888/accounts");
        setAllStudents(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách toàn bộ học sinh:", error);
      }
    };

    fetchAllStudents();
  }, []);

  // Fetch danh sách học sinh trong lớp khi component mount hoặc khi classId thay đổi
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const classResponse = await axios.get(
          `http://localhost:8888/classes/${classId}`
        );
        const studentIds = classResponse.data.students || [];

        // Lọc danh sách học sinh trong lớp từ allStudents
        const studentDetails = allStudents.filter((acc) =>
          studentIds.includes(acc.id)
        );

        setStudents(studentDetails);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách học sinh:", error);
      }
    };

    // Chỉ fetch khi allStudents đã có dữ liệu
    if (allStudents.length > 0) {
      fetchStudents();
    }
  }, [classId, allStudents]);

  // Xóa học sinh khỏi lớp
  const removeStudent = async (studentId) => {
    try {
      const classResponse = await axios.get(
        `http://localhost:8888/classes/${classId}`
      );
      const classInfo = classResponse.data;

      const updatedStudents = classInfo.students.filter(
        (id) => id !== studentId.toString()
      );

      await axios.put(`http://localhost:8888/classes/${classId}`, {
        ...classInfo,
        students: updatedStudents,
      });

      // Cập nhật lại danh sách sinh viên ngay lập tức
      setStudents((prevStudents) =>
        prevStudents.filter((student) => student.id !== studentId)
      );

      alert("Đã xóa học sinh khỏi lớp!");
    } catch (error) {
      console.error("Lỗi khi xóa học sinh", error);
      alert("Lỗi khi xóa học sinh. Vui lòng thử lại!");
    }
  };

  // Lọc danh sách học sinh theo tìm kiếm và giới tính
  const filteredStudents = students.filter((student) => {
    if (!student || !student.username) return false; // Tránh lỗi undefined
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
              onClick={() => removeStudent(student.id)}
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
