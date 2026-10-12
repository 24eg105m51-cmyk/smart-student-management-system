import { useEffect, useState } from "react";
import api from "../services/api";
import Sidebar from "../components/Sidebar";
import "../styles/StudentDashboard.css";

function StudentDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setError("");

        // --------------------------------------------------
        // Get logged-in student's dashboard automatically
        // --------------------------------------------------

        const dashboardResponse = await api.get(
          "/dashboard/student/me"
        );

        const studentDashboard = dashboardResponse.data;

        // --------------------------------------------------
        // Get courses assigned to the logged-in student
        // --------------------------------------------------

        const coursesResponse = await api.get(
          `/enrollments/student/${studentDashboard.studentId}`
        );

        // --------------------------------------------------
        // Combine dashboard + courses
        // --------------------------------------------------

        setDashboard({
          ...studentDashboard,
          courses: coursesResponse.data,
        });

      } catch (err) {
        console.error(
          "Student dashboard error:",
          err
        );

        if (err.response) {
          console.error(
            "Backend response:",
            err.response.data
          );

          if (err.response.status === 401) {
            setError(
              "Your login session has expired. Please login again."
            );
          } else if (err.response.status === 403) {
            setError(
              "You do not have permission to access the student dashboard."
            );
          } else {
            setError(
              typeof err.response.data === "string"
                ? err.response.data
                : "Unable to load student dashboard"
            );
          }
        } else {
          setError(
            "Unable to connect to the backend. Make sure Spring Boot is running on port 8080."
          );
        }
      }
    };

    loadDashboard();
  }, []);

  // --------------------------------------------------
  // Error
  // --------------------------------------------------

  if (error) {
    return (
      <div className="student-dashboard-message">
        <h2>{error}</h2>
      </div>
    );
  }

  // --------------------------------------------------
  // Loading
  // --------------------------------------------------

  if (!dashboard) {
    return (
      <div className="student-dashboard-message">
        <h2>
          Loading Student Dashboard...
        </h2>
      </div>
    );
  }

  // --------------------------------------------------
  // Calculations
  // --------------------------------------------------

  const attendancePercentage =
    Number(
      dashboard.attendancePercentage || 0
    ).toFixed(1);

  const marksPercentage =
    Number(
      dashboard.overallMarksPercentage || 0
    ).toFixed(1);

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <div className="student-layout">

      <Sidebar />

      <main className="student-main">

        {/* Header */}

        <div className="student-header">
          <div>
            <h1>Student Dashboard</h1>

            <p>
              Welcome, {dashboard.name}
            </p>
          </div>
        </div>

        {/* Profile */}

        <div className="student-profile-card">

          <div className="student-avatar">
            {dashboard.name
              ? dashboard.name
                  .charAt(0)
                  .toUpperCase()
              : "S"}
          </div>

          <div className="student-profile-info">

            <h2>
              {dashboard.name}
            </h2>

            <p>
              {dashboard.email}
            </p>

            <span>
              {dashboard.department} •{" "}
              {dashboard.year}
            </span>

          </div>

        </div>

        {/* Statistics */}

        <div className="student-dashboard-cards">

          <div className="student-card">
            <span>Total Classes</span>

            <strong>
              {dashboard.totalClasses || 0}
            </strong>
          </div>

          <div className="student-card">
            <span>Present Classes</span>

            <strong>
              {dashboard.presentClasses || 0}
            </strong>
          </div>

          <div className="student-card">
            <span>Attendance</span>

            <strong>
              {attendancePercentage}%
            </strong>
          </div>

          <div className="student-card">
            <span>Marks Percentage</span>

            <strong>
              {marksPercentage}%
            </strong>
          </div>

        </div>

        {/* Main Content */}

        <div className="student-content-grid">

          {/* Profile Details */}

          <div className="student-section">

            <h2>Profile Details</h2>

            <div className="profile-details">

              <div>
                <span>Name</span>

                <strong>
                  {dashboard.name}
                </strong>
              </div>

              <div>
                <span>Email</span>

                <strong>
                  {dashboard.email}
                </strong>
              </div>

              <div>
                <span>Phone</span>

                <strong>
                  {dashboard.phone ||
                    "Not available"}
                </strong>
              </div>

              <div>
                <span>Department</span>

                <strong>
                  {dashboard.department}
                </strong>
              </div>

              <div>
                <span>Year</span>

                <strong>
                  {dashboard.year}
                </strong>
              </div>

            </div>

          </div>

          {/* Attendance */}

          <div className="student-section">

            <h2>Attendance Overview</h2>

            <div className="attendance-overview">

              <div className="attendance-number">
                {attendancePercentage}%
              </div>

              <p>
                Attendance Percentage
              </p>

              <div className="attendance-details">

                <div>
                  <span>
                    Total Classes
                  </span>

                  <strong>
                    {dashboard.totalClasses ||
                      0}
                  </strong>
                </div>

                <div>
                  <span>Present</span>

                  <strong>
                    {dashboard.presentClasses ||
                      0}
                  </strong>
                </div>

              </div>

            </div>

          </div>

        </div>

        {/* Marks Overview */}

        <div className="student-section full-width">

          <h2>Marks Overview</h2>

          <div className="marks-overview">

            <div className="marks-stat">
              <span>Total Marks</span>

              <strong>
                {dashboard.totalMarks || 0}
              </strong>
            </div>

            <div className="marks-stat">
              <span>Maximum Marks</span>

              <strong>
                {dashboard.totalMaxMarks || 0}
              </strong>
            </div>

            <div className="marks-stat">
              <span>
                Overall Percentage
              </span>

              <strong>
                {marksPercentage}%
              </strong>
            </div>

          </div>

        </div>

        {/* Individual Marks */}

        <div className="student-section full-width">

          <div className="section-heading">

            <div>
              <h2>My Marks</h2>

              <span>
                Total:{" "}
                {dashboard.marks?.length || 0}
              </span>
            </div>

          </div>

          <div className="student-marks-table-container">

            <table className="student-marks-table">

              <thead>
                <tr>
                  <th>Exam</th>
                  <th>Marks</th>
                  <th>Total</th>
                  <th>Percentage</th>
                </tr>
              </thead>

              <tbody>

                {dashboard.marks?.length > 0 ? (

                  dashboard.marks.map(
                    (mark) => {

                      const obtained =
                        Number(
                          mark.marksObtained ??
                            mark.marks ??
                            0
                        );

                      const total =
                        Number(
                          mark.totalMarks ??
                            mark.maxMarks ??
                            0
                        );

                      const percentage =
                        total > 0
                          ? (
                              (obtained /
                                total) *
                              100
                            ).toFixed(1)
                          : "0.0";

                      return (
                        <tr
                          key={mark.id}
                        >

                          <td>
                            {mark.examType ||
                              "Not specified"}
                          </td>

                          <td>
                            {obtained}
                          </td>

                          <td>
                            {total}
                          </td>

                          <td>
                            <span className="student-percentage-badge">
                              {percentage}%
                            </span>
                          </td>

                        </tr>
                      );
                    }
                  )

                ) : (

                  <tr>
                    <td
                      colSpan="4"
                      className="empty-state"
                    >
                      No marks available.
                    </td>
                  </tr>

                )}

              </tbody>

            </table>

          </div>

        </div>

        {/* Courses */}

        <div className="student-section full-width">

          <div className="section-heading">

            <div>
              <h2>My Courses</h2>

              <span>
                Total:{" "}
                {dashboard.courses?.length ||
                  0}
              </span>
            </div>

          </div>

          <div className="course-grid">

            {dashboard.courses?.length > 0 ? (

              dashboard.courses.map(
                (course) => (

                  <div
                    className="course-card"
                    key={course.id}
                  >

                    <h3>
                      {course.courseName}
                    </h3>

                    <p>
                      <strong>
                        Code:
                      </strong>{" "}
                      {course.courseCode}
                    </p>

                    <p>
                      <strong>
                        Department:
                      </strong>{" "}
                      {course.department}
                    </p>

                    <p>
                      <strong>
                        Year:
                      </strong>{" "}
                      {course.year}
                    </p>

                    <p>
                      <strong>
                        Faculty:
                      </strong>{" "}
                      {course.facultyName}
                    </p>

                  </div>

                )
              )

            ) : (

              <div className="empty-course">
                No courses assigned.
              </div>

            )}

          </div>

        </div>

      </main>

    </div>
  );
}

export default StudentDashboard;