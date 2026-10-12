import { useEffect, useState } from "react";
import api from "../services/api";
import Sidebar from "../components/Sidebar";
import "../styles/Courses.css";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    courseName: "",
    courseCode: "",
    department: "",
    year: "",
    facultyName: "",
  });

  const loadCourses = async () => {
    try {
      setError("");

      const response = await api.get("/courses");
      setCourses(response.data);
    } catch (err) {
      setError(
        err.response?.data ||
          "Unable to load courses"
      );
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setFormData({
      courseName: "",
      courseCode: "",
      department: "",
      year: "",
      facultyName: "",
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
          `/courses/${editingId}`,
          formData
        );
      } else {
        await api.post(
          "/courses",
          formData
        );
      }

      resetForm();
      await loadCourses();

    } catch (err) {
      setError(
        err.response?.data ||
          (editingId
            ? "Unable to update course"
            : "Unable to add course")
      );
    }
  };

  const handleEdit = (course) => {
    setFormData({
      courseName: course.courseName || "",
      courseCode: course.courseCode || "",
      department: course.department || "",
      year: course.year || "",
      facultyName: course.facultyName || "",
    });

    setEditingId(course.id);
    setShowForm(true);
    setError("");
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this course?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await api.delete(`/courses/${id}`);

      await loadCourses();

    } catch (err) {
      setError(
        err.response?.data ||
          "Unable to delete course"
      );
    }
  };

  const filteredCourses = courses.filter((course) => {
    const search = searchTerm
      .toLowerCase()
      .trim();

    if (!search) {
      return true;
    }

    return (
      String(course.courseName || "")
        .toLowerCase()
        .includes(search) ||
      String(course.courseCode || "")
        .toLowerCase()
        .includes(search) ||
      String(course.department || "")
        .toLowerCase()
        .includes(search) ||
      String(course.year || "")
        .toLowerCase()
        .includes(search) ||
      String(course.facultyName || "")
        .toLowerCase()
        .includes(search)
    );
  });

  return (
    <div className="courses-layout">

      <Sidebar />

      <main className="courses-main">

        <div className="courses-header">

          <div>
            <h1>Courses</h1>
            <p>Manage all courses</p>
          </div>

          <button
            className="add-course-button"
            onClick={() => {
              resetForm();
              setError("");
              setShowForm(true);
            }}
          >
            + Add Course
          </button>

        </div>

        {error && (
          <p className="courses-error">
            {error}
          </p>
        )}

        {showForm && (
          <div className="course-form-card">

            <div className="course-form-header">

              <h2>
                {editingId
                  ? "Edit Course"
                  : "Add New Course"}
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

              <div className="course-form-grid">

                <div className="form-group">
                  <label>Course Name</label>

                  <input
                    type="text"
                    name="courseName"
                    value={formData.courseName}
                    onChange={handleChange}
                    placeholder="Example: Database Management Systems"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Course Code</label>

                  <input
                    type="text"
                    name="courseCode"
                    value={formData.courseCode}
                    onChange={handleChange}
                    placeholder="Example: CS301"
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
                  <label>Faculty</label>

                  <input
                    type="text"
                    name="facultyName"
                    value={formData.facultyName}
                    onChange={handleChange}
                    placeholder="Example: Dr. Kumar"
                    required
                  />
                </div>

              </div>

              <div className="course-form-actions">

                <button
                  type="button"
                  className="cancel-button"
                  onClick={resetForm}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-course-button"
                >
                  {editingId
                    ? "Update Course"
                    : "Save Course"}
                </button>

              </div>

            </form>

          </div>
        )}

        <div className="courses-card">

          <div className="courses-card-header">

            <div>
              <h2>Course List</h2>

              <span>
                Total: {filteredCourses.length}
              </span>
            </div>

            <input
              type="text"
              className="course-search"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
            />

          </div>

          <div className="table-container">

            <table className="courses-table">

              <thead>
                <tr>
                  <th>ID</th>
                  <th>Course Name</th>
                  <th>Code</th>
                  <th>Department</th>
                  <th>Year</th>
                  <th>Faculty</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>

                {filteredCourses.length > 0 ? (

                  filteredCourses.map((course) => (

                    <tr key={course.id}>

                      <td>{course.id}</td>

                      <td className="course-name">
                        {course.courseName}
                      </td>

                      <td>
                        {course.courseCode}
                      </td>

                      <td>
                        {course.department}
                      </td>

                      <td>
                        {course.year}
                      </td>

                      <td>
                        {course.facultyName}
                      </td>

                      <td>

                        <button
                          className="edit-button"
                          onClick={() =>
                            handleEdit(course)
                          }
                        >
                          Edit
                        </button>

                        <button
                          className="delete-button"
                          onClick={() =>
                            handleDelete(course.id)
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
                      colSpan="7"
                      className="no-courses"
                    >
                      No courses found
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

export default Courses;