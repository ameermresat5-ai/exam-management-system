# Main System Scenarios — Sequence Diagram Summary

## Project Team

- Ameer Mresat
- Mohamed Kharanba

## 1. Overview

The project requirement asks the team to select two or three important system scenarios and demonstrate how the complete flow passes through all application layers.

The Full Stack Exam Management System includes three main end-to-end scenarios:

1. Lecturer creates questions and publishes an exam.
2. Student starts, takes, auto-saves, and submits an exam.
3. Lecturer grades a submission and publishes the results.

Each scenario demonstrates communication between:

```text
User
  |
  v
React Frontend
  |
  v
Axios API Client
  |
  v
Express Route
  |
  v
JWT Authentication Middleware
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
PostgreSQL
  |
  v
JSON Response
  |
  v
Updated React User Interface
```

The complete detailed explanation is available in:

```text
docs/09-sequence-diagrams.md
```

---

# Scenario 1 — Lecturer Creates and Publishes an Exam

## 2. Scenario Goal

This scenario demonstrates how a lecturer creates an exam, adds questions and answer options, and publishes the exam for students.

## 3. Main Participants

- Lecturer
- React frontend
- Axios API client
- Express API
- Authentication middleware
- Role middleware
- Exam controller
- Question controller
- Joi validators
- Exam service
- Question service
- PostgreSQL

## 4. Main Flow

```text
Lecturer
   |
   v
Create Exam React Page
   |
   v
POST /api/exams
   |
   v
JWT Authentication
   |
   v
LECTURER or ADMIN Role Verification
   |
   v
Exam Request Validation
   |
   v
Exam Controller
   |
   v
Exam Service
   |
   v
INSERT INTO exams
   |
   v
Exam Created with DRAFT Status
   |
   v
Lecturer Opens Question Management
   |
   v
POST /api/exams/:examId/questions
   |
   v
Question and Option Validation
   |
   v
Question Service Transaction
   |
   v
INSERT Question and Options
   |
   v
Lecturer Selects Publish
   |
   v
PATCH /api/exams/:id/publish
   |
   v
Exam Status Changes to PUBLISHED
```

## 5. Main API Endpoints

```text
POST  /api/exams
GET   /api/exams/:id
POST  /api/exams/:examId/questions
GET   /api/exams/:examId/questions
PUT   /api/questions/:id
DELETE /api/questions/:id
PATCH /api/exams/:id/publish
```

## 6. Database Tables

```text
users
exams
questions
question_options
```

## 7. Main Security Checks

- The JWT must be valid.
- The user must have the `LECTURER` or `ADMIN` role.
- The lecturer must own the exam.
- Exam dates and duration must be valid.
- Question points and position must be valid.
- Question options must be valid.
- Related question and option inserts should use a transaction.

## 8. Sequence Diagram

Editable Mermaid source:

```text
docs/diagrams/sequence-lecturer-exam.mmd
```

Rendered diagram:

![Lecturer Creates and Publishes an Exam](diagrams/sequence-lecturer-exam.png)

---

# Scenario 2 — Student Takes and Submits an Exam

## 9. Scenario Goal

This scenario demonstrates how a student views available exams, starts an exam, receives safe questions, saves answers automatically, and submits the exam.

## 10. Main Participants

- Student
- React frontend
- Axios API client
- Express API
- Authentication middleware
- Role middleware
- Student exam controller
- Joi validators
- Student exam service
- PostgreSQL

## 11. Main Flow

```text
Student
   |
   v
Available Exams React Page
   |
   v
GET /api/student/exams/available
   |
   v
JWT Authentication
   |
   v
STUDENT Role Verification
   |
   v
Backend Returns Available Published Exams
   |
   v
Student Selects Start Exam
   |
   v
POST /api/student/exams/:examId/start
   |
   v
Backend Verifies Exam Availability
   |
   v
Create Exam Session
   |
   v
Create Submission with IN_PROGRESS Status
   |
   v
GET /api/student/exams/:examId
   |
   v
Remove correctAnswer and isCorrect
   |
   v
Student Answers Questions
   |
   v
PATCH /api/submissions/:submissionId/auto-save
   |
   v
INSERT or UPDATE Answers
   |
   v
Student Selects Submit
   |
   v
POST /api/submissions/:submissionId/submit
   |
   v
Submission Status Changes to SUBMITTED
```

## 12. Main API Endpoints

```text
GET   /api/student/exams/available
POST  /api/student/exams/:examId/start
GET   /api/student/exams/:examId
PATCH /api/submissions/:submissionId/auto-save
POST  /api/submissions/:submissionId/submit
GET   /api/submissions/my
```

## 13. Database Tables

```text
users
exams
questions
question_options
exam_sessions
submissions
answers
```

## 14. Main Security Checks

- The JWT must be valid.
- The user must have the `STUDENT` role.
- The exam must have `PUBLISHED` status.
- The current time must be inside the exam availability period.
- The student must own the session and submission.
- Duplicate conflicting sessions must be prevented.
- The student must not receive `correctAnswer`.
- The student must not receive `isCorrect`.
- Answers may be modified only while the submission is `IN_PROGRESS`.

## 15. Sequence Diagram

Editable Mermaid source:

```text
docs/diagrams/sequence-student-exam.mmd
```

Rendered diagram:

![Student Takes and Submits an Exam](diagrams/sequence-student-exam.png)

---

# Scenario 3 — Lecturer Grades and Publishes Results

## 16. Scenario Goal

This scenario demonstrates how a lecturer reviews a student submission, grades individual answers, grades the complete submission, publishes the results, and allows the student to view the final grade.

## 17. Main Participants

- Lecturer
- Student
- Lecturer React interface
- Student React interface
- Axios API client
- Express API
- Authentication middleware
- Role middleware
- Grading controller
- Exam controller
- Joi validators
- Grading service
- Exam service
- PostgreSQL

## 18. Main Flow

```text
Lecturer
   |
   v
Exam Submissions React Page
   |
   v
GET /api/exams/:examId/submissions
   |
   v
JWT and Lecturer Role Verification
   |
   v
Backend Verifies Exam Ownership
   |
   v
Lecturer Opens One Submission
   |
   v
GET /api/submissions/:id
   |
   v
Backend Returns Questions and Student Answers
   |
   v
Lecturer Grades an Answer
   |
   v
PATCH /api/answers/:answerId/grade
   |
   v
Update Answer Score and Feedback
   |
   v
Lecturer Grades Complete Submission
   |
   v
PATCH /api/submissions/:id/grade
   |
   v
Submission Status Changes to GRADED
   |
   v
Lecturer Publishes Results
   |
   v
PATCH /api/exams/:id/publish-results
   |
   v
Exam Status Changes to RESULTS_PUBLISHED
   |
   v
Student Opens Result Page
   |
   v
GET /api/submissions/:id/result
   |
   v
Backend Verifies Student Ownership
   |
   v
Student Receives Score and Feedback
```

## 19. Main API Endpoints

```text
GET   /api/exams/:examId/submissions
GET   /api/submissions/:id
PATCH /api/answers/:answerId/grade
PATCH /api/submissions/:id/grade
PATCH /api/exams/:id/publish-results
GET   /api/submissions/:id/result
```

## 20. Database Tables

```text
users
exams
questions
question_options
submissions
answers
notifications
audit_logs
```

## 21. Main Security Checks

- The lecturer JWT must be valid.
- The user must have the `LECTURER` or `ADMIN` role.
- The lecturer must own the related exam.
- The answer must belong to the selected submission.
- An answer score must not be negative.
- An answer score must not exceed the question points.
- The student must own the requested result.
- The submission must be graded.
- The exam must have `RESULTS_PUBLISHED` status.

## 22. Sequence Diagram

Editable Mermaid source:

```text
docs/diagrams/sequence-grading.mmd
```

Rendered diagram:

![Lecturer Grades and Publishes Results](diagrams/sequence-grading.png)

---

# Complete Exam Lifecycle

## 23. Exam Status Flow

```text
DRAFT
   |
   v
PUBLISHED
   |
   v
CLOSED
   |
   v
RESULTS_PUBLISHED
```

## 24. Submission Status Flow

```text
IN_PROGRESS
      |
      v
SUBMITTED
      |
      v
GRADED
```

## 25. Complete End-to-End Flow

```text
Lecturer Creates Exam
        |
        v
Lecturer Adds Questions
        |
        v
Lecturer Publishes Exam
        |
        v
Student Views Available Exam
        |
        v
Student Starts Exam
        |
        v
Backend Creates Session and Submission
        |
        v
Student Auto-Saves Answers
        |
        v
Student Submits Exam
        |
        v
Lecturer Reviews Submission
        |
        v
Lecturer Grades Answers
        |
        v
Lecturer Grades Submission
        |
        v
Lecturer Publishes Results
        |
        v
Student Views Grade and Feedback
```

---

## 26. Requirement Completion Statement

The project requirement asks the team to select two or three important scenarios and show how the flow passes through all system stages.

This requirement is complete.

The project includes three end-to-end sequence diagrams:

1. Lecturer creates and publishes an exam.
2. Student takes and submits an exam.
3. Lecturer grades the submission and publishes results.

Each scenario demonstrates the flow through:

- React pages.
- Axios.
- Express routes.
- JWT authentication.
- Role authorization.
- Controllers.
- Joi validators.
- Business services.
- PostgreSQL.
- JSON responses.
- User-interface updates.

## 27. Presentation Statement

The following statement may be used during the project presentation:

> We selected three main end-to-end scenarios: lecturer exam creation and publication, student exam participation and submission, and lecturer grading and result publication. Each sequence diagram demonstrates the complete flow through the React client, Axios, Express routes, authentication and role middleware, controllers, validators, services, PostgreSQL, and the final JSON response.
