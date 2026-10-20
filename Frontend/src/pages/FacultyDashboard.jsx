
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import Sidebar from "../components/Sidebar";
import "../styles/FacultyDashboard.css";

function FacultyDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const loadDashboard = async () => {
      try {
        const storedUser = JSON.parse(
          localStorage.getItem("user") || "{}"
        );

        const facultyName =
          storedUser?.facultyName ||
          storedUser?.name ||
          "Dr. Kumar";

        const response = await api.get(
          `/dashboard/faculty/${encodeURIComponent(facultyName)}`
        );

        if (active) {
          setDashboard(response.data);
        }
      } catch (err) {
        if (!active) return;

        setError(
          err.response?.status === 401
            ? "Your session has expired. Please sign in again."
            : err.response?.status === 403
              ? "Your account does not have permission to view this dashboard."
              : "Unable to load faculty dashboard. Check the backend and your faculty account."
        );
      }
    };

    loadDashboard();

    return () => {
      active = false;
    };
  }, []);

  if (error) {
    return (
      <div className="faculty-dashboard-layout">
        <Sidebar />

        <main className="faculty-dashboard-main">
          <div className="faculty-dashboard-message">
            <div className="faculty-message-icon">!</div>
            <span className="page-eyebrow">FACULTY WORKSPACE</span>
            <h2>Faculty dashboard unavailable</h2>
            <p>{error}</p>
            <Link className="faculty-retry-link" to="/login">
              Return to login
            </Link>
          </div>
        </main>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="faculty-dashboard-layout">
        <Sidebar />

        <main className="faculty-dashboard-main">
          <div className="faculty-dashboard-message">
            <div className="faculty-loading-spinner" />
            <h2>Loading Faculty Dashboard</h2>
            <p>Fetching your courses and class overview...</p>
          </div>
        </main>
      </div>
    );
  }

  const courses = Array.isArray(dashboard.courses)
    ? dashboard.courses
    : [];

  const totalStudents = courses.reduce(
    (total, course) =>
      total + Number(course.studentCount || 0),
    0
  );

  const storedUser = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const facultyName =
    storedUser?.facultyName ||
    storedUser?.name ||
    "Faculty member";

  const totalCourses = Number(
    dashboard.totalCourses ?? courses.length
  );

  return (
    <div className="faculty-dashboard-layout">
      <Sidebar />

      <main className="faculty-dashboard-main">
        <header className="faculty-dashboard-header">
          <div>
            <span className="page-eyebrow">
              FACULTY WORKSPACE
            </span>

            <h1>Faculty Dashboard</h1>

            <p>
              Welcome back, {facultyName}. Here is your teaching
              and academic overview.
            </p>
          </div>

          <div className="faculty-dashboard-avatar">
            {String(facultyName).trim().charAt(0).toUpperCase()}
          </div>
        </header>

        <section className="faculty-dashboard-welcome">
          <div className="faculty-welcome-content">
            <span className="faculty-welcome-label">
              YOUR TEACHING OVERVIEW
            </span>

            <h2>Make every class count.</h2>

            <p>
              Review your assigned courses, monitor enrolments,
              and access academic management tools.
            </p>

            <div className="faculty-welcome-tags">
              <span>Faculty workspace</span>
              <span>Teaching overview</span>
            </div>
          </div>

          <div
            className="faculty-welcome-decoration"
            aria-hidden="true"
          >
            <span className="faculty-decoration-circle faculty-circle-one" />
            <span className="faculty-decoration-circle faculty-circle-two" />
            <span className="faculty-welcome-symbol">✦</span>
          </div>
        </section>

        <section className="faculty-dashboard-section">
          <div className="faculty-section-heading">
            <div>
              <span className="page-eyebrow">AT A GLANCE</span>
              <h2>Teaching statistics</h2>
            </div>

            <span className="faculty-section-caption">
              Your current workload
            </span>
          </div>

          <div
            className="faculty-dashboard-stats"
            aria-label="Faculty statistics"
          >
            <article className="faculty-stat-card faculty-accent-blue">
              <div className="faculty-stat-top">
                <span className="faculty-stat-icon">▤</span>
                <span>Assigned courses</span>
              </div>

              <strong>{totalCourses}</strong>

              <small>Courses in your workload</small>
            </article>

            <article className="faculty-stat-card faculty-accent-purple">
              <div className="faculty-stat-top">
                <span className="faculty-stat-icon">♙</span>
                <span>Students across courses</span>
              </div>

              <strong>{totalStudents}</strong>

              <small>Based on course enrolments</small>
            </article>

            <article className="faculty-stat-card faculty-accent-green">
              <div className="faculty-stat-top">
                <span className="faculty-stat-icon">✓</span>
                <span>Course records</span>
              </div>

              <strong>{courses.length}</strong>

              <small>Course records returned</small>
            </article>
          </div>
        </section>

        <section className="faculty-panel faculty-courses-panel">
          <div className="faculty-panel-heading">
            <div>
              <span className="page-eyebrow">
                YOUR TEACHING
              </span>

              <h2>Assigned courses</h2>

              <p>
                Course details provided by your student management
                system.
              </p>
            </div>

            <span className="faculty-count-pill">
              {courses.length} courses
            </span>
          </div>

          {courses.length > 0 ? (
            <div className="faculty-course-grid">
              {courses.map((course) => (
                <article
                  className="faculty-course-card"
                  key={
                    course.courseId ??
                    course.id ??
                    course.courseCode
                  }
                >
                  <div className="faculty-course-top">
                    <span className="faculty-course-mark">
                      {String(course.courseName || "C")
                        .trim()
                        .charAt(0)
                        .toUpperCase()}
                    </span>

                    <span className="faculty-course-code">
                      {course.courseCode || "COURSE"}
                    </span>
                  </div>

                  <h3>
                    {course.courseName || "Untitled course"}
                  </h3>

                  <p className="faculty-course-department">
                    {course.department ||
                      "Department not specified"}
                  </p>

                  <div className="faculty-course-meta">
                    <span>Academic year</span>
                    <strong>{course.year ?? "—"}</strong>
                  </div>

                  <div className="faculty-course-meta">
                    <span>Students enrolled</span>
                    <strong>{course.studentCount ?? 0}</strong>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="faculty-empty-state">
              <span>▤</span>
              <h3>No assigned courses found</h3>
              <p>
                When courses are assigned to your account, they
                will appear here.
              </p>
            </div>
          )}
        </section>

        <section className="faculty-panel faculty-quick-links">
          <div className="faculty-panel-heading">
            <div>
              <span className="page-eyebrow">SHORTCUTS</span>
              <h2>Quick access</h2>
              <p>
                Open an academic management area.
              </p>
            </div>
          </div>

          <div className="faculty-quick-link-list">
            <Link to="/attendance">
              <span className="faculty-quick-icon">◷</span>
              <span className="faculty-quick-text">
                <strong>Manage attendance</strong>
                <small>Review and manage class attendance</small>
              </span>
              <span className="faculty-quick-arrow">↗</span>
            </Link>

            <Link to="/marks">
              <span className="faculty-quick-icon">▣</span>
              <span className="faculty-quick-text">
                <strong>Manage marks</strong>
                <small>Access student examination records</small>
              </span>
              <span className="faculty-quick-arrow">↗</span>
            </Link>

            <Link to="/courses">
              <span className="faculty-quick-icon">▤</span>
              <span className="faculty-quick-text">
                <strong>View courses</strong>
                <small>Open the course management page</small>
              </span>
              <span className="faculty-quick-arrow">↗</span>
            </Link>
          </div>
        </section>

        <footer className="faculty-dashboard-footer">
          Smart Student Management System · Faculty workspace
        </footer>
      </main>
    </div>
  );
}

export default FacultyDashboard;
