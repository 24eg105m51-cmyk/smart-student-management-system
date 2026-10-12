import { useEffect, useState } from "react";
import api from "../services/api";
import Sidebar from "../components/Sidebar";
import "../styles/Faculty.css";

function Faculty() {
  const [faculty, setFaculty] = useState([]);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
    phone: "",
  });

  const loadFaculty = async () => {
    try {
      setError("");

      const response = await api.get("/faculty");
      setFaculty(response.data);
    } catch (err) {
      setError(
        err.response?.data ||
          "Unable to load faculty"
      );
    }
  };

  useEffect(() => {
    loadFaculty();
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
      phone: "",
    });

    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError("");

      if (editingId) {
        await api.put(
          `/faculty/${editingId}`,
          formData
        );
      } else {
        await api.post(
          "/faculty",
          formData
        );
      }

      resetForm();
      await loadFaculty();

    } catch (err) {
      setError(
        err.response?.data ||
          (editingId
            ? "Unable to update faculty"
            : "Unable to add faculty")
      );
    }
  };

  const handleEdit = (member) => {
    setFormData({
      name: member.name || "",
      email: member.email || "",
      department: member.department || "",
      phone: member.phone || "",
    });

    setEditingId(member.id);
    setShowForm(true);
    setError("");
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this faculty member?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await api.delete(`/faculty/${id}`);

      await loadFaculty();

    } catch (err) {
      setError(
        err.response?.data ||
          "Unable to delete faculty"
      );
    }
  };

  return (
    <div className="faculty-layout">

      <Sidebar />

      <main className="faculty-main">

        {/* HEADER */}

        <div className="faculty-header">

          <div>
            <h1>Faculty</h1>
            <p>Manage all faculty members</p>
          </div>

          <button
            className="add-faculty-button"
            onClick={() => {
              resetForm();
              setError("");
              setShowForm(true);
            }}
          >
            + Add Faculty
          </button>

        </div>

        {/* ERROR */}

        {error && (
          <p className="faculty-error">
            {error}
          </p>
        )}

        {/* FACULTY FORM */}

        {showForm && (
          <div className="faculty-form-card">

            <div className="faculty-form-header">

              <h2>
                {editingId
                  ? "Edit Faculty"
                  : "Add New Faculty"}
              </h2>

              <button
                type="button"
                className="close-form-button"
                onClick={resetForm}
              >
                ×
              </button>

            </div>

            <form onSubmit={handleSubmit}>

              <div className="faculty-form-grid">

                <div className="form-group">

                  <label>Faculty Name</label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter faculty name"
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
                    placeholder="Enter faculty email"
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

                  <label>Phone</label>

                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                  />

                </div>

              </div>

              <div className="faculty-form-actions">

                <button
                  type="button"
                  className="cancel-button"
                  onClick={resetForm}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-faculty-button"
                >
                  {editingId
                    ? "Update Faculty"
                    : "Save Faculty"}
                </button>

              </div>

            </form>

          </div>
        )}

        {/* FACULTY LIST */}

        <div className="faculty-card">

          <div className="faculty-card-header">

            <div>
              <h2>Faculty List</h2>

              <span>
                Total: {faculty.length}
              </span>
            </div>

            <input
              type="text"
              className="faculty-search"
              placeholder="Search faculty..."
            />

          </div>

          <div className="table-container">

            <table className="faculty-table">

              <thead>

                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Phone</th>
                  <th>Actions</th>
                </tr>

              </thead>

              <tbody>

                {faculty.length > 0 ? (

                  faculty.map((member) => (

                    <tr key={member.id}>

                      <td>{member.id}</td>

                      <td className="faculty-name">
                        {member.name}
                      </td>

                      <td>{member.email}</td>

                      <td>{member.department}</td>

                      <td>
                        {member.phone || "-"}
                      </td>

                      <td>

                        <button
                          className="edit-button"
                          onClick={() =>
                            handleEdit(member)
                          }
                        >
                          Edit
                        </button>

                        <button
                          className="delete-button"
                          onClick={() =>
                            handleDelete(member.id)
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
                      className="no-faculty"
                    >
                      No faculty found
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

export default Faculty;