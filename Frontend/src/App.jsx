import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import Faculty from "./pages/Faculty";
import StudentDashboard from "./pages/StudentDashboard";
import Students from "./pages/Students";
import Courses from "./pages/Courses";
import Attendance from "./pages/Attendance";
import Marks from "./pages/Marks";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Default */}
        <Route
          path="/"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />

        {/* Login */}
        <Route
          path="/login"
          element={<Login />}
        />

        {/* Admin Dashboard */}
        <Route
          path="/admin"
          element={<AdminDashboard />}
        />

        {/* Student Management */}
        <Route
          path="/students"
          element={<Students />}
        />

        {/* Faculty Management */}
        <Route
          path="/faculty"
          element={<Faculty />}
        />

        {/* Course Management */}
        <Route
          path="/courses"
          element={<Courses />}
        />

        {/* Attendance Management */}
        <Route
          path="/attendance"
          element={<Attendance />}
        />

        {/* Marks Management */}
        <Route
          path="/marks"
          element={<Marks />}
        />

        {/* Student Dashboard */}
        <Route
          path="/student"
          element={<StudentDashboard />}
        />

        {/* Unknown URL */}
        <Route
          path="*"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;