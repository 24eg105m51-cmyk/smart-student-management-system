import { NavLink, useNavigate } from "react-router-dom";
import "../styles/Sidebar.css";

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <aside className="sidebar">

      <div className="sidebar-logo">
        <h2>Smart SMS</h2>
        <p>Student Management</p>
      </div>

      <nav className="sidebar-nav">

        <NavLink
          to="/admin"
          className="sidebar-link"
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/students"
          className="sidebar-link"
        >
          Students
        </NavLink>

        <NavLink
          to="/faculty"
          className="sidebar-link"
        >
          Faculty
        </NavLink>

        <NavLink
          to="/courses"
          className="sidebar-link"
        >
          Courses
        </NavLink>

        <NavLink
          to="/attendance"
          className="sidebar-link"
        >
          Attendance
        </NavLink>

        <NavLink
          to="/marks"
          className="sidebar-link"
        >
          Marks
        </NavLink>

        <NavLink
          to="/reports"
          className="sidebar-link"
        >
          Reports
        </NavLink>

      </nav>

      <button
        className="logout-button"
        onClick={handleLogout}
      >
        Logout
      </button>

    </aside>
  );
}

export default Sidebar;