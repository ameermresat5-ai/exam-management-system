# Implemented Features, Pages, and Main API Endpoints

## Project Team

- Ameer Mresat
- Mohamed Kharanba

## 1. Overview

The Full Stack Exam Management System supports three user roles:

- Student
- Lecturer
- Administrator

The application provides authentication, exam management, question management, student exam participation, submission management, grading, and result publication.

---

## 2. Authentication and Authorization Features

### Implemented Features

- User registration.
- User login.
- Current authenticated-user lookup.
- JWT token generation.
- JWT token verification.
- bcrypt password hashing.
- Authentication middleware.
- Role-based authorization middleware.
- Protected React routes.
- Automatic JWT attachment using Axios.
- Logout and local-session cleanup.
- Unauthorized-access page.

### Supported Roles

```text
ADMIN
LECTURER
STUDENT
3. Lecturer Features
Exam Management

Lecturers can:

Create an exam.
View their own exams.
View one exam.
Update an exam.
Delete an exam.
Publish an exam.
Close an exam.
Publish exam results.
Exam Statuses
DRAFT
PUBLISHED
CLOSED
RESULTS_PUBLISHED
Question Management

Lecturers can:

Add questions to an exam.
View exam questions.
Update questions.
Delete questions.
Configure question points.
Configure question position.
Add answer options.
Supported Question Types
MULTIPLE_CHOICE
TRUE_FALSE
SHORT_ANSWER
ESSAY
CODE
Submission and Grading

Lecturers can:

View submissions for an exam.
Open a student submission.
Review student answers.
Grade an individual answer.
Add feedback to an answer.
Grade a complete submission.
Add general submission feedback.
Publish exam results.
4. Student Features

Students can:

Register.
Log in.
View available exams.
Start an exam.
View student-safe exam questions.
Automatically save answers.
Submit an exam.
View previous submissions.
View published grades.
View lecturer feedback.

The backend does not expose correct answers to students while they are taking an exam.

5. Administrator Features
Implemented Foundation
Administrator role in PostgreSQL.
Administrator support in backend role middleware.
Administrator access to lecturer-level backend operations.
Protected administrator dashboard route.
Not Fully Implemented
User-management interface.
Role-management interface.
Platform settings.
Audit-log viewer.
Notification-management interface.

The administrator area is currently a foundation and must not be presented as a complete administration system.

6. Frontend Pages
Public Pages
Route	React Component	Purpose
/login	Login	Authenticate an existing user
/register	Register	Register a new account
/unauthorized	Unauthorized	Display an authorization error
/	Redirect	Redirect the visitor to /login
Student Pages
Route	React Component	Purpose
/student/dashboard	StudentDashboard	Student landing page
/student/exams	StudentExams	Display available exams
/student/exams/:id/take	StudentTakeExam	Take an exam
/student/submissions	StudentSubmissions	Display previous submissions
/student/results/:submissionId	StudentResult	Display a published grade and feedback

Student routes require:

STUDENT
Lecturer Pages
Route	React Component	Purpose
/lecturer/dashboard	LecturerDashboard	Lecturer landing page
/lecturer/exams	LecturerExams	Manage lecturer exams
/lecturer/exams/create	CreateExam	Create a new exam
/lecturer/exams/:id/questions	ExamQuestions	Manage exam questions
/lecturer/exams/:id/submissions	ExamSubmissions	View exam submissions
/lecturer/submissions/:id/grade	GradeSubmission	Grade a student submission

Lecturer routes require:

LECTURER
Administrator Page
Route	React Component	Purpose
/admin/dashboard	AdminDashboard	Administrator dashboard starter

Administrator routes require:

ADMIN
7. Main Frontend Components
Layout

Provides the shared page structure and renders child pages through React Router's Outlet.

Navbar

Displays:

Application name.
Role-specific navigation links.
Authenticated-user information.
Current role.
Logout button.
ProtectedRoute

Checks:

Whether authentication is loading.
Whether the user is authenticated.
Whether the user's role is permitted.
AuthContext

Manages:

JWT token.
Current user.
Login.
Registration.
Logout.
Authentication loading state.
Session restoration through /api/auth/me.
Axios API Service

The Axios service:

Uses VITE_API_URL when configured.
Defaults to http://localhost:5000.
Reads the JWT from localStorage.
Adds the Bearer token to protected requests.
8. General Backend Endpoints
Method	Endpoint	Authentication	Purpose
GET	/health	Public	Check backend health
GET	/ready	Public	Check backend readiness
GET	/metrics	Public	Expose Prometheus metrics
GET	/api	Public	Display API status
GET	/api/db-check	Public	Check PostgreSQL connectivity
9. Authentication API

Base path:

/api/auth
Method	Endpoint	Access	Purpose
POST	/api/auth/register	Public	Register a new user
POST	/api/auth/login	Public	Authenticate a user
GET	/api/auth/me	Authenticated	Return the current user
10. Lecturer Exam API

Base path:

/api/exams

Required roles:

LECTURER
ADMIN
Method	Endpoint	Purpose
POST	/api/exams	Create an exam
GET	/api/exams/my	Return exams owned by the lecturer
GET	/api/exams/:id	Return one authorized exam
PUT	/api/exams/:id	Update an exam
DELETE	/api/exams/:id	Delete an exam
PATCH	/api/exams/:id/publish	Publish an exam
PATCH	/api/exams/:id/close	Close an exam
PATCH	/api/exams/:id/publish-results	Publish results
11. Question API

Required roles:

LECTURER
ADMIN
Method	Endpoint	Purpose
POST	/api/exams/:examId/questions	Add a question
GET	/api/exams/:examId/questions	Return exam questions
PUT	/api/questions/:id	Update a question
DELETE	/api/questions/:id	Delete a question
12. Student Exam API

Required role:

STUDENT
Method	Endpoint	Purpose
GET	/api/student/exams/available	Return available exams
POST	/api/student/exams/:examId/start	Start an exam
GET	/api/student/exams/:examId	Return student-safe exam details
GET	/api/submissions/my	Return the student's submissions
PATCH	/api/submissions/:submissionId/auto-save	Save answers automatically
POST	/api/submissions/:submissionId/submit	Submit an exam
GET	/api/submissions/:id/result	Return a published result
13. Grading API

Required roles:

LECTURER
ADMIN
Method	Endpoint	Purpose
GET	/api/exams/:examId/submissions	Return exam submissions
GET	/api/submissions/:id	Return one submission for grading
PATCH	/api/answers/:answerId/grade	Grade one answer
PATCH	/api/submissions/:id/grade	Grade the complete submission
14. Protected API Request Flow
React Page
    |
    v
Axios API Service
    |
    | HTTP + JSON + JWT
    v
Express Route
    |
    v
Authentication Middleware
    |
    v
Role Middleware
    |
    v
Controller
    |
    v
Joi Validator
    |
    v
Service
    |
    v
PostgreSQL
    |
    v
JSON Response
---

## 15. Security and Platform Features

- Helmet security headers.
- Configurable CORS.
- API rate limiting.
- JSON request parsing.
- Morgan HTTP logging.
- Centralized not-found handling.
- Centralized error handling.
- Graceful server shutdown.
- Prometheus metrics.
- Environment-based configuration.
- Kubernetes Secret references.
- Local secrets excluded from Git.

---

## 16. DevOps Features

### Docker

- Backend Dockerfile.
- Multi-stage frontend Dockerfile.
- Nginx frontend runtime.
- Docker image build workflow.

### Kubernetes

- Namespace.
- PostgreSQL deployment.
- Backend Deployment and Service.
- Frontend Deployment and Service.
- ConfigMap.
- Secret examples.
- Ingress.
- Prometheus.
- Grafana.

### Terraform

- Google Cloud Terraform foundation.
- Required Google Cloud APIs.
- AWS EKS Terraform demonstration.
- Terraform formatting and validation.

### GitHub Actions

- Backend dependency installation and available checks.
- Frontend production build.
- Docker image builds.
- Terraform validation.

---

## 17. Functionality Not Yet Production-Ready

The following items are not yet complete:

- Public Google Cloud deployment.
- Public frontend URL.
- Public backend API URL.
- Complete administrator management.
- Automated production deployment.
- Complete backend unit-test suite.
- Complete frontend unit-test suite.
- Managed production secrets.
- Complete notification interface.
- Complete audit-log interface.
