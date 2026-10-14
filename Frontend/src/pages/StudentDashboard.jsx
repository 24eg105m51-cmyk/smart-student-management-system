import { useEffect, useState } from "react";
import api from "../services/api";
import Sidebar from "../components/Sidebar";
import "../styles/StudentDashboard.css";

function StudentDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const loadDashboard = async () => {
      try {
        setError("");
        const dashboardResponse = await api.get("/dashboard/student/me");
        const studentDashboard = dashboardResponse.data;
        const coursesResponse = await api.get(
          `/enrollments/student/${studentDashboard.studentId}`
        );

        if (active) {
          setDashboard({
            ...studentDashboard,
            courses: Array.isArray(coursesResponse.data)
              ? coursesResponse.data
              : [],
          });
        }
      } catch (err) {
        console.error("Student dashboard error:", err);

        if (!active) return;

        if (err.response) {
          if (err.response.status === 401) {
            setError("Your login session has expired. Please log in again.");
          } else if (err.response.status === 403) {
            setError("You do not have permission to access the student dashboard.");
          } else {
            setError(
              typeof err.response.data === "string"
                ? err.response.data
                : "Unable to load the student dashboard. Please try again."
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
    return () => {
      active = false;
    };
  }, []);

  if (error) {
    return (
      <div className="student-layout">
        <Sidebar />
        <main className="student-main">
          <div className="student-state-card student-error-state">
            <div className="student-state-icon" aria-hidden="true">!</div>
            <h1>Dashboard unavailable</h1>
            <p>{error}</p>
            <button className="student-primary-button" onClick={() => window.location.reload()}>
              Try again
            </button>
          </div>
        </main>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="student-layout">
        <Sidebar />
        <main className="student-main">
          <div className="student-state-card" role="status">
            <span className="student-spinner" aria-hidden="true" />
            <h1>Preparing your dashboard</h1>
            <p>Loading your profile, attendance, marks and courses…</p>
          </div>
        </main>
      </div>
    );
  }

  const attendanceValue = Number(dashboard.attendancePercentage || 0);
  const marksValue = Number(dashboard.overallMarksPercentage || 0);
  const attendancePercentage = Math.max(0, Math.min(100, attendanceValue));
  const marksPercentage = Math.max(0, Math.min(100, marksValue));
  const totalClasses = Number(dashboard.totalClasses || 0);
  const presentClasses = Number(dashboard.presentClasses || 0);
  const marks = Array.isArray(dashboard.marks) ? dashboard.marks : [];
  const courses = Array.isArray(dashboard.courses) ? dashboard.courses : [];
  const firstName = String(dashboard.name || "Student").trim().split(/\s+/)[0];
  const avatarLetter = String(dashboard.name || "S").trim().charAt(0).toUpperCase();

  return (
    <div className="student-layout">
      <Sidebar />

      <main className="student-main">
        <header className="student-header">
          <div>
            <div className="student-eyebrow">STUDENT PORTAL</div>
            <h1>Student Dashboard</h1>
            <p>Here’s your academic overview at a glance.</p>
          </div>
          <div className="student-header-date">
            <span className="student-header-dot" />
            <span>Academic overview</span>
          </div>
        </header>

        <section className="student-welcome-banner" aria-label="Welcome">
          <div className="student-welcome-copy">
            <span className="student-welcome-kicker">YOUR LEARNING JOURNEY</span>
            <h2>Welcome back, {firstName} <span aria-hidden="true">👋</span></h2>
            <p>Keep up the good work. Track your attendance, review your marks and stay on top of your courses.</p>
            <div className="student-welcome-tags">
              <span>{dashboard.department || "Department not set"}</span>
              <span>{dashboard.year || "Year not set"}</span>
            </div>
          </div>
          <div className="student-welcome-art" aria-hidden="true">
            <div className="student-art-circle student-art-circle-one" />
            <div className="student-art-circle student-art-circle-two" />
            <div className="student-art-book">▤</div>
            <div className="student-art-spark student-art-spark-one">✦</div>
            <div className="student-art-spark student-art-spark-two">✧</div>
          </div>
        </section>

        <section className="student-stats-grid" aria-label="Academic statistics">
          <article className="student-stat-card stat-blue">
            <div className="student-stat-top"><span>Total Classes</span><span className="student-stat-icon">▦</span></div>
            <strong>{totalClasses}</strong>
            <small>Classes recorded</small>
            <div className="student-stat-accent" />
          </article>
          <article className="student-stat-card stat-green">
            <div className="student-stat-top"><span>Present Classes</span><span className="student-stat-icon">✓</span></div>
            <strong>{presentClasses}</strong>
            <small>Classes attended</small>
            <div className="student-stat-accent" />
          </article>
          <article className="student-stat-card stat-violet">
            <div className="student-stat-top"><span>Attendance</span><span className="student-stat-icon">◷</span></div>
            <strong>{attendancePercentage.toFixed(1)}<small className="student-stat-percent">%</small></strong>
            <small>Overall attendance</small>
            <div className="student-stat-accent" />
          </article>
          <article className="student-stat-card stat-orange">
            <div className="student-stat-top"><span>Marks Percentage</span><span className="student-stat-icon">✎</span></div>
            <strong>{marksPercentage.toFixed(1)}<small className="student-stat-percent">%</small></strong>
            <small>Overall marks</small>
            <div className="student-stat-accent" />
          </article>
        </section>

        <div className="student-overview-grid">
          <section className="student-panel student-profile-panel">
            <div className="student-panel-heading">
              <div><span className="student-panel-kicker">ACCOUNT</span><h2>Profile details</h2></div>
              <span className="student-panel-symbol">♙</span>
            </div>
            <div className="student-profile-summary">
              <div className="student-avatar">{avatarLetter || "S"}</div>
              <div className="student-profile-title">
                <h3>{dashboard.name || "Student"}</h3>
                <p>{dashboard.email || "Email not available"}</p>
                <span className="student-profile-status"><i /> Student account</span>
              </div>
            </div>
            <div className="student-profile-fields">
              <div><span>Phone number</span><strong>{dashboard.phone || "Not available"}</strong></div>
              <div><span>Department</span><strong>{dashboard.department || "Not available"}</strong></div>
              <div><span>Academic year</span><strong>{dashboard.year || "Not available"}</strong></div>
              <div><span>Email address</span><strong className="student-break-word">{dashboard.email || "Not available"}</strong></div>
            </div>
          </section>

          <section className="student-panel student-attendance-panel">
            <div className="student-panel-heading">
              <div><span className="student-panel-kicker">CONSISTENCY</span><h2>Attendance overview</h2></div>
              <span className="student-panel-symbol attendance-symbol">◷</span>
            </div>
            <div className="student-attendance-content">
              <div className="student-attendance-ring" style={{ "--attendance-value": `${attendancePercentage}%` }} role="img" aria-label={`Attendance ${attendancePercentage.toFixed(1)} percent`}>
                <div className="student-attendance-ring-inner"><strong>{attendancePercentage.toFixed(1)}%</strong><span>Attendance</span></div>
              </div>
              <div className="student-attendance-note">
                <strong>{attendancePercentage >= 75 ? "Keep it up!" : "Attendance needs attention"}</strong>
                <p>{attendancePercentage >= 75 ? "Stay consistent with your classes to maintain your progress." : "Try to attend upcoming classes regularly to improve your percentage."}</p>
              </div>
            </div>
            <div className="student-attendance-metrics">
              <div><span><i className="attendance-dot dot-present" />Present</span><strong>{presentClasses}</strong></div>
              <div><span><i className="attendance-dot dot-total" />Total classes</span><strong>{totalClasses}</strong></div>
            </div>
          </section>
        </div>

        <section className="student-panel student-marks-overview-panel">
          <div className="student-panel-heading">
            <div><span className="student-panel-kicker">PERFORMANCE</span><h2>Marks overview</h2></div>
            <span className="student-panel-symbol marks-symbol">✎</span>
          </div>
          <div className="student-marks-summary-grid">
            <div className="student-marks-summary-item"><span>Total marks obtained</span><strong>{Number(dashboard.totalMarks || 0)}</strong><small>Across recorded exams</small></div>
            <div className="student-marks-summary-item"><span>Maximum marks</span><strong>{Number(dashboard.totalMaxMarks || 0)}</strong><small>Available marks</small></div>
            <div className="student-marks-summary-item student-marks-summary-highlight"><span>Overall percentage</span><strong>{marksPercentage.toFixed(1)}%</strong><div className="student-progress-track"><span style={{ width: `${marksPercentage}%` }} /></div></div>
          </div>
        </section>

        <section className="student-panel student-table-panel">
          <div className="student-panel-heading student-table-heading">
            <div><span className="student-panel-kicker">ASSESSMENTS</span><h2>My marks</h2><p>Review your exam results and percentages.</p></div>
            <span className="student-count-pill">{marks.length} {marks.length === 1 ? "exam" : "exams"}</span>
          </div>
          <div className="student-table-scroll">
            <table className="student-data-table">
              <thead><tr><th>Exam</th><th>Marks obtained</th><th>Maximum marks</th><th>Percentage</th></tr></thead>
              <tbody>
                {marks.length > 0 ? marks.map((mark, index) => {
                  const obtained = Number(mark.marksObtained ?? mark.marks ?? 0);
                  const total = Number(mark.totalMarks ?? mark.maxMarks ?? 0);
                  const percentage = total > 0 ? (obtained / total) * 100 : 0;
                  return <tr key={mark.id ?? `${mark.examType || "exam"}-${index}`}>
                    <td><span className="student-exam-mark">{String(mark.examType || "Exam").charAt(0).toUpperCase()}</span><strong>{mark.examType || "Not specified"}</strong></td>
                    <td>{obtained}</td><td>{total}</td>
                    <td><span className={`student-result-badge ${percentage >= 75 ? "result-good" : percentage >= 40 ? "result-average" : "result-low"}`}>{percentage.toFixed(1)}%</span></td>
                  </tr>;
                }) : <tr><td colSpan="4" className="student-empty-table">No marks available yet.</td></tr>}
              </tbody>
            </table>
          </div>
        </section>

        <section className="student-panel student-courses-panel">
          <div className="student-panel-heading student-table-heading">
            <div><span className="student-panel-kicker">YOUR STUDIES</span><h2>My courses</h2><p>Courses associated with your student account.</p></div>
            <span className="student-count-pill">{courses.length} {courses.length === 1 ? "course" : "courses"}</span>
          </div>
          {courses.length > 0 ? <div className="student-course-grid">
            {courses.map((course, index) => <article className="student-course-card" key={course.id ?? `${course.courseCode || "course"}-${index}`}>
              <div className="student-course-card-top"><span className="student-course-icon">▤</span><span className="student-course-label">COURSE {String(index + 1).padStart(2, "0")}</span></div>
              <h3>{course.courseName || "Untitled course"}</h3>
              <span className="student-course-code">{course.courseCode || "Code not available"}</span>
              <div className="student-course-meta"><div><span>Department</span><strong>{course.department || "Not available"}</strong></div><div><span>Year</span><strong>{course.year ?? "Not available"}</strong></div><div className="student-course-faculty"><span>Faculty</span><strong>{course.facultyName || course.faculty?.name || course.faculty || "Not assigned"}</strong></div></div>
            </article>)}
          </div> : <div className="student-empty-courses"><span aria-hidden="true">▤</span><strong>No courses found</strong><p>Your enrolled courses will appear here when available.</p></div>}
        </section>

        <footer className="student-dashboard-footer">Smart Student Management System <span>•</span> Student workspace</footer>
      </main>
    </div>
  );
}

export default StudentDashboard;
