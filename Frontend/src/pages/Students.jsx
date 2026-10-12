import { useEffect, useState } from "react";
import api from "../services/api";
import Sidebar from "../components/Sidebar";
import "../styles/Students.css";

function Students() {
  const [students, setStudents] = useState([]);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
    year: "",
    phone: "",
    address: "",
  });

  const loadStudents = async () => {
    try {
      setError("");

      const response = await api.get("/students");

      setStudents(response.data);
    } catch (err) {
      setError("Unable to load students");
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      department: "",
      year: "",
      phone: "",
      address: "",
    });

    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError("");

      if (editingId) {
        await api.put(`/students/${editingId}`, formData);
      } else {
        await api.post("/students", formData);
      }

      resetForm();

      await loadStudents();
    } catch (err) {
      setError(
        err.response?.data ||
          (editingId
            ? "Unable to update student"
            : "Unable to add student")
      );
    }
  };

  const handleEdit = (student) => {
    setFormData({
      name: student.name || "",
      email: student.email || "",
      department: student.department || "",
      year: student.year || "",
      phone: student.phone || "",
      address: student.address || "",
    });

    setEditingId(student.id);
    setShowForm(true);
    setError("");
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this student?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await api.delete(`/students/${id}`);

      await loadStudents();
    } catch (err) {
      setError(
        err.response?.data || "Unable to delete student"
      );
    }
  };

  const filteredStudents = students.filter((student) => {
    if (!searchTerm.trim()) {
      return true;
    }

    const search = searchTerm.toLowerCase();

    return (
      String(student.name || "")
        .toLowerCase()
        .includes(search) ||
      String(student.email || "")
        .toLowerCase()
        .includes(search) ||
      String(student.department || "")
        .toLowerCase()
        .includes(search) ||
      String(student.year || "")
        .toLowerCase()
        .includes(search)
    );
  });

  return (
    <div className="students-layout">
      <Sidebar />

      <main className="students-main">

        {/* PAGE HEADER */}
        <div className="students-header">
          <div>
            <h1>Students</h1>
            <p>Manage all registered students</p>
          </div>

          <button
            className="add-student-button"
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
          >
            + Add Student
          </button>
        </div>

        {/* ERROR */}
        {error && (
          <p className="students-error">
            {error}
          </p>
        )}

        {/* ADD / EDIT FORM */}
        {showForm && (
          <div className="student-form-card">

            <div className="student-form-header">
              <h2>
                {editingId
                  ? "Edit Student"
                  : "Add New Student"}
              </h2>

              <button
                className="close-form-button"
                onClick={resetForm}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>

              <div className="student-form-grid">

                <div className="form-group">
                  <label>Student Name</label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter student name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Email</label>

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter email"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Department</label>

                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    placeholder="Example: CSE"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Year</label>

                  <input
                    type="text"
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    placeholder="Example: 3rd Year"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Phone</label>

                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                  />
                </div>

                <div className="form-group">
                  <label>Address</label>

                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter address"
                  />
                </div>

              </div>

              <div className="student-form-actions">

                <button
                  type="button"
                  className="cancel-button"
                  onClick={resetForm}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-student-button"
                >
                  {editingId
                    ? "Update Student"
                    : "Save Student"}
                </button>

              </div>

            </form>
          </div>
        )}

        {/* STUDENT LIST */}
        <div className="students-card">

          <div className="students-card-header">

            <div>
              <h2>Student List</h2>

              <span>
                Total: {filteredStudents.length}
              </span>
            </div>

            {/* SEARCH BOX */}
            <input
              type="text"
              className="student-search"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
            />

          </div>

          <div className="table-container">

            <table className="students-table">

              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Year</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>

                {filteredStudents.length > 0 ? (

                  filteredStudents.map((student) => (

                    <tr key={student.id}>

                      <td>
                        {student.id}
                      </td>

                      <td className="student-name">
                        {student.name}
                      </td>

                      <td>
                        {student.email}
                      </td>

                      <td>
                        {student.department}
                      </td>

                      <td>
                        {student.year}
                      </td>

                      <td>

                        <button
                          className="edit-button"
                          onClick={() =>
                            handleEdit(student)
                          }
                        >
                          Edit
                        </button>

                        <button
                          className="delete-button"
                          onClick={() =>
                            handleDelete(student.id)
                          }
                        >
                          Delete
                        </button>

                      </td>

                    </tr>

                  ))

                ) : (

                  <tr>

                    <td
                      colSpan="6"
                      className="no-students"
                    >
                      No students found
                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>

        </div>

      </main>
    </div>
  );
}

export default Students;