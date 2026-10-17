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
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
        const facultyName = storedUser?.facultyName || storedUser?.name || "Dr. Kumar";
        const response = await api.get(`/dashboard/faculty/${encodeURIComponent(facultyName)}`);
        if (active) setDashboard(response.data);
      } catch (err) {
        if (active) setError(err.response?.status === 401
          ? "Your session has expired. Please sign in again."
          : err.response?.status === 403
            ? "Your account does not have permission to view this dashboard."
            : "Unable to load faculty dashboard. Check the backend and your faculty account.");
      }
    };
    loadDashboard();
    return () => { active = false; };
  }, []);

  if (error) return <div className="faculty-dashboard-message"><h2>Faculty dashboard unavailable</h2><p>{error}</p><Link to="/login">Return to login</Link></div>;
  if (!dashboard) return <div className="faculty-dashboard-message"><div className="loading-dot"/><h2>Loading faculty dashboard…</h2><p>Fetching your courses and class overview.</p></div>;

  const courses = dashboard.courses || [];
  const totalStudents = courses.reduce((total, course) => total + Number(course.studentCount || 0), 0);
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const facultyName = storedUser?.facultyName || storedUser?.name || "Faculty member";

  return (
    <div className="faculty-dashboard-layout">
      <Sidebar />
      <main className="faculty-dashboard-main">
        <header className="faculty-dashboard-header">
          <div><span className="page-eyebrow">Faculty workspace</span><h1>Good to see you, {facultyName}</h1><p>Here is a quick overview of your teaching activity.</p></div>
          <div className="faculty-dashboard-avatar">{String(facultyName).charAt(0).toUpperCase()}</div>
        </header>

        <section className="faculty-dashboard-welcome">
          <div><span className="faculty-welcome-label">YOUR TEACHING OVERVIEW</span><h2>Make every class count.</h2><p>Review your assigned courses and jump into academic management.</p></div>
          <div className="faculty-welcome-symbol">✦</div>
        </section>

        <section className="faculty-dashboard-stats" aria-label="Faculty statistics">
          <article className="faculty-stat-card"><span className="faculty-stat-icon indigo">▤</span><div><p>Assigned courses</p><strong>{dashboard.totalCourses ?? courses.length}</strong><small>Courses in your workload</small></div></article>
          <article className="faculty-stat-card"><span className="faculty-stat-icon teal">♙</span><div><p>Students across courses</p><strong>{totalStudents}</strong><small>Based on course enrolments</small></div></article>
          <article className="faculty-stat-card"><span className="faculty-stat-icon amber">✓</span><div><p>Course overview</p><strong>{courses.length}</strong><small>Course records returned</small></div></article>
        </section>

        <section className="faculty-courses-panel">
          <div className="faculty-panel-heading"><div><h2>Assigned courses</h2><p>Course details provided by your student management system.</p></div><span className="faculty-count-pill">{courses.length} courses</span></div>
          {courses.length ? <div className="faculty-course-grid">{courses.map((course) => <article className="faculty-course-card" key={course.courseId ?? course.id ?? course.courseCode}>
            <div className="faculty-course-top"><span className="faculty-course-mark">{String(course.courseName || "C").charAt(0).toUpperCase()}</span><span className="faculty-course-code">{course.courseCode || "COURSE"}</span></div>
            <h3>{course.courseName || "Untitled course"}</h3>
            <p className="faculty-course-department">{course.department || "Department not specified"}</p>
            <div className="faculty-course-meta"><span>Academic year</span><strong>{course.year ?? "—"}</strong></div>
            <div className="faculty-course-meta"><span>Students enrolled</span><strong>{course.studentCount ?? 0}</strong></div>
          </article>)}</div> : <div className="faculty-empty-state"><span>▤</span><h3>No assigned courses found</h3><p>When courses are assigned to your account, they will appear here.</p></div>}
        </section>

        <section className="faculty-quick-links"><div><h2>Quick access</h2><p>Open an academic management area.</p></div><div className="faculty-quick-link-list"><Link to="/attendance">Manage attendance <span>↗</span></Link><Link to="/marks">Manage marks <span>↗</span></Link><Link to="/courses">View courses <span>↗</span></Link></div></section>
      </main>
    </div>
  );
}

export default FacultyDashboard;
