# Implemented Features, Pages, and API Endpoints

## 1. Purpose

This document describes the functionality represented in the current project source code.

It separates:

- Implemented functionality.
- Starter or foundation functionality.
- Functionality that remains before final deployment.

## 2. Authentication and Authorization

### Implemented

- User registration.
- User login.
- Current-user lookup.
- JWT generation and verification.
- bcrypt password hashing.
- Authentication middleware.
- Role-based authorization middleware.
- Protected React routes.
- Automatic JWT attachment using an Axios interceptor.
- Logout and local-session cleanup.
- Unauthorized-access page.

### Roles

- `ADMIN`
- `LECTURER`
- `STUDENT`

## 3. Lecturer Features

### Exam Management

Lecturers can:

- Create an exam.
- View their own exams.
- View one exam.
- Update an exam.
- Delete an exam.
- Publish an exam.
- Close an exam.
- Publish exam results.

Supported exam states:

- `DRAFT`
- `PUBLISHED`
- `CLOSED`
- `RESULTS_PUBLISHED`

### Question Management

Lecturers can:

- Add a question to an exam.
- View questions belonging to an exam.
- Update a question.
- Delete a question.
- Configure question points.
- Configure question order.
- Add answer options.

Supported question types:

- `MULTIPLE_CHOICE`
- `TRUE_FALSE`
- `SHORT_ANSWER`
- `ESSAY`
- `CODE`

### Submission and Grading Management

Lecturers can:

- View submissions for an exam.
- Open one submission for grading.
- Grade an individual answer.
- Add answer feedback.
- Grade a complete submission.
- Add overall feedback.
- Publish results.

## 4. Student Features

Students can:

- Register and log in.
- View available exams.
- Start an exam.
- View exam questions.
- Automatically save answers.
- Submit an exam.
- View previous submissions.
- View a result after result publication.
- View scores and feedback when permitted.

Student endpoints are protected with the `STUDENT` role.

## 5. Administrator Features

### Implemented Foundation

- Administrator role in PostgreSQL.
- Administrator support in role middleware.
- Administrator access to lecturer-level backend operations.
- Protected administrator dashboard route.

### Not Fully Implemented

- User-management pages.
- Role-management pages.
- System configuration pages.
- Audit-log interface.
- Notification administration.

The administrator functionality must be presented as a starter or foundation, not as a completed management system.

## 6. Security and Platform Features

- Helmet security headers.
- Configurable CORS.
- API rate limiting.
- JSON request parsing.
- Centralized not-found handling.
- Centralized error handling.
- Morgan HTTP logging.
- Health endpoint.
- Readiness endpoint.
- Database-connectivity endpoint.
- Prometheus metrics endpoint.
- Graceful server shutdown.
- Environment-based configuration.
- Kubernetes Secret references.
- Local secrets excluded from Git.

## 7. Frontend Pages

### Public Pages

| Route | Component | Purpose |
| --- | --- | --- |
| `/login` | `Login` | Authenticate an existing user |
| `/register` | `Register` | Create a new account |
| `/unauthorized` | `Unauthorized` | Display a permission error |
| `/` | Redirect | Redirect to `/login` |

### Student Pages

| Route | Component | Purpose |
| --- | --- | --- |
| `/student/dashboard` | `StudentDashboard` | Student landing page |
| `/student/exams` | `StudentExams` | Display available exams |
| `/student/exams/:id/take` | `StudentTakeExam` | Start and complete an exam |
| `/student/submissions` | `StudentSubmissions` | Display the student's submissions |
| `/student/results/:submissionId` | `StudentResult` | Display a grade and feedback |

Student routes require:

    roles = ["STUDENT"]

### Lecturer Pages

| Route | Component | Purpose |
| --- | --- | --- |
| `/lecturer/dashboard` | `LecturerDashboard` | Lecturer landing page |
| `/lecturer/exams` | `LecturerExams` | Display and manage exams |
| `/lecturer/exams/create` | `CreateExam` | Create a new exam |
| `/lecturer/exams/:id/questions` | `ExamQuestions` | Manage exam questions |
| `/lecturer/exams/:id/submissions` | `ExamSubmissions` | Review exam submissions |
| `/lecturer/submissions/:id/grade` | `GradeSubmission` | Grade a submission |

Lecturer routes require:

    roles = ["LECTURER"]

### Administrator Page

| Route | Component | Purpose |
| --- | --- | --- |
| `/admin/dashboard` | `AdminDashboard` | Administrator dashboard starter |

Administrator routes require:

    roles = ["ADMIN"]

## 8. Main Frontend Components

### Layout

`Layout` provides the shared application shell and renders pages using React Router's `Outlet`.

### Navbar

`Navbar` displays:

- Application branding.
- Links based on the user's role.
- Current user information.
- Current role.
- Logout button.

### ProtectedRoute

`ProtectedRoute` checks:

1. Whether authentication is still loading.
2. Whether the user is authenticated.
3. Whether the user's role is permitted.

Unauthenticated users are redirected to `/login`. Users with the wrong role are redirected to `/unauthorized`.

### AuthContext

`AuthContext` manages:

- JWT token.
- Current user.
- Authentication loading state.
- Login.
- Registration.
- Logout.
- Session restoration using `/api/auth/me`.

### Axios API Service

The shared Axios service:

- Uses `VITE_API_URL` when provided.
- Defaults to `http://localhost:5000`.
- Reads the JWT from `localStorage`.
- Adds `Authorization: Bearer <token>` to protected requests.

## 9. General Backend Endpoints

| Method | Endpoint | Authentication | Purpose |
| --- | --- | --- | --- |
| `GET` | `/health` | Public | Backend health check |
| `GET` | `/ready` | Public | Backend readiness check |
| `GET` | `/metrics` | Public | Prometheus metrics |
| `GET` | `/api` | Public | API status |
| `GET` | `/api/db-check` | Public | PostgreSQL connectivity check |

## 10. Authentication API

Base path: `/api/auth`

| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| `POST` | `/api/auth/register` | Public | Register a user and return a JWT |
| `POST` | `/api/auth/login` | Public | Authenticate and return a JWT |
| `GET` | `/api/auth/me` | Authenticated | Return the current user |

## 11. Lecturer Exam API

Base path: `/api/exams`

Required roles:

- `LECTURER`
- `ADMIN`

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/api/exams` | Create an exam |
| `GET` | `/api/exams/my` | Return exams owned by the lecturer |
| `GET` | `/api/exams/:id` | Return one authorized exam |
| `PUT` | `/api/exams/:id` | Update an exam |
| `DELETE` | `/api/exams/:id` | Delete an exam |
| `PATCH` | `/api/exams/:id/publish` | Publish an exam |
| `PATCH` | `/api/exams/:id/close` | Close an exam |
| `PATCH` | `/api/exams/:id/publish-results` | Publish exam results |

## 12. Question API

Required roles:

- `LECTURER`
- `ADMIN`

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/api/exams/:examId/questions` | Add a question |
| `GET` | `/api/exams/:examId/questions` | Return exam questions |
| `PUT` | `/api/questions/:id` | Update a question |
| `DELETE` | `/api/questions/:id` | Delete a question |

## 13. Student Exam API

Required role:

- `STUDENT`

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/student/exams/available` | Return available exams |
| `POST` | `/api/student/exams/:examId/start` | Start an exam |
| `GET` | `/api/student/exams/:examId` | Return student-safe exam details |
| `GET` | `/api/submissions/my` | Return the student's submissions |
| `PATCH` | `/api/submissions/:submissionId/auto-save` | Save answers |
| `POST` | `/api/submissions/:submissionId/submit` | Submit an exam |
| `GET` | `/api/submissions/:id/result` | Return a published result |

## 14. Grading API

Required roles:

- `LECTURER`
- `ADMIN`

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/exams/:examId/submissions` | Return exam submissions |
| `GET` | `/api/submissions/:id` | Return one submission for grading |
| `PATCH` | `/api/answers/:answerId/grade` | Grade one answer |
| `PATCH` | `/api/submissions/:id/grade` | Grade the complete submission |

## 15. Protected Request Flow

    HTTP Request
         |
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

## 16. Main Database Tables

| Table | Purpose |
| --- | --- |
| `users` | Authentication and role data |
| `exams` | Exam definition and status |
| `questions` | Exam questions |
| `question_options` | Selectable answer options |
| `exam_sessions` | Student exam sessions |
| `submissions` | Overall student attempts |
| `answers` | Individual answers and grades |
| `notifications` | Notification foundation |
| `audit_logs` | Activity and security-audit foundation |

## 17. DevOps Features

### Docker

- Backend Dockerfile.
- Multi-stage frontend Dockerfile.
- Nginx frontend runtime.
- Docker build validation using GitHub Actions.

### Kubernetes

- Namespace.
- PostgreSQL deployment.
- Backend ConfigMap.
- Backend Deployment and Service.
- Frontend Deployment and Service.
- Ingress.
- Kubernetes Secret examples.
- Prometheus.
- Grafana.

### Terraform

- AWS EKS infrastructure template.
- Google Cloud provider foundation.
- Google Cloud required-API configuration.
- Terraform formatting and validation workflow.

### GitHub Actions

- Backend dependency installation and available checks.
- Frontend production build.
- Docker image build checks.
- Terraform formatting and validation.

## 18. Features Not Yet Production-Ready

The following must not be described as complete:

- Public Google Cloud deployment.
- Public deployment URL.
- Complete administrator management.
- Automated unit-test suite.
- Automatic deployment from GitHub Actions.
- Production managed-PostgreSQL configuration.
- Production Secret Manager integration.
- Complete notification interface.
- Complete audit-log interface.
