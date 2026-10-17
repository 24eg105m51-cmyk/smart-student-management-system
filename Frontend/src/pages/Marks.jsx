import { useEffect, useState } from "react";
import api from "../api";
import "../styles/Marks.css";

function Marks() {
  const [marks, setMarks] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);

  const [form, setForm] = useState({
    studentId: "",
    courseId: "",
    examType: "",
    marksObtained: "",
    totalMarks: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadMarks();
    loadStudents();
    loadCourses();
  }, []);

  const loadMarks = async () => {
    try {
      const response = await api.get("/marks");
      setMarks(response.data);
    } catch (error) {
      console.error("Error loading marks:", error);
    }
  };

  const loadStudents = async () => {
    try {
      const response = await api.get("/students");
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

    setForm({
      ...form,
      [name]: value,
    });
  };

  const resetForm = () => {
    setForm({
      studentId: "",
      courseId: "",
      examType: "",
      marksObtained: "",
      totalMarks: "",
    });

    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.studentId ||
      !form.courseId ||
      !form.examType ||
      !form.marksObtained ||
      !form.totalMarks
    ) {
      alert("Please fill all required fields.");
      return;
    }

    const obtained = Number(form.marksObtained);
    const total = Number(form.totalMarks);

    if (obtained < 0) {
      alert("Marks obtained cannot be negative.");
      return;
    }

    if (total <= 0) {
      alert("Total marks must be greater than 0.");
      return;
    }

    if (obtained > total) {
      alert("Marks obtained cannot be greater than total marks.");
      return;
    }

    const data = {
      studentId: Number(form.studentId),
      courseId: Number(form.courseId),
      examType: form.examType,
      marksObtained: obtained,
      totalMarks: total,
    };

    try {
      if (editingId) {
        await api.put(`/marks/${editingId}`, data);
        alert("Marks updated successfully.");
      } else {
        await api.post("/marks", data);
        alert("Marks added successfully.");
      }

      resetForm();
      loadMarks();
    } catch (error) {
      console.error("Marks error:", error);

      alert(
        error.response?.data ||
          "Unable to save marks."
      );
    }
  };

  const handleEdit = (record) => {
    setEditingId(record.id);

    setForm({
      studentId: String(record.studentId),
      courseId: String(record.courseId),
      examType: record.examType || "",
      marksObtained: String(
        record.marksObtained ?? record.marks ?? ""
      ),
      totalMarks: String(
        record.totalMarks ?? record.maxMarks ?? ""
      ),
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this marks record?"
      )
    ) {
      return;
    }

    try {
      await api.delete(`/marks/${id}`);

      alert("Marks deleted successfully.");

      loadMarks();
    } catch (error) {
      console.error("Delete error:", error);

      alert(
        error.response?.data ||
          "Unable to delete marks."
      );
    }
  };

  const getStudentName = (studentId) => {
    const student = students.find(
      (item) =>
        Number(item.id) === Number(studentId)
    );

    return student
      ? student.name
      : `Student #${studentId}`;
  };

  const getCourseName = (courseId) => {
    const course = courses.find(
      (item) =>
        Number(item.id) === Number(courseId)
    );

    return course
      ? `${course.courseName} (${course.courseCode})`
      : `Course #${courseId}`;
  };

  const getPercentage = (record) => {
    const obtained = Number(
      record.marksObtained ?? record.marks ?? 0
    );

    const total = Number(
      record.totalMarks ?? record.maxMarks ?? 0
    );

    if (total <= 0) {
      return "0.0";
    }

    return ((obtained / total) * 100).toFixed(1);
  };

  const filteredMarks = marks.filter((record) => {
    const studentName = getStudentName(
      record.studentId
    ).toLowerCase();

    const courseName = getCourseName(
      record.courseId
    ).toLowerCase();

    const examType = (
      record.examType || ""
    ).toLowerCase();

    const searchText = search.toLowerCase();

    return (
      studentName.includes(searchText) ||
      courseName.includes(searchText) ||
      examType.includes(searchText)
    );
  });

  const totalRecords = marks.length;

  const validRecords = marks.filter((record) => {
    const total = Number(
      record.totalMarks ?? record.maxMarks ?? 0
    );

    return total > 0;
  });

  const totalObtained = validRecords.reduce(
    (sum, record) =>
      sum +
      Number(
        record.marksObtained ??
          record.marks ??
          0
      ),
    0
  );

  const totalPossible = validRecords.reduce(
    (sum, record) =>
      sum +
      Number(
        record.totalMarks ??
          record.maxMarks ??
          0
      ),
    0
  );

  const overallPercentage =
    totalPossible > 0
      ? ((totalObtained / totalPossible) * 100).toFixed(1)
      : "0.0";

  const highestPercentage =
    validRecords.length > 0
      ? Math.max(
          ...validRecords.map((record) =>
            Number(getPercentage(record))
          )
        ).toFixed(1)
      : "0.0";

  return (
    <div className="marks-page">

      <div className="marks-header">
        <div>
          <h1>Marks Management</h1>

          <p>
            Manage and monitor student examination marks
          </p>
        </div>
      </div>

      <div className="marks-summary">

        <div className="marks-card">
          <div className="marks-card-icon">
            📊
          </div>

          <div>
            <span>Total Records</span>
            <strong>{totalRecords}</strong>
          </div>
        </div>

        <div className="marks-card">
          <div className="marks-card-icon">
            ✓
          </div>

          <div>
            <span>Valid Records</span>
            <strong>
              {validRecords.length}
            </strong>
          </div>
        </div>

        <div className="marks-card">
          <div className="marks-card-icon">
            %
          </div>

          <div>
            <span>Overall Percentage</span>
            <strong>
              {overallPercentage}%
            </strong>
          </div>
        </div>

        <div className="marks-card">
          <div className="marks-card-icon">
            🏆
          </div>

          <div>
            <span>Highest Percentage</span>
            <strong>
              {highestPercentage}%
            </strong>
          </div>
        </div>

      </div>

      <div className="marks-form-card">

        <div className="section-title">
          <h2>
            {editingId
              ? "Edit Marks"
              : "Add Marks"}
          </h2>
        </div>

        <form onSubmit={handleSubmit}>

          <div className="marks-form-grid">

            <div className="form-group">
              <label>Student</label>

              <select
                name="studentId"
                value={form.studentId}
                onChange={handleChange}
                required
              >
                <option value="">
                  Select Student
                </option>

                {students.map((student) => (
                  <option
                    key={student.id}
                    value={student.id}
                  >
                    {student.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Course</label>

              <select
                name="courseId"
                value={form.courseId}
                onChange={handleChange}
                required
              >
                <option value="">
                  Select Course
                </option>

                {courses.map((course) => (
                  <option
                    key={course.id}
                    value={course.id}
                  >
                    {course.courseName} (
                    {course.courseCode})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Exam Type</label>

              <select
                name="examType"
                value={form.examType}
                onChange={handleChange}
                required
              >
                <option value="">
                  Select Exam
                </option>

                <option value="Mid 1">
                  Mid 1
                </option>

                <option value="Mid 2">
                  Mid 2
                </option>

                <option value="Internal">
                  Internal
                </option>

                <option value="Semester">
                  Semester
                </option>

                <option value="Assignment">
                  Assignment
                </option>
              </select>
            </div>

            <div className="form-group">
              <label>Marks Obtained</label>

              <input
                type="number"
                name="marksObtained"
                value={form.marksObtained}
                onChange={handleChange}
                min="0"
                step="0.01"
                placeholder="Enter marks"
                required
              />
            </div>

            <div className="form-group">
              <label>Total Marks</label>

              <input
                type="number"
                name="totalMarks"
                value={form.totalMarks}
                onChange={handleChange}
                min="1"
                step="0.01"
                placeholder="Example: 100"
                required
              />
            </div>

          </div>

          <div className="form-actions">

            <button
              type="submit"
              className="btn-primary"
            >
              {editingId
                ? "Update Marks"
                : "Add Marks"}
            </button>

            {editingId && (
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

      <div className="marks-list-card">

        <div className="marks-list-header">

          <div>
            <h2>Marks Records</h2>

            <span>
              Total: {filteredMarks.length}
            </span>
          </div>

          <input
            type="text"
            placeholder="Search marks..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="marks-search"
          />

        </div>

        <div className="marks-table-container">

          <table className="marks-table">

            <thead>
              <tr>
                <th>ID</th>
                <th>Student</th>
                <th>Course</th>
                <th>Exam</th>
                <th>Marks</th>
                <th>Total</th>
                <th>Percentage</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>

              {filteredMarks.length > 0 ? (

                filteredMarks.map((record) => {

                  const obtained =
                    record.marksObtained ??
                    record.marks ??
                    0;

                  const total =
                    record.totalMarks ??
                    record.maxMarks ??
                    0;

                  return (
                    <tr key={record.id}>

                      <td>
                        {record.id}
                      </td>

                      <td>
                        {getStudentName(
                          record.studentId
                        )}
                      </td>

                      <td>
                        {getCourseName(
                          record.courseId
                        )}
                      </td>

                      <td>
                        {record.examType ||
                          "Not specified"}
                      </td>

                      <td>
                        {obtained}
                      </td>

                      <td>
                        {total}
                      </td>

                      <td>
                        <span className="percentage-badge">
                          {getPercentage(record)}%
                        </span>
                      </td>

                      <td>

                        <div className="table-actions">

                          <button
                            className="btn-edit"
                            onClick={() =>
                              handleEdit(record)
                            }
                          >
                            Edit
                          </button>

                          <button
                            className="btn-delete"
                            onClick={() =>
                              handleDelete(
                                record.id
                              )
                            }
                          >
                            Delete
                          </button>

                        </div>

                      </td>

                    </tr>
                  );
                })

              ) : (

                <tr>
                  <td
                    colSpan="8"
                    className="empty-state"
                  >
                    No marks records found.
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

export default Marks;