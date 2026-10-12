# Smart Student Management System

A web-based application developed using **Spring Boot, React, and MySQL** to manage student information and academic activities through role-based dashboards.

## Project Overview

The Smart Student Management System helps manage student records and academic information in a centralized application. It provides separate dashboards for administrators, faculty members, and students.

## Features

- **Admin Dashboard:** Manage and monitor student management activities.
- **Faculty Dashboard:** Access faculty-related academic features.
- **Student Dashboard:** Access student-related information.
- **Student Management:** Organize student records.
- **Database Integration:** Store and manage information using MySQL.
- **REST API Backend:** Connect the frontend to backend services.
- **Role-Based Access:** Separate interfaces for different user roles.

## Technologies Used

### Frontend

- React
- Vite
- JavaScript
- HTML
- CSS

### Backend

- Java 21
- Spring Boot 3.5.6
- Maven
- Spring Data JPA
- REST APIs

### Database

- MySQL 8.4

## Project Structure

```text
smart-student-management-system/
├── Backend/
│   └── student-management-system/
│       └── student-management-system/
├── Frontend/
└── .gitignore
```

## Prerequisites

Install the following before running the project:

- Java Development Kit (JDK) 21
- MySQL Server 8.4
- Node.js and npm
- Git

## How to Run

### 1. Configure the Database

Open MySQL and create the database:

```sql
CREATE DATABASE student_management;
```

Configure the database username and password, and provide a secure JWT secret through environment variables. Never publish actual credentials or secrets on GitHub.

### 2. Start the Backend

Open PowerShell and navigate to the backend directory:

```powershell
cd "C:\Student management\Backend\student-management-system\student-management-system"
```

Set the required environment variables in the same PowerShell session, then start the backend:

```powershell
.\mvnw.cmd spring-boot:run
```

The backend runs at `http://localhost:8080`.

### 3. Start the Frontend

Open a second PowerShell window and run:

```powershell
cd "C:\Student management\Frontend"
npm install
npm run dev
```

Open the frontend at `http://localhost:5173`.

## Security Notes

- Keep database passwords and JWT secrets private.
- Use environment variables for sensitive configuration.
- Do not upload `.env` files, database backups, or credentials to GitHub.
- Never share your private credentials publicly.

## Future Enhancements

- Attendance reporting and analytics
- Academic performance reports
- Improved validation and error handling
- Enhanced dashboard visualizations

## Author

Developed as an academic project to demonstrate full-stack web application development using Java, Spring Boot, React, and MySQL.
