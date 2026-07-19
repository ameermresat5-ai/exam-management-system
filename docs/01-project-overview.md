# Project Overview

## 1. Project Information

| Item | Value |
| --- | --- |
| Project name | Full Stack Exam Management System |
| Project type | Full-stack web application and DevSecOps final project |
| Project team | Ameer Mresat and Mohamed Kharanba |
| GitHub repository | https://github.com/ameermresat5-ai/exam-management-system |
| Production deployment | Pending completion of the Google Cloud deployment |
| Main documentation | Root `README.md` and the files under `docs/` |

## 2. Project Description

The Full Stack Exam Management System is a web application for creating, managing, taking, grading, and publishing online exams.

The system contains three main application layers:

1. A React frontend used by students, lecturers, and administrators.
2. A Node.js and Express REST API that handles authentication and business logic.
3. A PostgreSQL database that stores the application data.

The project also includes DevSecOps components:

- Docker images for the frontend and backend.
- Kubernetes manifests for Minikube.
- Prometheus metrics and Grafana monitoring.
- GitHub Actions workflows.
- Terraform templates for AWS EKS.
- A Google Cloud Terraform foundation for the planned GKE deployment.

## 3. Problem the Project Solves

Traditional exam management may require lecturers to create exams, collect answers, grade submissions, and publish results through separate tools or manual processes.

This project combines these activities into one role-based system.

Lecturers can:

- Create and manage exams.
- Add and edit questions.
- Publish and close exams.
- Review student submissions.
- Grade individual answers.
- Grade complete submissions.
- Publish results.

Students can:

- Register and log in.
- View available exams.
- Start an exam.
- Save answers automatically.
- Submit an exam.
- Review their submissions.
- View grades and feedback after result publication.

Administrators currently have:

- Authentication and authorization support.
- A protected administrator dashboard.
- A foundation for future management functionality.

## 4. User Roles

### 4.1 Student

The student role represents an exam participant.

Students can access only student pages and student API operations. They cannot create exams, manage questions, grade submissions, or access lecturer information.

### 4.2 Lecturer

The lecturer role represents the exam creator and grader.

Lecturers can manage their exams and questions. They can also review and grade submissions that belong to their exams.

### 4.3 Administrator

The administrator role is included in the backend authorization system.

Administrators can access lecturer-level backend operations. The current frontend includes an administrator dashboard starter, but complete platform administration is not yet implemented.

## 5. General Architecture

    User Browser
         |
         | React pages and components
         v
    React + Vite Frontend
         |
         | HTTP requests using Axios
         | JSON request and response bodies
         | Bearer JWT authentication
         v
    Node.js + Express REST API
         |
         | Controllers
         | Services
         | Validators
         | Authentication middleware
         | Role middleware
         v
    PostgreSQL Database

## 6. Data Flow

A typical request follows these steps:

1. The user performs an action in a React page.
2. The frontend sends a request through the Axios API service.
3. The Axios interceptor adds the JWT token when one exists.
4. Express receives the request.
5. Security, logging, JSON parsing, and rate-limiting middleware process it.
6. Authentication middleware validates the JWT.
7. Role middleware checks the user's permission.
8. The route forwards the request to a controller.
9. The controller validates the input and calls a service.
10. The service applies business rules and runs PostgreSQL queries.
11. PostgreSQL returns the requested data.
12. The backend sends a JSON response.
13. React updates the page shown to the user.

## 7. Data Storage

### Users

Users are stored in the PostgreSQL `users` table.

The table stores:

- User ID.
- Full name.
- Unique email.
- Password hash.
- User role.
- Active status.
- Creation and update timestamps.

Passwords are hashed with bcrypt. Plain-text passwords are not stored.

### Authentication Session

After registration or login, the backend generates a signed JWT.

The frontend stores:

- The JWT token in browser `localStorage`.
- Basic authenticated-user information in browser `localStorage`.

The token is added to protected requests using the `Authorization` header.

### Exams and Questions

Exam content is stored in:

- `exams`
- `questions`
- `question_options`

Each exam belongs to a lecturer. Questions belong to an exam. Answer options belong to a question.

### Student Activity

Student exam activity is stored in:

- `exam_sessions`
- `submissions`
- `answers`

An exam session records when the student starts an exam. A submission represents the overall attempt. Individual answers are stored separately.

### Additional Data

The schema also contains:

- `notifications`
- `audit_logs`

These tables provide a foundation for notifications and security or activity auditing.

## 8. Main Technologies

| Layer | Technologies |
| --- | --- |
| Frontend | React 18, Vite, React Router, Axios |
| Backend | Node.js 18, Express 5 |
| Database | PostgreSQL 16 |
| Database client | `pg` |
| Authentication | JSON Web Token |
| Password security | bcrypt |
| Request validation | Joi |
| Security middleware | Helmet, CORS, express-rate-limit |
| HTTP logging | Morgan |
| Metrics | prom-client and Prometheus |
| Monitoring | Prometheus and Grafana |
| Containers | Docker |
| Orchestration | Kubernetes and Minikube |
| Infrastructure as Code | Terraform |
| Automation | GitHub Actions |

## 9. Security Design

The project includes:

- bcrypt password hashing.
- JWT authentication.
- Role-based authorization.
- Protected React routes.
- Joi request validation.
- Helmet security headers.
- Configurable CORS.
- API rate limiting.
- Centralized error handling.
- Environment-based configuration.
- Kubernetes Secret templates.
- Local secret files excluded through `.gitignore`.

## 10. Deployment Status

### Local Development

The application can run locally using:

- Node.js for the backend.
- Vite for the frontend.
- PostgreSQL for the database.

### Local Kubernetes

The Kubernetes manifests include:

- Project namespace.
- PostgreSQL deployment.
- Backend deployment and service.
- Frontend deployment and service.
- Ingress.
- Prometheus.
- Grafana.

### Google Cloud

A Google Cloud Terraform foundation exists.

At the current documentation stage:

- The Google Cloud project is configured.
- Required Google Cloud API configuration exists.
- Terraform provider, variable, and output files exist.
- The final GKE cluster and public application deployment are not complete.
- The deployment URL will be added after successful verification.

### AWS

The AWS EKS Terraform files are retained as an Infrastructure as Code demonstration.

AWS is not the selected final deployment environment. Running `terraform apply` may create paid infrastructure.

## 11. Implemented Scope

- PostgreSQL schema and seed data.
- JWT registration and login.
- Role-based backend authorization.
- Lecturer exam-management APIs.
- Question-management APIs.
- Student exam and submission APIs.
- Automatic answer saving.
- Lecturer grading APIs.
- Result publication.
- React authentication pages.
- Student pages.
- Lecturer pages.
- Administrator dashboard starter.
- Dockerfiles.
- Kubernetes manifests.
- Prometheus metrics.
- Prometheus and Grafana manifests.
- Terraform infrastructure templates.
- GitHub Actions workflows.
- Secret-management improvements.

## 12. Remaining Work

- Complete the Google Cloud infrastructure.
- Build and publish production Docker images.
- Configure the production PostgreSQL database.
- Deploy the application to GKE.
- Verify public frontend and backend URLs.
- Add the deployment URL to the README.
- Add project screenshots.
- Add automated backend and frontend tests.
- Complete the remaining architecture and UML diagrams.
- Perform final end-to-end testing.

## 13. Documentation Files

| File | Purpose |
| --- | --- |
| `01-project-overview.md` | Project purpose, roles, technologies, and status |
| `02-features-and-api.md` | Features, frontend pages, and API endpoints |
| `03-system-architecture.md` | General Client–Server–Database architecture |
| `04-client-architecture.md` | React architecture and component hierarchy |
| `05-server-architecture.md` | Express architecture and backend packages |
| `06-database-design.md` | Database tables, relationships, and ERD |
| `07-json-models.md` | Main JSON request and response models |
| `08-oop-uml.md` | Domain and OOP UML diagram |
| `09-sequence-diagrams.md` | Main application scenarios |
| `10-milestones-and-branches.md` | Semester progress and Git branch structure |
| `11-devops-and-deployment.md` | Docker, Kubernetes, Terraform, and CI/CD |
| `12-testing-logging-monitoring.md` | Testing, logging, metrics, and monitoring |
| `SUBMISSION_CHECKLIST.md` | Final submission checklist |
