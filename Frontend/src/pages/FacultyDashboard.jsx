import { useEffect, useState } from "react";
import api from "../services/api";

function FacultyDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const facultyName = user?.facultyName || "Dr. Kumar";

        const response = await api.get(
          `/dashboard/faculty/${encodeURIComponent(facultyName)}`
        );

        setDashboard(response.data);
      } catch (err) {
        setError("Unable to load faculty dashboard");
      }
    };

    loadDashboard();
  }, []);

  if (error) {
    return <h2>{error}</h2>;
  }

  if (!dashboard) {
    return <h2>Loading Faculty Dashboard...</h2>;
  }

  return (
    <div>
      <h1>Faculty Dashboard</h1>

      <h3>Total Courses</h3>
      <p>{dashboard.totalCourses}</p>

      <h2>Assigned Courses</h2>

      {dashboard.courses?.map((course) => (
        <div key={course.courseId}>
          <p>Course: {course.courseName}</p>
          <p>Code: {course.courseCode}</p>
          <p>Department: {course.department}</p>
          <p>Year: {course.year}</p>
          <p>Students: {course.studentCount}</p>
        </div>
      ))}
    </div>
  );
}

export default FacultyDashboard;
