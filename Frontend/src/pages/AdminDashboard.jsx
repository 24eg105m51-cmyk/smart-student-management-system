import { useEffect, useState } from "react";
import api from "../services/api";
import Sidebar from "../components/Sidebar";
import "../styles/AdminDashboard.css";

function AdminDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const response = await api.get("/dashboard/admin");
        setDashboard(response.data);
      } catch (err) {
        console.error("Dashboard error:", err);
        setError("Unable to load admin dashboard");
      }
    };

    loadDashboard();
  }, []);

  if (error) {
    return <h2>{error}</h2>;
  }

  if (!dashboard) {
    return <h2>Loading Admin Dashboard...</h2>;
  }

  const averageAttendance =
    Number(dashboard.averageAttendance || 0).toFixed(1);

  const averageMarks =
    Number(
      dashboard.averageMarksPercentage || 0
    ).toFixed(1);

  const highestMarks =
    Number(
      dashboard.highestMarksPercentage || 0
    ).toFixed(1);

  return (
    <div className="admin-layout">

      <Sidebar />

      <main className="admin-main">

        {/* Header */}

        <div className="admin-header">
          <h1>Admin Dashboard</h1>

          <p>
            Smart Student Management System
          </p>
        </div>

        {/* Main Statistics */}

        <div className="dashboard-cards">

          <div className="dashboard-card">
            <h3>Total Users</h3>
            <p>
              {dashboard.totalUsers}
            </p>
          </div>

          <div className="dashboard-card">
            <h3>Total Students</h3>
            <p>
              {dashboard.totalStudents}
            </p>
          </div>

          <div className="dashboard-card">
            <h3>Total Courses</h3>
            <p>
              {dashboard.totalCourses}
            </p>
          </div>

          <div className="dashboard-card">
            <h3>Average Attendance</h3>
            <p>
              {averageAttendance}%
            </p>
          </div>

        </div>

        {/* Marks Statistics */}

        <div className="dashboard-cards">

          <div className="dashboard-card">
            <h3>Total Marks Records</h3>
            <p>
              {dashboard.totalMarksRecords || 0}
            </p>
          </div>

          <div className="dashboard-card">
            <h3>Average Marks</h3>
            <p>
              {averageMarks}%
            </p>
          </div>

          <div className="dashboard-card">
            <h3>Highest Marks</h3>
            <p>
              {highestMarks}%
            </p>
          </div>

          <div className="dashboard-card">
            <h3>Present Attendance</h3>
            <p>
              {dashboard.presentAttendance || 0}
            </p>
          </div>

        </div>

        {/* Attendance Overview */}

        <div className="recent-section">

          <h2>Attendance Overview</h2>

          <div className="student-list">

            <div className="student-item">

              <p className="student-name">
                Total Attendance Records
              </p>

              <p>
                {dashboard.totalAttendanceRecords || 0}
              </p>

            </div>

            <div className="student-item">

              <p className="student-name">
                Present
              </p>

              <p>
                {dashboard.presentAttendance || 0}
              </p>

            </div>

            <div className="student-item">

              <p className="student-name">
                Absent
              </p>

              <p>
                {dashboard.absentAttendance || 0}
              </p>

            </div>

          </div>

        </div>

        {/* Recent Students */}

        <div className="recent-section">

          <h2>Recent Students</h2>

          <div className="student-list">

            {dashboard.recentStudents?.length > 0 ? (

              dashboard.recentStudents.map(
                (student) => (

                  <div
                    className="student-item"
                    key={student.id}
                  >

                    <p className="student-name">
                      {student.name}
                    </p>

                    <p>
                      Email: {student.email}
                    </p>

                    <p>
                      Department: {student.department}
                    </p>

                    <p>
                      Year: {student.year}
                    </p>

                  </div>

                )
              )

            ) : (

              <p>
                No recent students found.
              </p>

            )}

          </div>

        </div>

        {/* Recent Marks */}

        <div className="recent-section">

          <h2>Recent Marks</h2>

          <div className="student-list">

            {dashboard.recentMarks?.length > 0 ? (

              dashboard.recentMarks.map(
                (mark) => (

                  <div
                    className="student-item"
                    key={mark.id}
                  >

                    <p className="student-name">
                      {mark.examType ||
                        "Exam"}
                    </p>

                    <p>
                      Student ID:{" "}
                      {mark.studentId}
                    </p>

                    <p>
                      Course ID:{" "}
                      {mark.courseId}
                    </p>

                    <p>
                      Marks:{" "}
                      {mark.marksObtained ?? 0}
                      {" / "}
                      {mark.totalMarks ?? 0}
                    </p>

                    <p>
                      Percentage:{" "}
                      {Number(
                        mark.percentage || 0
                      ).toFixed(1)}
                      %
                    </p>

                  </div>

                )
              )

            ) : (

              <p>
                No recent marks found.
              </p>

            )}

          </div>

        </div>

      </main>

    </div>
  );
}

export default AdminDashboard;