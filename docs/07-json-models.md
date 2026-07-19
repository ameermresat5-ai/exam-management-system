# JSON Request and Response Models

## Project Team

- Ameer Mresat
- Mohamed Kharanba

## 1. Overview

The Full Stack Exam Management System transfers data between the React frontend and the Express backend using JSON.

The examples in this document describe the main logical request and response models used by the system.

The exact response may contain additional metadata depending on the endpoint.

The frontend normally uses camelCase field names, while PostgreSQL uses snake_case column names.

Example:

```text
Frontend / API: fullName
Database:       full_name
```

The backend converts database records into safe API response objects before returning them to the frontend.

---

## 2. General Response Structure

A successful response may use the following logical structure:

```json
{
  "success": true,
  "message": "Operation completed successfully.",
  "data": {}
}
```

A successful collection response may use:

```json
{
  "success": true,
  "data": [],
  "count": 0
}
```

An error response may use:

```json
{
  "success": false,
  "message": "The requested operation could not be completed."
}
```

Validation errors may include field details:

```json
{
  "success": false,
  "message": "Validation failed.",
  "errors": [
    {
      "field": "email",
      "message": "A valid email address is required."
    }
  ]
}
```

Sensitive internal details must not be returned.

---

## 3. User Role Values

```json
[
  "ADMIN",
  "LECTURER",
  "STUDENT"
]
```

---

## 4. Public User Model

The public user model contains information that may safely be returned to the frontend.

```json
{
  "id": "4fb59e6f-a0bf-4d13-9323-78846b987195",
  "fullName": "Example User",
  "email": "user@example.com",
  "role": "STUDENT",
  "isActive": true,
  "createdAt": "2026-07-20T09:00:00.000Z",
  "updatedAt": "2026-07-20T09:00:00.000Z"
}
```

### Fields

| Field | Type | Description |
| --- | --- | --- |
| `id` | UUID string | Unique user identifier |
| `fullName` | String | Displayed full name |
| `email` | String | Unique login email |
| `role` | Enum string | User role |
| `isActive` | Boolean | Whether the account is active |
| `createdAt` | ISO date string | Creation timestamp |
| `updatedAt` | ISO date string | Last-update timestamp |

The following field must never be returned:

```text
passwordHash
```

---

## 5. Registration Request

Endpoint:

```text
POST /api/auth/register
```

Example request:

```json
{
  "fullName": "Example Student",
  "email": "student@example.com",
  "password": "StrongPassword123!",
  "role": "STUDENT"
}
```

### Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `fullName` | String | Yes | User's full name |
| `email` | String | Yes | Unique email address |
| `password` | String | Yes | Plain-text password sent only during registration |
| `role` | Enum string | Yes | Requested account role |

The backend hashes the password before storing it.

The plain-text password is not saved.

---

## 6. Registration Response

Example successful response:

```json
{
  "success": true,
  "message": "User registered successfully.",
  "token": "signed-jwt-token",
  "user": {
    "id": "4fb59e6f-a0bf-4d13-9323-78846b987195",
    "fullName": "Example Student",
    "email": "student@example.com",
    "role": "STUDENT",
    "isActive": true
  }
}
```

Example duplicate-email response:

```json
{
  "success": false,
  "message": "A user with this email already exists."
}
```

---

## 7. Login Request

Endpoint:

```text
POST /api/auth/login
```

Example request:

```json
{
  "email": "student@example.com",
  "password": "StrongPassword123!"
}
```

### Fields

| Field | Type | Required |
| --- | --- | --- |
| `email` | String | Yes |
| `password` | String | Yes |

---

## 8. Login Response

Example successful response:

```json
{
  "success": true,
  "message": "Login successful.",
  "token": "signed-jwt-token",
  "user": {
    "id": "4fb59e6f-a0bf-4d13-9323-78846b987195",
    "fullName": "Example Student",
    "email": "student@example.com",
    "role": "STUDENT",
    "isActive": true
  }
}
```

Example invalid-credentials response:

```json
{
  "success": false,
  "message": "Invalid email or password."
}
```

The backend should not reveal whether the email or password was incorrect.

---

## 9. Current User Response

Endpoint:

```text
GET /api/auth/me
```

Required header:

```text
Authorization: Bearer <JWT>
```

Example response:

```json
{
  "success": true,
  "user": {
    "id": "4fb59e6f-a0bf-4d13-9323-78846b987195",
    "fullName": "Example Student",
    "email": "student@example.com",
    "role": "STUDENT",
    "isActive": true,
    "createdAt": "2026-07-20T09:00:00.000Z",
    "updatedAt": "2026-07-20T09:00:00.000Z"
  }
}
```

---

## 10. JWT Payload Model

A logical JWT payload may contain:

```json
{
  "userId": "4fb59e6f-a0bf-4d13-9323-78846b987195",
  "email": "student@example.com",
  "role": "STUDENT",
  "iat": 1784538000,
  "exp": 1784624400
}
```

### Security Rules

- The JWT secret is never included in the token payload.
- Password information is never included.
- The token must be signed by the backend.
- The backend must verify the token before trusting it.
- Expired tokens must be rejected.

---

## 11. Exam Status Values

```json
[
  "DRAFT",
  "PUBLISHED",
  "CLOSED",
  "RESULTS_PUBLISHED"
]
```

---

## 12. Create Exam Request

Endpoint:

```text
POST /api/exams
```

Required roles:

```text
LECTURER
ADMIN
```

Example request:

```json
{
  "title": "Database Systems Final Exam",
  "description": "Final examination covering ERD, SQL, and relational algebra.",
  "durationMinutes": 90,
  "startsAt": "2026-08-01T09:00:00.000Z",
  "endsAt": "2026-08-01T12:00:00.000Z"
}
```

### Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `title` | String | Yes | Exam title |
| `description` | String | No | Exam description |
| `durationMinutes` | Integer | Yes | Exam duration |
| `startsAt` | ISO date string | Yes | Availability start |
| `endsAt` | ISO date string | Yes | Availability end |

The backend assigns:

- Exam ID.
- Lecturer ID.
- Initial status.
- Creation timestamp.
- Update timestamp.

---

## 13. Exam Response Model

```json
{
  "id": "1dd6ad9c-3823-434a-93a7-4a122e1d8dc2",
  "lecturerId": "fd0a63e7-7813-4c92-a9db-34f5ed529a42",
  "title": "Database Systems Final Exam",
  "description": "Final examination covering ERD, SQL, and relational algebra.",
  "status": "DRAFT",
  "durationMinutes": 90,
  "startsAt": "2026-08-01T09:00:00.000Z",
  "endsAt": "2026-08-01T12:00:00.000Z",
  "createdAt": "2026-07-20T09:00:00.000Z",
  "updatedAt": "2026-07-20T09:00:00.000Z"
}
```

---

## 14. Exam Collection Response

Endpoint:

```text
GET /api/exams/my
```

Example response:

```json
{
  "success": true,
  "count": 2,
  "exams": [
    {
      "id": "1dd6ad9c-3823-434a-93a7-4a122e1d8dc2",
      "title": "Database Systems Final Exam",
      "status": "DRAFT",
      "durationMinutes": 90,
      "startsAt": "2026-08-01T09:00:00.000Z",
      "endsAt": "2026-08-01T12:00:00.000Z"
    },
    {
      "id": "a8cd17b6-3529-4935-9993-f35bf0252e43",
      "title": "Web Development Exam",
      "status": "PUBLISHED",
      "durationMinutes": 60,
      "startsAt": "2026-08-03T08:00:00.000Z",
      "endsAt": "2026-08-03T11:00:00.000Z"
    }
  ]
}
```

---

## 15. Update Exam Request

Endpoint:

```text
PUT /api/exams/:id
```

Example request:

```json
{
  "title": "Updated Database Systems Final Exam",
  "description": "Updated exam description.",
  "durationMinutes": 100,
  "startsAt": "2026-08-01T09:00:00.000Z",
  "endsAt": "2026-08-01T12:30:00.000Z"
}
```

The backend verifies:

- Authentication.
- Lecturer or administrator role.
- Exam ownership.
- Valid start and end dates.
- Positive duration.
- Allowed status for editing.

---

## 16. Exam Status Update Response

Publish endpoint:

```text
PATCH /api/exams/:id/publish
```

Example response:

```json
{
  "success": true,
  "message": "Exam published successfully.",
  "exam": {
    "id": "1dd6ad9c-3823-434a-93a7-4a122e1d8dc2",
    "title": "Database Systems Final Exam",
    "status": "PUBLISHED"
  }
}
```

Close endpoint:

```text
PATCH /api/exams/:id/close
```

Example response:

```json
{
  "success": true,
  "message": "Exam closed successfully.",
  "exam": {
    "id": "1dd6ad9c-3823-434a-93a7-4a122e1d8dc2",
    "status": "CLOSED"
  }
}
```

Publish-results endpoint:

```text
PATCH /api/exams/:id/publish-results
```

Example response:

```json
{
  "success": true,
  "message": "Exam results published successfully.",
  "exam": {
    "id": "1dd6ad9c-3823-434a-93a7-4a122e1d8dc2",
    "status": "RESULTS_PUBLISHED"
  }
}
```

---

## 17. Question Type Values

```json
[
  "MULTIPLE_CHOICE",
  "TRUE_FALSE",
  "SHORT_ANSWER",
  "ESSAY",
  "CODE"
]
```

---

## 18. Create Multiple-Choice Question Request

Endpoint:

```text
POST /api/exams/:examId/questions
```

Example request:

```json
{
  "questionText": "Which SQL command returns rows from a table?",
  "type": "MULTIPLE_CHOICE",
  "points": 10,
  "position": 1,
  "correctAnswer": "SELECT",
  "options": [
    {
      "optionText": "SELECT",
      "isCorrect": true,
      "position": 1
    },
    {
      "optionText": "DELETE",
      "isCorrect": false,
      "position": 2
    },
    {
      "optionText": "DROP",
      "isCorrect": false,
      "position": 3
    }
  ]
}
```

---

## 19. Create True-or-False Question Request

```json
{
  "questionText": "A primary key may contain duplicate values.",
  "type": "TRUE_FALSE",
  "points": 5,
  "position": 2,
  "correctAnswer": "FALSE",
  "options": [
    {
      "optionText": "True",
      "isCorrect": false,
      "position": 1
    },
    {
      "optionText": "False",
      "isCorrect": true,
      "position": 2
    }
  ]
}
```

---

## 20. Create Written Question Request

```json
{
  "questionText": "Explain the purpose of database normalization.",
  "type": "ESSAY",
  "points": 20,
  "position": 3,
  "correctAnswer": null,
  "options": []
}
```

---

## 21. Lecturer Question Response

The lecturer may receive the full question model:

```json
{
  "id": "40a6c8e1-83cc-420e-9278-ea778282cbc1",
  "examId": "1dd6ad9c-3823-434a-93a7-4a122e1d8dc2",
  "questionText": "Which SQL command returns rows from a table?",
  "type": "MULTIPLE_CHOICE",
  "points": 10,
  "position": 1,
  "correctAnswer": "SELECT",
  "options": [
    {
      "id": "98f5ac92-9263-44fe-83db-b0657fc53bd3",
      "optionText": "SELECT",
      "isCorrect": true,
      "position": 1
    },
    {
      "id": "f9886df3-1338-4f80-bc75-aa20d17558df",
      "optionText": "DELETE",
      "isCorrect": false,
      "position": 2
    }
  ]
}
```

The full model is restricted to authorized lecturers and administrators.

---

## 22. Student-Safe Question Model

Students must not receive:

```text
correctAnswer
isCorrect
```

Example safe response:

```json
{
  "id": "40a6c8e1-83cc-420e-9278-ea778282cbc1",
  "questionText": "Which SQL command returns rows from a table?",
  "type": "MULTIPLE_CHOICE",
  "points": 10,
  "position": 1,
  "options": [
    {
      "id": "98f5ac92-9263-44fe-83db-b0657fc53bd3",
      "optionText": "SELECT",
      "position": 1
    },
    {
      "id": "f9886df3-1338-4f80-bc75-aa20d17558df",
      "optionText": "DELETE",
      "position": 2
    }
  ]
}
```

---

## 23. Available Exams Response

Endpoint:

```text
GET /api/student/exams/available
```

Example response:

```json
{
  "success": true,
  "count": 1,
  "exams": [
    {
      "id": "1dd6ad9c-3823-434a-93a7-4a122e1d8dc2",
      "title": "Database Systems Final Exam",
      "description": "Final examination.",
      "status": "PUBLISHED",
      "durationMinutes": 90,
      "startsAt": "2026-08-01T09:00:00.000Z",
      "endsAt": "2026-08-01T12:00:00.000Z",
      "lecturer": {
        "id": "fd0a63e7-7813-4c92-a9db-34f5ed529a42",
        "fullName": "Example Lecturer"
      }
    }
  ]
}
```

---

## 24. Start Exam Request

Endpoint:

```text
POST /api/student/exams/:examId/start
```

The request body may be empty:

```json
{}
```

Request metadata may also include:

- Authenticated student ID.
- Client IP address.
- User agent.

These values are normally obtained by the backend and are not trusted directly from the frontend.

---

## 25. Start Exam Response

```json
{
  "success": true,
  "message": "Exam started successfully.",
  "session": {
    "id": "b0a96baf-12ab-4cee-a30b-91013f228994",
    "examId": "1dd6ad9c-3823-434a-93a7-4a122e1d8dc2",
    "studentId": "4fb59e6f-a0bf-4d13-9323-78846b987195",
    "startedAt": "2026-08-01T09:05:00.000Z",
    "expiresAt": "2026-08-01T10:35:00.000Z",
    "endedAt": null
  },
  "submission": {
    "id": "c6ee89a3-24e5-4193-957d-7930788dd1b4",
    "examId": "1dd6ad9c-3823-434a-93a7-4a122e1d8dc2",
    "studentId": "4fb59e6f-a0bf-4d13-9323-78846b987195",
    "sessionId": "b0a96baf-12ab-4cee-a30b-91013f228994",
    "status": "IN_PROGRESS",
    "totalScore": null,
    "feedback": null
  }
}
```

---

## 26. Student Exam Details Response

Endpoint:

```text
GET /api/student/exams/:examId
```

Example response:

```json
{
  "success": true,
  "exam": {
    "id": "1dd6ad9c-3823-434a-93a7-4a122e1d8dc2",
    "title": "Database Systems Final Exam",
    "description": "Final examination.",
    "durationMinutes": 90,
    "startsAt": "2026-08-01T09:00:00.000Z",
    "endsAt": "2026-08-01T12:00:00.000Z",
    "questions": [
      {
        "id": "40a6c8e1-83cc-420e-9278-ea778282cbc1",
        "questionText": "Which SQL command returns rows?",
        "type": "MULTIPLE_CHOICE",
        "points": 10,
        "position": 1,
        "options": [
          {
            "id": "98f5ac92-9263-44fe-83db-b0657fc53bd3",
            "optionText": "SELECT",
            "position": 1
          },
          {
            "id": "f9886df3-1338-4f80-bc75-aa20d17558df",
            "optionText": "DELETE",
            "position": 2
          }
        ]
      }
    ]
  },
  "submission": {
    "id": "c6ee89a3-24e5-4193-957d-7930788dd1b4",
    "status": "IN_PROGRESS"
  },
  "session": {
    "startedAt": "2026-08-01T09:05:00.000Z",
    "expiresAt": "2026-08-01T10:35:00.000Z"
  }
}
```

---

## 27. Submission Status Values

```json
[
  "IN_PROGRESS",
  "SUBMITTED",
  "GRADED"
]
```

---

## 28. Auto-Save Request

Endpoint:

```text
PATCH /api/submissions/:submissionId/auto-save
```

Example request:

```json
{
  "answers": [
    {
      "questionId": "40a6c8e1-83cc-420e-9278-ea778282cbc1",
      "selectedOptionId": "98f5ac92-9263-44fe-83db-b0657fc53bd3",
      "answerText": null
    },
    {
      "questionId": "cb268300-a45f-46e7-817b-2cbdf9053f26",
      "selectedOptionId": null,
      "answerText": "Normalization reduces duplicated data and update anomalies."
    }
  ]
}
```

### Choice Answer

```json
{
  "questionId": "40a6c8e1-83cc-420e-9278-ea778282cbc1",
  "selectedOptionId": "98f5ac92-9263-44fe-83db-b0657fc53bd3",
  "answerText": null
}
```

### Written Answer

```json
{
  "questionId": "cb268300-a45f-46e7-817b-2cbdf9053f26",
  "selectedOptionId": null,
  "answerText": "Student written response."
}
```

---

## 29. Auto-Save Response

```json
{
  "success": true,
  "message": "Answers saved successfully.",
  "savedAt": "2026-08-01T09:30:00.000Z",
  "answerCount": 2
}
```

---

## 30. Answer Database Model

```json
{
  "id": "2dcbccbc-2f7a-43ec-b19a-7963152f93d2",
  "submissionId": "c6ee89a3-24e5-4193-957d-7930788dd1b4",
  "questionId": "40a6c8e1-83cc-420e-9278-ea778282cbc1",
  "selectedOptionId": "98f5ac92-9263-44fe-83db-b0657fc53bd3",
  "answerText": null,
  "score": null,
  "feedback": null,
  "createdAt": "2026-08-01T09:20:00.000Z",
  "updatedAt": "2026-08-01T09:30:00.000Z"
}
```

---

## 31. Submit Exam Request

Endpoint:

```text
POST /api/submissions/:submissionId/submit
```

The request body may be empty:

```json
{}
```

The backend obtains the submission ID from the URL and the student ID from the verified JWT.

---

## 32. Submit Exam Response

```json
{
  "success": true,
  "message": "Exam submitted successfully.",
  "submission": {
    "id": "c6ee89a3-24e5-4193-957d-7930788dd1b4",
    "examId": "1dd6ad9c-3823-434a-93a7-4a122e1d8dc2",
    "studentId": "4fb59e6f-a0bf-4d13-9323-78846b987195",
    "status": "SUBMITTED",
    "submittedAt": "2026-08-01T10:20:00.000Z",
    "totalScore": null,
    "feedback": null
  }
}
```

The backend should reject attempts to edit answers after final submission unless a specific authorized recovery process exists.

---

## 33. Student Submissions Response

Endpoint:

```text
GET /api/submissions/my
```

Example response:

```json
{
  "success": true,
  "count": 2,
  "submissions": [
    {
      "id": "c6ee89a3-24e5-4193-957d-7930788dd1b4",
      "examId": "1dd6ad9c-3823-434a-93a7-4a122e1d8dc2",
      "examTitle": "Database Systems Final Exam",
      "status": "SUBMITTED",
      "submittedAt": "2026-08-01T10:20:00.000Z",
      "totalScore": null,
      "resultsPublished": false
    },
    {
      "id": "949933a2-25ad-4896-a743-f72997508aa8",
      "examId": "72e1185a-e08b-4bfa-a210-1770ed3d2620",
      "examTitle": "Web Development Exam",
      "status": "GRADED",
      "submittedAt": "2026-07-10T09:40:00.000Z",
      "totalScore": 88,
      "resultsPublished": true
    }
  ]
}
```

---

## 34. Exam Submissions Response for Lecturer

Endpoint:

```text
GET /api/exams/:examId/submissions
```

Example response:

```json
{
  "success": true,
  "exam": {
    "id": "1dd6ad9c-3823-434a-93a7-4a122e1d8dc2",
    "title": "Database Systems Final Exam"
  },
  "count": 1,
  "submissions": [
    {
      "id": "c6ee89a3-24e5-4193-957d-7930788dd1b4",
      "student": {
        "id": "4fb59e6f-a0bf-4d13-9323-78846b987195",
        "fullName": "Example Student",
        "email": "student@example.com"
      },
      "status": "SUBMITTED",
      "submittedAt": "2026-08-01T10:20:00.000Z",
      "gradedAt": null,
      "totalScore": null
    }
  ]
}
```

---

## 35. Submission Details for Grading

Endpoint:

```text
GET /api/submissions/:id
```

Example response:

```json
{
  "success": true,
  "submission": {
    "id": "c6ee89a3-24e5-4193-957d-7930788dd1b4",
    "status": "SUBMITTED",
    "submittedAt": "2026-08-01T10:20:00.000Z",
    "student": {
      "id": "4fb59e6f-a0bf-4d13-9323-78846b987195",
      "fullName": "Example Student",
      "email": "student@example.com"
    },
    "exam": {
      "id": "1dd6ad9c-3823-434a-93a7-4a122e1d8dc2",
      "title": "Database Systems Final Exam"
    },
    "answers": [
      {
        "id": "2dcbccbc-2f7a-43ec-b19a-7963152f93d2",
        "question": {
          "id": "40a6c8e1-83cc-420e-9278-ea778282cbc1",
          "questionText": "Which SQL command returns rows?",
          "type": "MULTIPLE_CHOICE",
          "points": 10,
          "correctAnswer": "SELECT"
        },
        "selectedOption": {
          "id": "98f5ac92-9263-44fe-83db-b0657fc53bd3",
          "optionText": "SELECT",
          "isCorrect": true
        },
        "answerText": null,
        "score": null,
        "feedback": null
      }
    ]
  }
}
```

This detailed model is restricted to authorized lecturers and administrators.

---

## 36. Grade Answer Request

Endpoint:

```text
PATCH /api/answers/:answerId/grade
```

Example request:

```json
{
  "score": 8,
  "feedback": "Correct answer. Two points were removed for an incomplete explanation."
}
```

### Fields

| Field | Type | Required |
| --- | --- | --- |
| `score` | Number | Yes |
| `feedback` | String | No |

The score must be:

- Non-negative.
- No greater than the question's maximum points.

---

## 37. Grade Answer Response

```json
{
  "success": true,
  "message": "Answer graded successfully.",
  "answer": {
    "id": "2dcbccbc-2f7a-43ec-b19a-7963152f93d2",
    "score": 8,
    "feedback": "Correct answer. Two points were removed for an incomplete explanation.",
    "updatedAt": "2026-08-02T10:00:00.000Z"
  }
}
```

---

## 38. Grade Submission Request

Endpoint:

```text
PATCH /api/submissions/:id/grade
```

Example request:

```json
{
  "totalScore": 82,
  "feedback": "Good overall work. Review normalization and relational division."
}
```

---

## 39. Grade Submission Response

```json
{
  "success": true,
  "message": "Submission graded successfully.",
  "submission": {
    "id": "c6ee89a3-24e5-4193-957d-7930788dd1b4",
    "status": "GRADED",
    "totalScore": 82,
    "feedback": "Good overall work. Review normalization and relational division.",
    "gradedAt": "2026-08-02T10:15:00.000Z",
    "gradedBy": "fd0a63e7-7813-4c92-a9db-34f5ed529a42"
  }
}
```

---

## 40. Published Result Response

Endpoint:

```text
GET /api/submissions/:id/result
```

Example response:

```json
{
  "success": true,
  "result": {
    "submissionId": "c6ee89a3-24e5-4193-957d-7930788dd1b4",
    "status": "GRADED",
    "exam": {
      "id": "1dd6ad9c-3823-434a-93a7-4a122e1d8dc2",
      "title": "Database Systems Final Exam",
      "status": "RESULTS_PUBLISHED"
    },
    "student": {
      "id": "4fb59e6f-a0bf-4d13-9323-78846b987195",
      "fullName": "Example Student"
    },
    "totalScore": 82,
    "feedback": "Good overall work. Review normalization and relational division.",
    "submittedAt": "2026-08-01T10:20:00.000Z",
    "gradedAt": "2026-08-02T10:15:00.000Z",
    "answers": [
      {
        "questionId": "40a6c8e1-83cc-420e-9278-ea778282cbc1",
        "questionText": "Which SQL command returns rows?",
        "answerText": null,
        "selectedOptionText": "SELECT",
        "score": 10,
        "maximumPoints": 10,
        "feedback": "Correct."
      }
    ]
  }
}
```

The result is returned only when:

- The authenticated student owns the submission.
- The submission is graded.
- The exam status is `RESULTS_PUBLISHED`.

---

## 41. Notification Model

The database includes a notification foundation.

```json
{
  "id": "97ae225d-acd7-44a5-aa77-b38247871da6",
  "userId": "4fb59e6f-a0bf-4d13-9323-78846b987195",
  "title": "Exam Results Published",
  "message": "Your Database Systems Final Exam result is now available.",
  "isRead": false,
  "readAt": null,
  "createdAt": "2026-08-02T10:30:00.000Z"
}
```

The complete notification API and interface are not yet implemented.

---

## 42. Audit Log Model

The database includes an audit-log foundation.

```json
{
  "id": "28777ec1-a137-4214-ae7e-f4228722dc80",
  "userId": "fd0a63e7-7813-4c92-a9db-34f5ed529a42",
  "action": "EXAM_PUBLISHED",
  "entityType": "EXAM",
  "entityId": "1dd6ad9c-3823-434a-93a7-4a122e1d8dc2",
  "ipAddress": "192.0.2.10",
  "userAgent": "Mozilla/5.0",
  "metadata": {
    "previousStatus": "DRAFT",
    "newStatus": "PUBLISHED"
  },
  "createdAt": "2026-07-31T13:00:00.000Z"
}
```

The `metadata` property corresponds to PostgreSQL JSONB data.

---

## 43. Health Response

Endpoint:

```text
GET /health
```

Example response:

```json
{
  "status": "healthy",
  "service": "exam-management-backend",
  "timestamp": "2026-07-20T09:00:00.000Z"
}
```

---

## 44. Readiness Response

Endpoint:

```text
GET /ready
```

Example response:

```json
{
  "status": "ready",
  "service": "exam-management-backend",
  "timestamp": "2026-07-20T09:00:00.000Z"
}
```

---

## 45. Database Check Response

Endpoint:

```text
GET /api/db-check
```

Example successful response:

```json
{
  "success": true,
  "message": "Database connection successful.",
  "database": "connected"
}
```

Example failure response:

```json
{
  "success": false,
  "message": "Database connection failed.",
  "database": "disconnected"
}
```

The response must not include the database password or full connection string.

---

## 46. Authorization Error Response

Example missing-token response:

```json
{
  "success": false,
  "message": "Authentication is required."
}
```

Example invalid-role response:

```json
{
  "success": false,
  "message": "You are not authorized to perform this operation."
}
```

Example ownership error:

```json
{
  "success": false,
  "message": "You are not authorized to access this resource."
}
```

---

## 47. Not-Found Response

```json
{
  "success": false,
  "message": "The requested resource was not found."
}
```

Examples:

- Unknown exam.
- Unknown question.
- Unknown submission.
- Unknown answer.
- Unknown API route.

---

## 48. Conflict Response

Example duplicate exam-start response:

```json
{
  "success": false,
  "message": "A session already exists for this student and exam."
}
```

Example already-submitted response:

```json
{
  "success": false,
  "message": "This submission has already been submitted."
}
```

---

## 49. JSON Security Rules

The API must never return:

- `password_hash`
- Plain-text passwords
- `JWT_SECRET`
- Database credentials
- Kubernetes Secret values
- Private keys
- Internal stack traces in production
- Correct answers during an active student exam
- `isCorrect` during an active student exam

The API should return only the fields required by the current user and operation.

---

## 50. API and Database Naming

The API uses JavaScript-style camelCase:

```json
{
  "fullName": "Example User",
  "durationMinutes": 90,
  "startsAt": "2026-08-01T09:00:00.000Z",
  "totalScore": 82
}
```

PostgreSQL uses snake_case:

```text
full_name
duration_minutes
starts_at
total_score
```

The backend service layer maps database rows to API response objects.

---

## 51. Null Values

Some properties may be `null` until an operation is completed.

Example ungraded submission:

```json
{
  "status": "SUBMITTED",
  "totalScore": null,
  "feedback": null,
  "gradedAt": null,
  "gradedBy": null
}
```

Example unfinished session:

```json
{
  "startedAt": "2026-08-01T09:05:00.000Z",
  "expiresAt": "2026-08-01T10:35:00.000Z",
  "endedAt": null
}
```

---

## 52. Date and Time Format

API timestamps use ISO 8601 strings:

```text
2026-08-01T09:00:00.000Z
```

The backend and database should store timestamps consistently.

The frontend may convert UTC timestamps to the user's local display time.

---

## 53. Current JSON Model Limitations

The following items may require additional models in future development:

- Administrator user-management models.
- Notification API models.
- Audit-log API models.
- Real-time Socket.IO event models.
- Exam-monitoring event models.
- Analytics models.
- Pagination metadata.
- Search and filtering models.
- Production API versioning.
- Standardized error codes.