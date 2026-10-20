
import { useEffect, useState } from "react";
import api from "../services/api";
import Sidebar from "../components/Sidebar";
import "../styles/AdminDashboard.css";

const StatCard = ({ icon, label, value, description, accent }) => (
  <article className={`admin-stat-card ${accent || ""}`}>
    <div className="admin-stat-top">
      <span className="admin-stat-icon" aria-hidden="true">
        {icon}
      </span>
      <span className="admin-stat-label">{label}</span>
    </div>

    <p className="admin-stat-value">{value}</p>

    <span className="admin-stat-description">{description}</span>
  </article>
);

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
        setError("Unable to load admin dashboard. Please try again.");
      }
    };

    loadDashboard();
  }, []);

  if (error) {
    return (
      <div className="admin-layout">
        <Sidebar />

        <main className="admin-main">
          <div className="admin-state-card">
            <span className="admin-state-icon">!</span>
            <h2>Dashboard unavailable</h2>
            <p>{error}</p>

            <button
              className="admin-retry-button"
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        </main>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="admin-layout">
        <Sidebar />

        <main className="admin-main">
          <div className="admin-loading-card">
            <div className="admin-loader" />
            <h2>Loading Admin Dashboard</h2>
            <p>Preparing your institution overview...</p>
          </div>
        </main>
      </div>
    );
  }

  const totalUsers = Number(dashboard.totalUsers || 0);
  const totalStudents = Number(dashboard.totalStudents || 0);
  const totalCourses = Number(dashboard.totalCourses || 0);

  const averageAttendance = Number(
    dashboard.averageAttendance || 0
  ).toFixed(1);

  const totalMarksRecords = Number(
    dashboard.totalMarksRecords || 0
  );

  const averageMarks = Number(
    dashboard.averageMarksPercentage || 0
  ).toFixed(1);

  const highestMarks = Number(
    dashboard.highestMarksPercentage || 0
  ).toFixed(1);

  const presentAttendance = Number(
    dashboard.presentAttendance || 0
  );

  const absentAttendance = Number(
    dashboard.absentAttendance || 0
  );

  const totalAttendanceRecords = Number(
    dashboard.totalAttendanceRecords || 0
  );

  const attendanceRate = totalAttendanceRecords
    ? Math.min(
        100,
        (presentAttendance / totalAttendanceRecords) * 100
      )
    : 0;

  return (
    <div className="admin-layout">
      <Sidebar />

      <main className="admin-main">
        <header className="admin-header">
          <div>
            <span className="admin-eyebrow">
              INSTITUTION OVERVIEW
            </span>

            <h1>Admin Dashboard</h1>

            <p>
              Monitor students, academics and institutional
              performance in one place.
            </p>
          </div>

          <div className="admin-header-badge">
            <span className="admin-status-dot" />
            Administrator workspace
          </div>
        </header>

        <section className="admin-welcome-banner">
          <div className="admin-welcome-content">
            <span className="admin-welcome-label">
              SMART STUDENT MANAGEMENT SYSTEM
            </span>

            <h2>Welcome to your dashboard!</h2>

            <p>
              Your overview of student records, courses,
              attendance and academic performance.
            </p>

            <div className="admin-welcome-tags">
              <span>Administration</span>
              <span>Academic overview</span>
            </div>
          </div>

          <div
            className="admin-welcome-decoration"
            aria-hidden="true"
          >
            <span className="admin-decoration-circle admin-circle-one" />
            <span className="admin-decoration-circle admin-circle-two" />
            <span className="admin-decoration-symbol">✦</span>
          </div>
        </section>

        <section className="admin-section">
          <div className="admin-section-heading">
            <div>
              <span className="admin-eyebrow">AT A GLANCE</span>
              <h2>Institution statistics</h2>
            </div>

            <span className="admin-section-caption">
              Current dashboard data
            </span>
          </div>

          <div className="admin-dashboard-cards">
            <StatCard
              icon="◉"
              label="Total Users"
              value={totalUsers}
              description="Registered system users"
              accent="admin-accent-blue"
            />

            <StatCard
              icon="♙"
              label="Total Students"
              value={totalStudents}
              description="Student records"
              accent="admin-accent-purple"
            />

            <StatCard
              icon="▤"
              label="Total Courses"
              value={totalCourses}
              description="Available courses"
              accent="admin-accent-orange"
            />

            <StatCard
              icon="◷"
              label="Average Attendance"
              value={`${averageAttendance}%`}
              description="Overall attendance average"
              accent="admin-accent-green"
            />
          </div>
        </section>

        <section className="admin-section">
          <div className="admin-section-heading">
            <div>
              <span className="admin-eyebrow">ACADEMIC RESULTS</span>
              <h2>Marks overview</h2>
            </div>
          </div>

          <div className="admin-dashboard-cards">
            <StatCard
              icon="▣"
              label="Marks Records"
              value={totalMarksRecords}
              description="Recorded examination results"
              accent="admin-accent-blue"
            />

            <StatCard
              icon="↗"
              label="Average Marks"
              value={`${averageMarks}%`}
              description="Average marks percentage"
              accent="admin-accent-purple"
            />

            <StatCard
              icon="★"
              label="Highest Marks"
              value={`${highestMarks}%`}
              description="Highest recorded percentage"
              accent="admin-accent-orange"
            />

            <StatCard
              icon="✓"
              label="Present Attendance"
              value={presentAttendance}
              description="Attendance entries marked present"
              accent="admin-accent-green"
            />
          </div>
        </section>

        <section className="admin-content-grid">
          <article className="admin-panel admin-attendance-panel">
            <div className="admin-panel-heading">
              <div>
                <span className="admin-eyebrow">ATTENDANCE</span>
                <h2>Attendance overview</h2>
              </div>

              <span className="admin-panel-icon">◷</span>
            </div>

            <div className="admin-attendance-summary">
              <div
                className="admin-attendance-ring"
                style={{
                  "--attendance-value": `${attendanceRate}%`,
                }}
              >
                <div>
                  <strong>{attendanceRate.toFixed(1)}%</strong>
                  <span>Present</span>
                </div>
              </div>

              <div className="admin-attendance-legend">
                <div className="admin-legend-item">
                  <span className="admin-legend-dot present-dot" />
                  <span>Present</span>
                  <strong>{presentAttendance}</strong>
                </div>

                <div className="admin-legend-item">
                  <span className="admin-legend-dot absent-dot" />
                  <span>Absent</span>
                  <strong>{absentAttendance}</strong>
                </div>

                <div className="admin-legend-item">
                  <span className="admin-legend-dot total-dot" />
                  <span>Total records</span>
                  <strong>{totalAttendanceRecords}</strong>
                </div>
              </div>
            </div>

            <div className="admin-progress-track">
              <div
                className="admin-progress-fill"
                style={{ width: `${attendanceRate}%` }}
              />
            </div>

            <p className="admin-panel-note">
              Present attendance as a percentage of all attendance
              records.
            </p>
          </article>

          <article className="admin-panel">
            <div className="admin-panel-heading">
              <div>
                <span className="admin-eyebrow">QUICK SUMMARY</span>
                <h2>System snapshot</h2>
              </div>

              <span className="admin-panel-icon">▦</span>
            </div>

            <div className="admin-snapshot-list">
              <div className="admin-snapshot-item">
                <span className="admin-snapshot-icon">♙</span>

                <div>
                  <strong>Student records</strong>
                  <p>Manage student information</p>
                </div>

                <strong>{totalStudents}</strong>
              </div>

              <div className="admin-snapshot-item">
                <span className="admin-snapshot-icon">▤</span>

                <div>
                  <strong>Course catalogue</strong>
                  <p>Monitor available courses</p>
                </div>

                <strong>{totalCourses}</strong>
              </div>

              <div className="admin-snapshot-item">
                <span className="admin-snapshot-icon">▣</span>

                <div>
                  <strong>Examination records</strong>
                  <p>Review recorded marks</p>
                </div>

                <strong>{totalMarksRecords}</strong>
              </div>
            </div>
          </article>
        </section>

        <section className="admin-panel admin-recent-panel">
          <div className="admin-panel-heading">
            <div>
              <span className="admin-eyebrow">LATEST RECORDS</span>
              <h2>Recent students</h2>
            </div>

            <span className="admin-record-count">
              {dashboard.recentStudents?.length || 0} records
            </span>
          </div>

          {dashboard.recentStudents?.length > 0 ? (
            <div className="admin-record-grid">
              {dashboard.recentStudents.map((student) => (
                <article
                  className="admin-record-card"
                  key={student.id}
                >
                  <div className="admin-record-avatar">
                    {String(student.name || "S")
                      .trim()
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <div className="admin-record-details">
                    <h3>{student.name || "Unnamed student"}</h3>

                    <p>
                      {student.email || "No email available"}
                    </p>

                    <div className="admin-record-tags">
                      <span>
                        {student.department || "Department N/A"}
                      </span>

                      <span>
                        Year {student.year ?? "N/A"}
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="admin-empty-state">
              <span>♙</span>
              <p>No recent students found.</p>
            </div>
          )}
        </section>

        <section className="admin-panel admin-recent-panel">
          <div className="admin-panel-heading">
            <div>
              <span className="admin-eyebrow">
                EXAMINATION ACTIVITY
              </span>
              <h2>Recent marks</h2>
            </div>

            <span className="admin-record-count">
              {dashboard.recentMarks?.length || 0} records
            </span>
          </div>

          {dashboard.recentMarks?.length > 0 ? (
            <div className="admin-marks-table-wrap">
              <table className="admin-marks-table">
                <thead>
                  <tr>
                    <th>Exam</th>
                    <th>Student ID</th>
                    <th>Course ID</th>
                    <th>Marks</th>
                    <th>Percentage</th>
                  </tr>
                </thead>

                <tbody>
                  {dashboard.recentMarks.map((mark) => (
                    <tr key={mark.id}>
                      <td>
                        <strong>{mark.examType || "Exam"}</strong>
                      </td>

                      <td>{mark.studentId ?? "—"}</td>

                      <td>{mark.courseId ?? "—"}</td>

                      <td>
                        {mark.marksObtained ?? 0} /{" "}
                        {mark.totalMarks ?? 0}
                      </td>

                      <td>
                        <span className="admin-percentage-badge">
                          {Number(mark.percentage || 0).toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="admin-empty-state">
              <span>▣</span>
              <p>No recent marks found.</p>
            </div>
          )}
        </section>

        <footer className="admin-footer">
          Smart Student Management System · Admin workspace
        </footer>
      </main>
    </div>
  );
}

export default AdminDashboard;
