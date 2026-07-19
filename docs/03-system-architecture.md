# General System Architecture

## Project Team

- Ameer Mresat
- Mohamed Kharanba

## 1. Architecture Overview

The Full Stack Exam Management System uses a layered Client–Server–Database architecture.

The system consists of the following main layers:

1. Client layer.
2. Server layer.
3. Business-services layer.
4. Database layer.
5. Monitoring layer.
6. DevOps and deployment layer.

The React frontend does not communicate directly with PostgreSQL. Every database operation passes through the Express backend API.

---

## 2. Client Layer

The client is a React and Vite single-page application that runs in the user's web browser.

The client is responsible for:

- Displaying pages and forms.
- Managing frontend navigation.
- Managing the authenticated-user state.
- Protecting pages according to the user's role.
- Sending API requests using Axios.
- Displaying API responses and errors.
- Storing the JWT and basic user information in browser `localStorage`.

The main client technologies are:

- React.
- Vite.
- React Router.
- Axios.
- React Context.

The frontend communicates with the backend using HTTP requests and JSON data.

Protected requests contain:

```text
Authorization: Bearer <JWT>
```

---

## 3. Server Layer

The server is a Node.js and Express REST API.

The server is responsible for:

- Receiving frontend HTTP requests.
- Applying security middleware.
- Authenticating JWT tokens.
- Checking user roles and permissions.
- Validating request data.
- Applying application business rules.
- Communicating with PostgreSQL.
- Returning JSON responses.
- Handling application errors.
- Producing HTTP logs.
- Exposing health and monitoring endpoints.

The main backend request flow is:

```text
Express Route
      |
      v
Authentication Middleware
      |
      v
Role Authorization Middleware
      |
      v
Controller
      |
      v
Joi Validator
      |
      v
Business Service
      |
      v
PostgreSQL Database
```

---

## 4. Business-Services Layer

The business-services layer contains the main application logic.

| Service | Responsibility |
| --- | --- |
| Authentication Service | Registration, login, password verification, and JWT creation |
| Exam Service | Exam creation, update, deletion, publication, closing, and result publication |
| Question Service | Question and answer-option management |
| Student Exam Service | Available exams, exam sessions, auto-save, and submission |
| Grading Service | Answer grading, submission grading, scores, and feedback |

Controllers are responsible for HTTP requests and responses.

Services are responsible for business rules and database operations.

This separation keeps the backend code organized and easier to maintain.

---

## 5. Database Layer

The system uses PostgreSQL for persistent data storage.

The backend communicates with PostgreSQL through the Node.js `pg` package and a database connection pool.

The database stores:

| Table | Stored Information |
| --- | --- |
| `users` | User accounts, email, password hash, role, and active status |
| `exams` | Exam title, owner, schedule, duration, and status |
| `questions` | Question text, type, points, position, and correct answer |
| `question_options` | Selectable options for multiple-choice and true/false questions |
| `exam_sessions` | Student session start, expiration, and end times |
| `submissions` | Exam attempts, status, total score, grader, and feedback |
| `answers` | Student answers, selected options, scores, and feedback |
| `notifications` | Notification messages for users |
| `audit_logs` | User activity and security records |

The database stores bcrypt password hashes. It never stores plain-text passwords.

---

## 6. Authentication Data Flow

The login process works as follows:

1. The user enters an email and password on the React login page.
2. React sends a `POST /api/auth/login` request.
3. Express receives the request.
4. Joi validates the email and password.
5. The authentication service searches for the user in PostgreSQL.
6. bcrypt compares the submitted password with the stored password hash.
7. The backend creates a signed JWT.
8. The backend returns the JWT and basic user information.
9. The frontend stores the JWT in `localStorage`.
10. Axios attaches the JWT to future protected requests.
11. Authentication middleware verifies the JWT on the backend.
12. Role middleware checks whether the user is permitted to perform the operation.

---

## 7. Lecturer Exam Data Flow

When a lecturer creates an exam:

1. The lecturer completes the create-exam form.
2. React sends a `POST /api/exams` request.
3. Axios attaches the JWT.
4. Authentication middleware verifies the token.
5. Role middleware verifies the `LECTURER` or `ADMIN` role.
6. The exam controller receives the request.
7. Joi validates the exam data.
8. The exam service applies the business rules.
9. The exam service sends an SQL query to PostgreSQL.
10. PostgreSQL creates and returns the exam record.
11. Express returns the created exam as JSON.
12. React updates the lecturer interface.

---

## 8. Student Exam Data Flow

When a student takes an exam:

1. React requests the available exams.
2. The backend returns published exams that are available to the student.
3. The student selects and starts an exam.
4. The backend creates an exam session.
5. The backend creates an `IN_PROGRESS` submission.
6. The frontend receives student-safe exam questions.
7. Correct answers and correct-option values are not returned.
8. React sends answers to the auto-save endpoint.
9. The backend inserts or updates the answers in PostgreSQL.
10. The student submits the exam.
11. The backend changes the submission status to `SUBMITTED`.
12. The lecturer later grades the answers and submission.
13. After results are published, the student can view the grade and feedback.

---

## 9. Monitoring Layer

The backend exposes the following operational endpoints:

```text
GET /health
GET /ready
GET /metrics
GET /api/db-check
```

### Health

`GET /health` confirms that the backend process is running.

### Readiness

`GET /ready` provides the backend readiness response.

### Database Check

`GET /api/db-check` verifies PostgreSQL connectivity.

### Metrics

`GET /metrics` exposes Prometheus-compatible metrics.

Prometheus collects metrics from:

```text
backend-service:5000/metrics
```

Grafana is used as the monitoring and visualization layer.

The backend also uses Morgan for HTTP request logging.

---

## 10. DevOps and Deployment Layer

The project includes:

- Backend Dockerfile.
- Frontend multi-stage Dockerfile.
- Nginx frontend runtime.
- Kubernetes namespace.
- PostgreSQL Kubernetes configuration.
- Backend Deployment and Service.
- Frontend Deployment and Service.
- Kubernetes ConfigMap.
- Kubernetes Secret references.
- Prometheus and Grafana manifests.
- GitHub Actions workflows.
- Terraform Google Cloud foundation.
- Terraform AWS EKS demonstration.

The selected final cloud platform is Google Cloud.

The planned production flow is:

```text
GitHub Repository
        |
        v
GitHub Actions
        |
        v
Artifact Registry
        |
        v
Google Kubernetes Engine
        |
        +-- React Frontend
        +-- Express Backend
        +-- Prometheus
        +-- Grafana
        |
        v
Managed PostgreSQL Database
```

The public Google Cloud deployment is not yet complete.

---

## 11. Component Communication

| Source | Destination | Communication |
| --- | --- | --- |
| User | React frontend | Browser interaction |
| React frontend | Express backend | HTTP, JSON, and JWT |
| Express routes | Middleware | Internal function calls |
| Authentication middleware | Role middleware | Authenticated request |
| Role middleware | Controllers | Authorized request |
| Controllers | Validators | Request-data validation |
| Controllers | Services | Business-operation calls |
| Services | PostgreSQL | SQL through the `pg` package |
| PostgreSQL | Services | Query results |
| Express backend | React frontend | JSON response |
| Prometheus | Express backend | Metrics scraping |
| Grafana | Prometheus | Metrics visualization |
| GitHub Actions | Docker | Image build and validation |
| Terraform | Google Cloud | Infrastructure configuration |

---

## 12. Storage Responsibilities

### Browser Storage

The browser currently stores:

- JWT token.
- Basic authenticated-user information.

### Backend Memory

The backend temporarily processes:

- HTTP requests.
- Validated request data.
- Authentication information.
- Database query results.

### PostgreSQL Storage

PostgreSQL permanently stores:

- Users.
- Exams.
- Questions.
- Options.
- Sessions.
- Submissions.
- Answers.
- Notifications.
- Audit logs.

### Kubernetes Configuration

Kubernetes stores deployment configuration using:

- Deployments.
- Services.
- ConfigMaps.
- Secrets.
- Ingress resources.

Real secret values must not be committed to Git.

---

## 13. Architecture Security Rules

- The frontend cannot access PostgreSQL directly.
- Passwords are stored only as bcrypt hashes.
- Protected API requests require a valid JWT.
- Backend role middleware protects restricted operations.
- Student APIs must not expose correct answers.
- Request data is validated before business operations.
- Real `.env` files must not be committed.
- Real Kubernetes Secret files must not be committed.
- Production traffic should use HTTPS.
- Production secrets should use a managed secret service.

---

## 14. General Architecture Diagram

The editable architecture diagram will be stored in:

```text
docs/diagrams/system-architecture.mmd
```

The final submission will also contain a rendered PNG or SVG version.

The final diagram should have:

- A white background.
- Clear UML-style boxes.
- English labels.
- Visible arrows.
- Clearly separated system layers.
- No overlapping elements.