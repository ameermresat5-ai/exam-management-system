# Project Milestones and Git Branch Structure

## Project Team

- Ameer Mresat
- Mohamed Kharanba

## 1. Overview

This document describes the main development milestones of the Full Stack Exam Management System and the Git workflow used to manage the source code.

The project was developed incrementally.

Each stage added a new architectural layer or application capability:

1. Project foundation.
2. Backend server.
3. PostgreSQL database.
4. Authentication and authorization.
5. Lecturer exam management.
6. Question management.
7. Student exam participation.
8. Submission and grading workflows.
9. React frontend.
10. Docker and Kubernetes.
11. Monitoring and infrastructure.
12. CI/CD foundations.
13. Final documentation and submission preparation.

The project repository is:

```text
https://github.com/ameermresat5-ai/exam-management-system
```

---

## 2. Development Approach

The project follows an incremental development approach.

Instead of implementing the complete system in one operation, the work was divided into smaller milestones.

Each milestone normally included:

```text
Plan
  |
  v
Implementation
  |
  v
Local Verification
  |
  v
Git Status Check
  |
  v
Commit
  |
  v
Push to GitHub
```

This approach provides:

- Easier debugging.
- Smaller and understandable commits.
- Better project history.
- Safer experimentation.
- Easier recovery from mistakes.
- Clear documentation of progress.
- Better support for team collaboration.

---

## 3. Main Project Milestones

| Milestone | Main Result | Status |
| --- | --- | --- |
| 1. Repository foundation | Project structure, Git configuration, environment templates | Complete |
| 2. Express backend | Running Node.js and Express API | Complete |
| 3. PostgreSQL database | Schema, enums, tables, relationships, and seed data | Complete |
| 4. Database connectivity | Backend connected to PostgreSQL | Complete |
| 5. Authentication | Registration, login, JWT, password hashing | Complete |
| 6. Authorization | Student, lecturer, and administrator roles | Complete |
| 7. Lecturer exam API | Create, read, update, delete, publish, and close exams | Complete |
| 8. Question API | Add, read, update, and delete questions and options | Complete |
| 9. Student exam API | Available exams, exam start, auto-save, and submission | Complete |
| 10. Grading API | Submission review, answer grading, submission grading | Complete |
| 11. React frontend | Public and role-protected pages | Complete |
| 12. Docker | Backend and frontend container definitions | Complete |
| 13. Kubernetes | Application, PostgreSQL, monitoring, and Ingress manifests | Configuration complete |
| 14. Monitoring | Prometheus metrics and Grafana foundation | Configuration complete |
| 15. Terraform | AWS example and Google Cloud infrastructure foundation | Foundation complete |
| 16. GitHub Actions | Code checks, builds, image builds, Terraform validation | Foundation complete |
| 17. Public cloud deployment | Public frontend and backend URLs | Not yet complete |
| 18. Final documentation | Architecture, APIs, database, UML, scenarios, and screenshots | In progress |

---

# Milestone 1 — Repository and Project Foundation

## 4. Goal

The first milestone created the basic project repository and folder structure.

### Main Work

- Created the Git repository.
- Added a root `README.md`.
- Added `.gitignore`.
- Added environment-variable examples.
- Created backend, frontend, database, Kubernetes, Terraform, monitoring, and documentation folders.
- Renamed the default branch to `main`.
- Connected the local repository to GitHub.

### Important Result

The project received a stable structure before application features were developed.

### Confirmed Initial Commit

```text
c0d9c0b Initial project structure
```

### Main Files

```text
README.md
.gitignore
backend/
frontend/
database/
k8s/
terraform/
monitoring/
docs/
```

### Status

```text
COMPLETE
```

---

# Milestone 2 — Express Backend Foundation

## 5. Goal

The second milestone created a working Node.js and Express backend.

### Main Work

- Initialized the backend `package.json`.
- Installed backend packages.
- Created the Express application.
- Created the HTTP server.
- Added environment configuration.
- Added middleware.
- Added basic routes.
- Added centralized error handling.
- Added development scripts.

### Important Packages

```text
express
cors
helmet
morgan
dotenv
pg
jsonwebtoken
bcryptjs
joi
express-rate-limit
prom-client
socket.io
nodemon
```

### Main Endpoints

```text
GET /health
GET /ready
GET /api
```

### Confirmed Commit

```text
d86897d Create backend Express starter
```

### Status

```text
COMPLETE
```

---

# Milestone 3 — PostgreSQL Database Schema

## 6. Goal

The third milestone created the relational database model.

### Main Work

- Installed and configured PostgreSQL.
- Created the `exam_management` database.
- Enabled `pgcrypto`.
- Created enum types.
- Created the main tables.
- Created primary and foreign keys.
- Created unique and check constraints.
- Created indexes.
- Created timestamp triggers.
- Created seed data.

### Main Tables

```text
users
exams
questions
question_options
exam_sessions
submissions
answers
notifications
audit_logs
```

### Main Enum Values

```text
ADMIN
LECTURER
STUDENT
```

```text
DRAFT
PUBLISHED
CLOSED
RESULTS_PUBLISHED
```

```text
MULTIPLE_CHOICE
TRUE_FALSE
SHORT_ANSWER
ESSAY
CODE
```

```text
IN_PROGRESS
SUBMITTED
GRADED
```

### Confirmed Commits

```text
63e57e0
6fdd7f0
```

These commits added and improved the database schema and seed data.

### Verification

```bash
npm run db:init
npm run db:seed
```

### Status

```text
COMPLETE
```

---

# Milestone 4 — Backend Database Connectivity

## 7. Goal

The fourth milestone connected the Express backend to PostgreSQL.

### Main Work

- Added the PostgreSQL `pg` package.
- Created a shared connection pool.
- Added `DATABASE_URL`.
- Added database connectivity handling.
- Added a database-check endpoint.
- Tested SQL queries from the backend.

### Main Endpoint

```text
GET /api/db-check
```

### Expected Result

```json
{
  "database": "connected"
}
```

### Confirmed Commit

```text
d72949c
```

### Status

```text
COMPLETE
```

---

# Milestone 5 — Authentication and Authorization

## 8. Goal

The fifth milestone implemented secure user registration, login, and access control.

### Main Work

- Created registration logic.
- Created login logic.
- Added bcrypt password hashing.
- Added password verification.
- Created JWT tokens.
- Added JWT verification middleware.
- Added role authorization middleware.
- Added the current-user endpoint.
- Added student, lecturer, and administrator roles.
- Added protected frontend routes.

### Main Endpoints

```text
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

### Authentication Flow

```text
Email and Password
        |
        v
Authentication Controller
        |
        v
Authentication Service
        |
        +-- User lookup
        |
        +-- bcrypt comparison
        |
        v
JWT Generation
        |
        v
Frontend Session
```

### Confirmed Commit

```text
3276391
```

### Status

```text
COMPLETE
```

---

# Milestone 6 — Lecturer Exam Management

## 9. Goal

The sixth milestone allowed lecturers to create and manage exams.

### Main Work

- Created exam routes.
- Created exam controllers.
- Created exam validation.
- Created exam services.
- Added lecturer ownership checks.
- Added exam status transitions.
- Added administrator access to authorized operations.

### Main Operations

```text
Create exam
View lecturer exams
View one exam
Update exam
Delete exam
Publish exam
Close exam
Publish results
```

### Main Endpoints

```text
POST   /api/exams
GET    /api/exams/my
GET    /api/exams/:id
PUT    /api/exams/:id
DELETE /api/exams/:id
PATCH  /api/exams/:id/publish
PATCH  /api/exams/:id/close
PATCH  /api/exams/:id/publish-results
```

### Status

```text
COMPLETE
```

---

# Milestone 7 — Question Management

## 10. Goal

The seventh milestone allowed lecturers to manage exam questions and answer options.

### Main Work

- Added question routes.
- Added question controllers.
- Added question validation.
- Added question services.
- Added option creation.
- Added question ordering.
- Added exam ownership checks.
- Added transaction support for related inserts.

### Supported Types

```text
MULTIPLE_CHOICE
TRUE_FALSE
SHORT_ANSWER
ESSAY
CODE
```

### Main Endpoints

```text
POST   /api/exams/:examId/questions
GET    /api/exams/:examId/questions
PUT    /api/questions/:id
DELETE /api/questions/:id
```

### Verified Example

A multiple-choice question was created with:

```text
Exam ID:
1dd6ad9c-3823-434a-93a7-4a122e1d8dc2

Question ID:
40a6c8e1-83cc-420e-9278-ea778282cbc1

Points:
10

Position:
1
```

### Status

```text
COMPLETE
```

---

# Milestone 8 — Student Exam Participation

## 11. Goal

The eighth milestone implemented the main student exam workflow.

### Main Work

- Displayed available exams.
- Added exam availability checks.
- Created exam sessions.
- Created student submissions.
- Returned student-safe questions.
- Added automatic answer saving.
- Added final exam submission.
- Added submission history.
- Added result retrieval.

### Main Endpoints

```text
GET   /api/student/exams/available
POST  /api/student/exams/:examId/start
GET   /api/student/exams/:examId
GET   /api/submissions/my
PATCH /api/submissions/:submissionId/auto-save
POST  /api/submissions/:submissionId/submit
GET   /api/submissions/:id/result
```

### Security Requirement

The student response excludes:

```text
correctAnswer
isCorrect
```

### Submission Lifecycle

```text
IN_PROGRESS
      |
      v
SUBMITTED
      |
      v
GRADED
```

### Status

```text
COMPLETE
```

---

# Milestone 9 — Lecturer Grading

## 12. Goal

The ninth milestone implemented submission review and grading.

### Main Work

- Added exam submission lists.
- Added individual submission details.
- Added answer grading.
- Added answer feedback.
- Added complete submission grading.
- Added general feedback.
- Added grader information.
- Added result publication checks.

### Main Endpoints

```text
GET   /api/exams/:examId/submissions
GET   /api/submissions/:id
PATCH /api/answers/:answerId/grade
PATCH /api/submissions/:id/grade
```

### Main Status Change

```text
SUBMITTED → GRADED
```

### Status

```text
COMPLETE
```

---

# Milestone 10 — React Frontend

## 13. Goal

The tenth milestone created the user interface for all main roles.

### Main Work

- Created the Vite React application.
- Added React Router.
- Added Axios.
- Added authentication context.
- Added protected routes.
- Added shared layout and navigation.
- Created public pages.
- Created student pages.
- Created lecturer pages.
- Created the administrator dashboard foundation.
- Connected pages to backend endpoints.

### Public Pages

```text
/login
/register
/unauthorized
```

### Student Pages

```text
/student/dashboard
/student/exams
/student/exams/:id/take
/student/submissions
/student/results/:submissionId
```

### Lecturer Pages

```text
/lecturer/dashboard
/lecturer/exams
/lecturer/exams/create
/lecturer/exams/:id/questions
/lecturer/exams/:id/submissions
/lecturer/submissions/:id/grade
```

### Administrator Page

```text
/admin/dashboard
```

### Status

```text
COMPLETE
```

---

# Milestone 11 — Docker Containers

## 14. Goal

The eleventh milestone prepared the frontend and backend for containerized deployment.

### Main Work

- Created the backend Dockerfile.
- Created the frontend multi-stage Dockerfile.
- Used Node.js to build the React application.
- Used Nginx to serve frontend production files.
- Added frontend Nginx configuration.
- Defined backend port `5000`.
- Defined frontend web-server port.

### Backend Build

```bash
docker build \
  -t exam-backend:local \
  -f backend/Dockerfile \
  .
```

### Frontend Build

```bash
docker build \
  -t exam-frontend:local \
  -f frontend/Dockerfile \
  .
```

### Status

```text
CONFIGURATION COMPLETE
```

---

# Milestone 12 — Kubernetes

## 15. Goal

The twelfth milestone prepared the system for Kubernetes orchestration.

### Main Work

- Created the application namespace.
- Created PostgreSQL deployment configuration.
- Created PostgreSQL service.
- Created backend Deployment and Service.
- Created frontend Deployment and Service.
- Created ConfigMaps.
- Created Secret examples and Secret references.
- Created Ingress configuration.
- Added resource and health-check foundations.
- Added Prometheus and Grafana configurations.

### Main Kubernetes Resources

```text
Namespace
ConfigMap
Secret
Deployment
Service
PersistentVolumeClaim
Ingress
```

### Local Target

```text
Minikube
```

### Future Production Target

```text
Google Kubernetes Engine
```

### Status

```text
MANIFESTS COMPLETE
PUBLIC DEPLOYMENT NOT YET COMPLETE
```

---

# Milestone 13 — Monitoring

## 16. Goal

The thirteenth milestone added observability foundations.

### Main Work

- Added Prometheus metrics to the backend.
- Added the `/metrics` endpoint.
- Added Prometheus Kubernetes configuration.
- Added Grafana Kubernetes configuration.
- Added health and readiness endpoints.
- Added Morgan HTTP logging.
- Added Kubernetes log commands.

### Monitoring Endpoints

```text
GET /health
GET /ready
GET /metrics
GET /api/db-check
```

### Log Command

```bash
kubectl logs \
  -n exam-system \
  deployment/backend
```

### Status

```text
CONFIGURATION COMPLETE
PRODUCTION VERIFICATION PENDING
```

---

# Milestone 14 — Terraform Infrastructure

## 17. Goal

The fourteenth milestone demonstrated Infrastructure as Code.

The repository contains both AWS and Google Cloud Terraform work.

The AWS example is retained as evidence of Terraform and cloud-infrastructure knowledge.

The actual intended production deployment path is Google Cloud.

### AWS Foundation

The AWS Terraform example demonstrates:

- EKS concepts.
- Cloud networking concepts.
- Managed Kubernetes infrastructure.
- Terraform modules and resources.

### Google Cloud Foundation

The Google Cloud Terraform work includes:

- Required Google Cloud API activation.
- Project configuration.
- Networking foundation.
- Artifact Registry foundation.
- GKE foundation.
- IAM configuration.
- Logging and monitoring APIs.

### Important Google Cloud APIs

```text
artifactregistry.googleapis.com
cloudresourcemanager.googleapis.com
compute.googleapis.com
container.googleapis.com
iam.googleapis.com
iamcredentials.googleapis.com
logging.googleapis.com
monitoring.googleapis.com
```

### Status

```text
FOUNDATION COMPLETE
FINAL APPLY AND PUBLIC DEPLOYMENT PENDING
```

---

# Milestone 15 — GitHub Actions and CI/CD Foundation

## 18. Goal

The fifteenth milestone added automatic project checks.

### Main Work

- Added backend dependency installation.
- Added available backend checks.
- Added frontend dependency installation.
- Added frontend production build.
- Added Docker image build workflow.
- Added Terraform format and validation checks.
- Configured workflows for push and pull-request events.

### Typical Workflow

```text
Git Push
    |
    v
GitHub Actions
    |
    +-- Install dependencies
    |
    +-- Run checks
    |
    +-- Build frontend
    |
    +-- Build container images
    |
    +-- Validate Terraform
    |
    v
Workflow Result
```

### Current Limitation

The workflows provide a CI/CD foundation, but complete automated deployment to Google Cloud is not yet active.

### Status

```text
CI FOUNDATION COMPLETE
AUTOMATED PRODUCTION DEPLOYMENT PENDING
```

---

# Milestone 16 — Final Documentation

## 19. Goal

The sixteenth milestone prepares the project for final submission.

### Documentation Created

```text
docs/01-project-overview.md
docs/02-features-and-api.md
docs/03-system-architecture.md
docs/04-client-architecture.md
docs/05-server-architecture.md
docs/06-database-design.md
docs/07-json-models.md
docs/08-oop-uml.md
docs/09-sequence-diagrams.md
docs/10-milestones-and-branches.md
docs/11-devops-and-deployment.md
docs/12-testing-logging-monitoring.md
docs/SUBMISSION_CHECKLIST.md
```

### Diagrams Created

```text
system-architecture
client-component
server-architecture
database-erd
oop-class-diagram
deployment-diagram
sequence-lecturer-exam
sequence-student-exam
sequence-grading
```

Each diagram includes:

```text
Editable Mermaid source: .mmd
Rendered image:          .png
```

### Screenshot Set

The planned screenshot set contains:

```text
01-login-page.png
02-register-page.png
03-student-dashboard.png
04-available-exams.png
05-take-exam.png
06-student-submissions.png
07-lecturer-dashboard.png
08-lecturer-exams.png
09-create-exam.png
10-question-management.png
11-submission-grading.png
12-backend-health.png
```

### Status

```text
IN PROGRESS
```

---

## 20. Current Confirmed Git Branches

### `main`

Purpose:

- Stable project branch.
- Main integration point.
- Intended final version after reviewed changes are merged.
- Should remain deployable and documented.

### `feature/final-documentation`

Purpose:

- Final documentation work.
- Architecture documents.
- UML and Mermaid diagrams.
- Screenshots.
- Submission checklist.
- README improvements.

Current development documentation is being committed and pushed to:

```text
origin/feature/final-documentation
```

---

## 21. Branch Structure

The current branch model is:

```text
main
  |
  └── feature/final-documentation
        |
        +-- README updates
        +-- Architecture documentation
        +-- ERD documentation
        +-- JSON models
        +-- UML documentation
        +-- Sequence diagrams
        +-- Milestone documentation
        +-- DevOps documentation
        +-- Testing documentation
        +-- Screenshots
        +-- Submission checklist
```

After review, the intended integration flow is:

```text
feature/final-documentation
            |
            v
       Pull Request
            |
            v
          main
```

---

## 22. Git Branch Naming Convention

The recommended branch format is:

```text
<type>/<short-description>
```

Examples:

```text
feature/authentication
feature/lecturer-exams
feature/student-exam-flow
feature/grading
feature/final-documentation
fix/database-connection
fix/frontend-routing
docs/api-documentation
infra/gcp-gke
infra/kubernetes-monitoring
```

### Branch Types

| Prefix | Purpose |
| --- | --- |
| `feature/` | New application feature |
| `fix/` | Bug correction |
| `docs/` | Documentation-only changes |
| `infra/` | Infrastructure and deployment work |
| `test/` | Testing work |
| `refactor/` | Internal code improvement |

---

## 23. Commit Strategy

Commits should be:

- Small.
- Focused.
- Descriptive.
- Verifiable.
- Related to one logical task.

Good examples:

```text
Create backend Express starter
Add database schema and seed data
Connect backend to PostgreSQL
Implement JWT authentication
Add lecturer exam API
Add student auto-save flow
Add Kubernetes monitoring configuration
Complete server architecture documentation
```

Avoid unclear commit messages such as:

```text
update
fix
changes
work
final final
```

---

## 24. Confirmed Documentation Commits

The documentation branch contains confirmed commits such as:

```text
0ddbc5d Create final project documentation structure
6656d91 Document project overview features pages and APIs
bf2bb98 Add project partner to documentation
5a5ca44 Update README with team links and deployment status
0f505ab Complete general system architecture documentation
0b12235 Add general system architecture diagram
5dc042d Add all final project diagrams
a23a003 Complete features pages and API documentation
```

Additional documentation commits were created for:

- Client architecture.
- Server architecture.
- Database design.
- JSON models.
- OOP UML.
- Sequence diagrams.
- Milestones and branches.

The exact latest commit identifiers can be viewed using:

```bash
git log --oneline --decorate
```

---

## 25. Pull Request Workflow

The recommended workflow is:

### Step 1 — Update the Feature Branch

```bash
git checkout feature/final-documentation
git pull origin feature/final-documentation
```

### Step 2 — Check Changes

```bash
git status
git diff
git diff --check
```

### Step 3 — Add Only Intended Files

```bash
git add <specific-file>
```

Using specific files reduces the risk of committing:

- Local secrets.
- Temporary files.
- Runtime logs.
- Unrelated changes.

### Step 4 — Commit

```bash
git commit -m "Describe the completed task"
```

### Step 5 — Push

```bash
git push origin feature/final-documentation
```

### Step 6 — Open a Pull Request

Create a pull request:

```text
feature/final-documentation → main
```

### Step 7 — Review

Verify:

- Documentation renders correctly.
- Images are visible.
- No secrets are included.
- Workflows pass.
- Links work.
- The branch can merge without conflicts.

### Step 8 — Merge

Merge the reviewed branch into `main`.

---

## 26. Git Safety Checks

Before every commit:

```bash
git status --short
git diff --check
```

After staging:

```bash
git diff --cached --check
git diff --cached --stat
```

After committing:

```bash
git log --oneline --decorate -5
```

After pushing:

```bash
git status
```

A clean tracked state should display:

```text
nothing to commit, working tree clean
```

Untracked local runtime folders should not be added accidentally.

Example:

```text
.run/
```

---

## 27. Files That Must Not Be Committed

Sensitive or temporary files must remain outside Git.

Examples:

```text
backend/.env
frontend/.env
*.log
node_modules/
.run/
private keys
service-account keys
real Kubernetes Secret files
Terraform state containing sensitive values
```

Safe templates may be committed:

```text
backend/.env.example
frontend/.env.example
secret.example.yaml
terraform.tfvars.example
```

---

## 28. Repository Verification Commands

### Show Current Branch

```bash
git branch --show-current
```

### Show Local and Remote Branches

```bash
git branch -a
```

### Show Recent History

```bash
git log --oneline --decorate --graph --all -20
```

### Show Changed Files

```bash
git status --short
```

### Check Remote Repository

```bash
git remote -v
```

### Check Ignored Files

```bash
git status --ignored --short
```

### Check Whether a File Is Tracked

```bash
git ls-files <file-path>
```

---

## 29. Exporting the Actual Commit History

The current project history can be exported using:

```bash
git log \
  --date=short \
  --pretty=format:'%h | %ad | %an | %s' \
  --all \
  > docs/git-history.txt
```

A graphical history can be generated using:

```bash
git log \
  --graph \
  --oneline \
  --decorate \
  --all \
  > docs/git-graph.txt
```

These files can be used as evidence of project development.

They should be reviewed before adding them to Git.

---

## 30. Team Collaboration Model

The project team consists of:

```text
Ameer Mresat
Mohamed Kharanba
```

A safe team workflow is:

```text
Team Member
    |
    v
Feature Branch
    |
    v
Commit and Push
    |
    v
Pull Request
    |
    v
Review
    |
    v
Merge into main
```

Team members should avoid editing the same large file at the same time when possible.

Before starting new work:

```bash
git pull
```

Before pushing:

```bash
git status
git diff
```

---

## 31. Current Project State

### Completed

- Backend API.
- PostgreSQL schema.
- Authentication.
- Role authorization.
- Lecturer exam management.
- Question management.
- Student exam flow.
- Auto-save.
- Submission management.
- Grading.
- Result publication.
- React pages.
- Docker configuration.
- Kubernetes configuration.
- Monitoring configuration.
- Terraform foundation.
- GitHub Actions foundation.
- Main architecture documentation.
- ERD.
- OOP UML.
- Three sequence diagrams.

### Still Pending

- Public Google Cloud deployment.
- Public frontend URL.
- Public backend URL.
- Complete administrator interface.
- Complete automated test suites.
- Production secret management.
- Final screenshot commit.
- Final submission verification.
- Pull request and merge into `main`.

---

## 32. Final Development Flow

```text
Initial Repository
        |
        v
Backend Foundation
        |
        v
Database Schema
        |
        v
Authentication
        |
        v
Lecturer Features
        |
        v
Student Features
        |
        v
Grading
        |
        v
React Frontend
        |
        v
Docker
        |
        v
Kubernetes
        |
        v
Monitoring
        |
        v
Terraform and GitHub Actions
        |
        v
Final Documentation
        |
        v
Public Deployment
        |
        v
Final Pull Request
        |
        v
Submission
```

---

## 33. Final Branch Goal

Before submission, the intended final state is:

```text
feature/final-documentation
            |
            v
      Review and Testing
            |
            v
       Pull Request
            |
            v
           main
            |
            v
       Final Git Tag
```

An optional final tag may be created after verification:

```bash
git tag -a v1.0.0 -m "Final project submission"
git push origin v1.0.0
```

The tag should be created only after:

- Final documentation review.
- Secret scanning.
- Build verification.
- Screenshot verification.
- Branch merge.
- Deployment verification, when available.

---

## 34. Current Limitations

The branch and milestone documentation is based on the confirmed project structure and available Git history.

Some older implementation tasks may have been completed directly on `main` instead of separate feature branches.

The final exact history remains available through Git and GitHub.

The authoritative source is:

```bash
git log --all
```