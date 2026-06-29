# Full Stack Exam Management System

A full-stack online exam management system for creating, managing, taking, grading, and publishing exam results. The project is designed as a student DevSecOps full-stack project with a complete application stack, containerization, Kubernetes manifests, monitoring, Infrastructure as Code templates, and CI/CD workflows.

## 1. Project Overview

The Full Stack Exam Management System supports three user roles:

- Lecturer
- Student
- Admin

Lecturers can create and manage exams, add questions, publish exams, review submissions, grade answers, and publish results. Students can register, log in, view available exams, start exams, submit answers, and view grades with feedback. Admin users are included for platform-level access and future administration features.

The application includes a React frontend, Node.js Express backend, PostgreSQL database schema, JWT authentication, role-based authorization, Dockerfiles, Kubernetes manifests for Minikube, Prometheus and Grafana monitoring, Terraform AWS EKS templates, and GitHub Actions workflows.

## 2. Architecture

```text
React + Vite Frontend
        |
        | HTTP / Axios
        v
Node.js + Express Backend
        |
        | pg PostgreSQL client
        v
PostgreSQL Database
```

Deployment and DevSecOps layers:

```text
Docker Images
        |
        v
Kubernetes Manifests for Minikube
        |
        +-- Backend Deployment and Service
        +-- Frontend Deployment and Service
        +-- Local PostgreSQL Deployment and Service
        +-- Prometheus and Grafana Monitoring

Terraform AWS EKS Template
        |
        +-- VPC
        +-- EKS
        +-- RDS PostgreSQL
        +-- Security Groups
```

## 3. Features

Lecturer features:

- Create exams
- Manage exams
- Add questions
- Publish exams
- Review student submissions
- Grade exams
- Publish results

Student features:

- Register and login
- View available exams
- Start an exam
- Submit answers
- View grades and feedback after results are published

Admin features:

- Admin role support
- Admin dashboard starter
- Role-based access foundation for future platform administration

Security and DevSecOps features:

- JWT authentication
- bcrypt password hashing
- Role-based access control
- Helmet security headers
- CORS configuration
- Rate limiting
- Centralized error handling
- PostgreSQL schema and seed support
- Prometheus `/metrics` endpoint
- Docker and Kubernetes support
- GitHub Actions CI workflows
- Terraform cloud infrastructure template

## 4. Tech Stack

| Area | Technology |
| --- | --- |
| Frontend | React + Vite |
| Routing | react-router-dom v6 |
| API Client | Axios |
| Backend | Node.js + Express |
| Database | PostgreSQL |
| Database Client | pg |
| Authentication | JWT + bcrypt |
| Authorization | Role-based access control |
| Validation | Joi |
| Security Middleware | helmet, cors, express-rate-limit |
| Logging | morgan |
| Metrics | prom-client, Prometheus |
| Monitoring UI | Grafana |
| Containers | Dockerfiles for frontend and backend |
| Kubernetes | Minikube manifests |
| Infrastructure as Code | Terraform AWS EKS template |
| CI/CD | GitHub Actions |

## 5. Folder Structure

```text
.
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   └── src/
│       ├── app.js
│       ├── server.js
│       ├── config/
│       ├── controllers/
│       ├── db/
│       ├── middleware/
│       ├── routes/
│       ├── services/
│       ├── validators/
│       └── utils/
├── database/
│   ├── schema.sql
│   └── seed.sql
├── frontend/
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   └── src/
├── k8s/
│   ├── namespace.yaml
│   ├── local-postgres.yaml
│   ├── backend-*.yaml
│   ├── frontend-*.yaml
│   ├── ingress.yaml
│   └── monitoring/
├── terraform/
│   └── aws-eks/
└── .github/
    └── workflows/
```

## 6. Local Development

### Backend

```bash
cd backend
npm install
npm run dev
```

The backend runs on:

```text
http://localhost:5000
```

Useful backend endpoints:

```text
GET /health
GET /ready
GET /metrics
GET /api
GET /api/db-check
```

Database setup commands require a PostgreSQL database and a valid `DATABASE_URL` in `backend/.env`:

```bash
cd backend
npm run db:init
npm run db:seed
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend normally runs on:

```text
http://localhost:5173
```

The frontend API base URL uses:

```text
VITE_API_URL || http://localhost:5000
```

For local development, the default backend URL is `http://localhost:5000`.

## 7. Docker Build

Build the backend image from the project root:

```bash
docker build -t exam-backend:local -f backend/Dockerfile .
```

Build the frontend image:

```bash
docker build -t exam-frontend:local ./frontend
```

The backend Dockerfile copies the root `database/` folder into the image so database initialization scripts can find:

```text
/database/schema.sql
/database/seed.sql
```

No Docker Compose file is used in this project.

## 8. Kubernetes Minikube Deployment

Kubernetes manifests are located in:

```text
k8s/
```

The local Kubernetes namespace is:

```text
exam-system
```

The Minikube setup includes:

- Local PostgreSQL using `postgres:16`
- Backend deployment and service
- Frontend deployment and NodePort service
- Basic ingress example
- Prometheus and Grafana monitoring manifests

Apply manifests manually for local Minikube testing only after building local images inside the Minikube Docker environment or loading images into Minikube.

Example manifest order:

```bash
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/local-postgres.yaml
kubectl apply -f k8s/backend-secret.yaml
kubectl apply -f k8s/backend-configmap.yaml
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/backend-service.yaml
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/frontend-service.yaml
```

For ingress testing, enable the Minikube ingress addon first:

```bash
minikube addons enable ingress
kubectl apply -f k8s/ingress.yaml
```

## 9. Monitoring with Prometheus and Grafana

The backend exposes Prometheus metrics at:

```text
GET /metrics
```

Monitoring manifests are located in:

```text
k8s/monitoring/
```

Prometheus scrapes:

- Prometheus itself
- `backend-service:5000/metrics`

Grafana is included as a simple Minikube deployment with default demo credentials:

```text
username: admin
password: admin
```

These credentials are for local testing only and must not be used in production.

## 10. Terraform AWS EKS Template

Terraform files are located in:

```text
terraform/aws-eks/
```

This folder is a template for project demonstration. The local deployment uses Minikube. AWS EKS is only a production/cloud design example.

The Terraform template demonstrates:

- AWS VPC
- Public and private subnets
- EKS cluster
- EKS managed node group
- RDS PostgreSQL
- Security groups
- Outputs for cluster name, region, and database endpoint

Safe commands:

```bash
terraform fmt
terraform init
terraform validate
```

Important warning:

```text
Do not run terraform apply unless you want paid AWS resources.
```

`terraform apply` can create paid AWS infrastructure such as EKS, EC2 nodes, NAT Gateway, and RDS PostgreSQL.

## 11. GitHub Actions CI/CD

GitHub Actions workflows are located in:

```text
.github/workflows/
```

Included workflows:

- Backend CI
- Frontend CI
- Docker image build checks
- Terraform validation

The workflows are designed to be safe for a student DevSecOps project:

- They do not deploy to AWS
- They do not run `terraform apply`
- They do not push Docker images
- They do not include secrets

## 12. Screenshots to Add

Recommended screenshots for the final project report:

- Login page
- Register page
- Student dashboard
- Available exams page
- Take exam page
- Student submissions page
- Lecturer dashboard
- Lecturer exams page
- Question management page
- Submission grading page
- Kubernetes pods running in Minikube
- Prometheus targets page
- Grafana dashboard
- GitHub Actions workflow results

## 13. Important Notes

- Passwords are stored as bcrypt hashes, not plain text.
- JWT is used for authentication.
- Role-based access control protects lecturer, student, and admin routes.
- Student APIs must not expose `correctAnswer` or `isCorrect` values.
- Local Kubernetes uses a simple PostgreSQL deployment for Minikube testing.
- Cloud deployment should use managed PostgreSQL such as AWS RDS.
- Terraform AWS EKS files are templates only.
- Do not run `terraform apply` unless you intentionally want paid AWS resources.
- No Docker Compose setup is used.

## 14. Author

Created as a Full Stack DevSecOps student project.