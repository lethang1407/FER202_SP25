import React from "react";

const ClassInfo = ({
  newClassName,
  setNewClassName,
  newClassCode,
  setNewClassCode,
  updateClassInfo,
}) => {
  return (
    <div>
      <h3>Thông tin lớp học</h3>
      <div className="mb-3">
        <label className="form-label">Tên lớp học</label>
        <input
          type="text"
          className="form-control"
          value={newClassName}
          onChange={(e) => setNewClassName(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Mã lớp học</label>
        <input
          type="text"
          className="form-control"
          value={newClassCode}
          onChange={(e) => setNewClassCode(e.target.value)}
        />
      </div>
      <button className="btn btn-primary" onClick={updateClassInfo}>
        Cập nhật thông tin
      </button>
    </div>
  );
};

export default ClassInfo;
