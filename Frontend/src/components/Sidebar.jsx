import { NavLink, useNavigate } from "react-router-dom";
import "../styles/Sidebar.css";

function Sidebar() {
  const navigate = useNavigate();
  let user = {};
  try {
    user = JSON.parse(localStorage.getItem("user") || "{}");
  } catch {
    user = {};
  }

  const role = String(user.role || "ADMIN").toUpperCase();
  const navItems = role === "STUDENT"
    ? [{ to: "/student", label: "My dashboard", icon: "⌂" }]
    : role === "FACULTY"
      ? [
          { to: "/faculty-dashboard", label: "Dashboard", icon: "▦" },
          { to: "/courses", label: "Courses", icon: "▤" },
          { to: "/attendance", label: "Attendance", icon: "✓" },
          { to: "/marks", label: "Marks", icon: "✎" },
        ]
      : [
          { to: "/admin", label: "Dashboard", icon: "▦" },
          { to: "/students", label: "Students", icon: "♙" },
          { to: "/faculty", label: "Faculty", icon: "♧" },
          { to: "/courses", label: "Courses", icon: "▤" },
          { to: "/attendance", label: "Attendance", icon: "✓" },
          { to: "/marks", label: "Marks", icon: "✎" },
        ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-brand-mark">S</div>
        <div><h2>Smart SMS</h2><p>Student Management</p></div>
      </div>
      <div className="sidebar-role">{role} WORKSPACE</div>
      <nav className="sidebar-nav" aria-label="Main navigation">
        {navItems.map((item) => (
          <NavLink key={item.to} to={item.to} className="sidebar-link">
            <span className="sidebar-link-icon" aria-hidden="true">{item.icon}</span>
            <span>{item.label}</span>
            <span className="sidebar-link-arrow" aria-hidden="true">›</span>
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-bottom">
        <div className="sidebar-user"><span className="sidebar-user-avatar">{String(user.name || user.username || role).charAt(0).toUpperCase()}</span><div><strong>{user.name || user.username || "Signed-in user"}</strong><span>{role.toLowerCase()}</span></div></div>
        <button className="logout-button" onClick={handleLogout}><span aria-hidden="true">↪</span> Sign out</button>
      </div>
    </aside>
  );
}

export default Sidebar;
