
import { useEffect, useState } from "react";
import api from "../api";
import "../styles/Attendance.css";

function Attendance() {
  const [attendance, setAttendance] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);

  const [form, setForm] = useState({
    studentId: "",
    courseId: "",
    date: "",
    present: true,
  });

  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadAttendance();
    loadStudents();
    loadCourses();
  }, []);

  const loadAttendance = async () => {
    try {
      const response = await api.get("/attendance");
      setAttendance(response.data);
    } catch (error) {
      console.error("Error loading attendance:", error);
    }
  };

  const loadStudents = async () => {
    try {
      const response = await api.get("/students");

      console.log("Attendance page - students:", response.data);

      console.log(
        "Attendance page - student IDs:",
        response.data.map((student) => ({
          id: student.id,
          name: student.name,
          idType: typeof student.id,
        }))
      );

      setStudents(response.data);
    } catch (error) {
      console.error("Error loading students:", error);
    }
  };

  const loadCourses = async () => {
    try {
      const response = await api.get("/courses");
      setCourses(response.data);
    } catch (error) {
      console.error("Error loading courses:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: name === "present" ? value === "true" : value,
    }));
  };

  const resetForm = () => {
    setForm({
      studentId: "",
      courseId: "",
      date: "",
      present: true,
    });

    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.studentId || !form.courseId || !form.date) {
      alert("Please fill all required fields.");
      return;
    }

    const data = {
      studentId: Number(form.studentId),
      courseId: Number(form.courseId),
      date: form.date,
      present: Boolean(form.present),
    };

    try {
      if (editingId !== null) {
        await api.put(`/attendance/${editingId}`, data);
        alert("Attendance updated successfully.");
      } else {
        await api.post("/attendance", data);
        alert("Attendance added successfully.");
      }

      resetForm();
      await loadAttendance();
    } catch (error) {
      console.error("Attendance error:", error);
      alert(
        error.response?.data?.message ||
          error.response?.data ||
          "Unable to save attendance."
      );
    }
  };

  const handleEdit = (record) => {
    setEditingId(record.id);

    setForm({
      studentId: String(record.studentId ?? ""),
      courseId: String(record.courseId ?? ""),
      date: record.date,
      present: record.present,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this attendance record?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/attendance/${id}`);
      alert("Attendance deleted successfully.");
      await loadAttendance();

      if (editingId === id) {
        resetForm();
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert(
        error.response?.data?.message ||
          error.response?.data ||
          "Unable to delete attendance."
      );
    }
  };

  const getStudentName = (studentId) => {
    const student = students.find(
      (item) => Number(item.id) === Number(studentId)
    );

    return student
      ? student.name
      : `Unknown Student (ID: ${studentId ?? "N/A"})`;
  };

  const getCourseName = (courseId) => {
    const course = courses.find(
      (item) => Number(item.id) === Number(courseId)
    );

    return course
      ? `${course.courseName} (${course.courseCode})`
      : `Unknown Course (ID: ${courseId ?? "N/A"})`;
  };

  const filteredAttendance = attendance.filter((record) => {
    const studentName = getStudentName(record.studentId).toLowerCase();
    const courseName = getCourseName(record.courseId).toLowerCase();
    const status = record.present ? "present" : "absent";
    const date = String(record.date ?? "").toLowerCase();
    const searchText = search.toLowerCase();

    return (
      studentName.includes(searchText) ||
      courseName.includes(searchText) ||
      status.includes(searchText) ||
      date.includes(searchText) ||
      String(record.id).includes(searchText)
    );
  });

  const totalRecords = attendance.length;

  const presentCount = attendance.filter(
    (record) => record.present
  ).length;

  const absentCount = attendance.filter(
    (record) => !record.present
  ).length;

  const attendanceRate =
    totalRecords > 0
      ? ((presentCount / totalRecords) * 100).toFixed(1)
      : "0.0";

  return (
    <div className="attendance-page">
      <div className="attendance-header">
        <div>
          <h1>Attendance Management</h1>
          <p>Manage and monitor student attendance records</p>
        </div>
      </div>

      <div className="attendance-summary">
        <div className="attendance-card">
          <div className="attendance-card-icon">📋</div>
          <div>
            <span>Total Records</span>
            <strong>{totalRecords}</strong>
          </div>
        </div>

        <div className="attendance-card">
          <div className="attendance-card-icon">✓</div>
          <div>
            <span>Present</span>
            <strong>{presentCount}</strong>
          </div>
        </div>

        <div className="attendance-card">
          <div className="attendance-card-icon">✕</div>
          <div>
            <span>Absent</span>
            <strong>{absentCount}</strong>
          </div>
        </div>

        <div className="attendance-card">
          <div className="attendance-card-icon">%</div>
          <div>
            <span>Attendance Rate</span>
            <strong>{attendanceRate}%</strong>
          </div>
        </div>
      </div>

      <div className="attendance-form-card">
        <div className="section-title">
          <h2>
            {editingId !== null ? "Edit Attendance" : "Add Attendance"}
          </h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="attendance-form-grid">
            <div className="form-group">
              <label htmlFor="studentId">Student</label>
              <select
                id="studentId"
                name="studentId"
                value={form.studentId}
                onChange={handleChange}
                required
              >
                <option value="">Select Student</option>
                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="courseId">Course</label>
              <select
                id="courseId"
                name="courseId"
                value={form.courseId}
                onChange={handleChange}
                required
              >
                <option value="">Select Course</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.courseName} ({course.courseCode})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="date">Date</label>
              <input
                id="date"
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="present">Status</label>
              <select
                id="present"
                name="present"
                value={String(form.present)}
                onChange={handleChange}
              >
                <option value="true">Present</option>
                <option value="false">Absent</option>
              </select>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary">
              {editingId !== null ? "Update Attendance" : "Add Attendance"}
            </button>

            {editingId !== null && (
              <button
                type="button"
                className="btn-secondary"
                onClick={resetForm}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="attendance-list-card">
        <div className="attendance-list-header">
          <div>
            <h2>Attendance Records</h2>
            <span>Total: {filteredAttendance.length}</span>
          </div>

          <input
            type="text"
            placeholder="Search attendance..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="attendance-search"
            aria-label="Search attendance records"
          />
        </div>

        <div className="attendance-table-container">
          <table className="attendance-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Student</th>
                <th>Course</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredAttendance.length > 0 ? (
                filteredAttendance.map((record) => (
                  <tr key={record.id}>
                    <td>{record.id}</td>
                    <td>{getStudentName(record.studentId)}</td>
                    <td>{getCourseName(record.courseId)}</td>
                    <td>{record.date}</td>

                    <td>
                      <span
                        className={
                          record.present
                            ? "status-badge present"
                            : "status-badge absent"
                        }
                      >
                        {record.present ? "Present" : "Absent"}
                      </span>
                    </td>

                    <td>
                      <div className="table-actions">
                        <button
                          type="button"
                          className="btn-edit"
                          onClick={() => handleEdit(record)}
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="btn-delete"
                          onClick={() => handleDelete(record.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="empty-state">
                    No attendance records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Attendance;
