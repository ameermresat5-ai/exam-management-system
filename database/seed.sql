-- Demo seed data for Full Stack Exam Management System
-- Compatible with database/schema.sql

INSERT INTO users (id, full_name, email, password_hash, role, is_active)
VALUES
  (
    '11111111-1111-1111-1111-111111111111',
    'Admin User',
    'admin@example.com',
    '$2b$10$examplebcryptpasswordhashforadminuser123456789',
    'ADMIN',
    TRUE
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    'Lecturer Demo',
    'lecturer@example.com',
    '$2b$10$examplebcryptpasswordhashforlectureruser123456',
    'LECTURER',
    TRUE
  ),
  (
    '33333333-3333-3333-3333-333333333333',
    'Student Demo',
    'student@example.com',
    '$2b$10$examplebcryptpasswordhashforstudentuser1234567',
    'STUDENT',
    TRUE
  )
ON CONFLICT (email) DO NOTHING;

INSERT INTO exams (
  id,
  lecturer_id,
  title,
  description,
  status,
  duration_minutes,
  starts_at,
  ends_at
)
VALUES (
  '44444444-4444-4444-4444-444444444444',
  '22222222-2222-2222-2222-222222222222',
  'JavaScript Basics Exam',
  'Demo exam for testing the Full Stack Exam Management System.',
  'PUBLISHED',
  60,
  NOW() - INTERVAL '1 hour',
  NOW() + INTERVAL '7 days'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO questions (
  id,
  exam_id,
  question_text,
  type,
  points,
  position,
  correct_answer
)
VALUES
  (
    '55555555-5555-5555-5555-555555555555',
    '44444444-4444-4444-4444-444444444444',
    'Which keyword is used to declare a constant in JavaScript?',
    'MULTIPLE_CHOICE',
    10,
    1,
    'const'
  ),
  (
    '66666666-6666-6666-6666-666666666666',
    '44444444-4444-4444-4444-444444444444',
    'JavaScript runs only in the browser.',
    'TRUE_FALSE',
    10,
    2,
    'false'
  ),
  (
    '77777777-7777-7777-7777-777777777777',
    '44444444-4444-4444-4444-444444444444',
    'Explain the difference between let and const.',
    'SHORT_ANSWER',
    20,
    3,
    'let can be reassigned, const cannot be reassigned.'
  )
ON CONFLICT (id) DO NOTHING;

INSERT INTO question_options (
  id,
  question_id,
  option_text,
  is_correct,
  position
)
VALUES
  (
    '88888888-8888-8888-8888-888888888881',
    '55555555-5555-5555-5555-555555555555',
    'var',
    FALSE,
    1
  ),
  (
    '88888888-8888-8888-8888-888888888882',
    '55555555-5555-5555-5555-555555555555',
    'let',
    FALSE,
    2
  ),
  (
    '88888888-8888-8888-8888-888888888883',
    '55555555-5555-5555-5555-555555555555',
    'const',
    TRUE,
    3
  ),
  (
    '88888888-8888-8888-8888-888888888884',
    '55555555-5555-5555-5555-555555555555',
    'static',
    FALSE,
    4
  ),
  (
    '99999999-9999-9999-9999-999999999991',
    '66666666-6666-6666-6666-666666666666',
    'True',
    FALSE,
    1
  ),
  (
    '99999999-9999-9999-9999-999999999992',
    '66666666-6666-6666-6666-666666666666',
    'False',
    TRUE,
    2
  )
ON CONFLICT (id) DO NOTHING;

INSERT INTO exam_sessions (
  id,
  exam_id,
  student_id,
  started_at,
  expires_at
)
VALUES (
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  '44444444-4444-4444-4444-444444444444',
  '33333333-3333-3333-3333-333333333333',
  NOW() - INTERVAL '30 minutes',
  NOW() + INTERVAL '30 minutes'
)
ON CONFLICT (exam_id, student_id) DO NOTHING;

INSERT INTO submissions (
  id,
  exam_id,
  student_id,
  session_id,
  status,
  submitted_at,
  total_score,
  feedback
)
VALUES (
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  '44444444-4444-4444-4444-444444444444',
  '33333333-3333-3333-3333-333333333333',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'SUBMITTED',
  NOW(),
  20,
  'Good demo submission.'
)
ON CONFLICT (exam_id, student_id) DO NOTHING;

INSERT INTO answers (
  id,
  submission_id,
  question_id,
  selected_option_id,
  answer_text,
  score,
  feedback
)
VALUES
  (
    'cccccccc-cccc-cccc-cccc-ccccccccccc1',
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    '55555555-5555-5555-5555-555555555555',
    '88888888-8888-8888-8888-888888888883',
    'const',
    10,
    'Correct answer.'
  ),
  (
    'cccccccc-cccc-cccc-cccc-ccccccccccc2',
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    '66666666-6666-6666-6666-666666666666',
    '99999999-9999-9999-9999-999999999992',
    'False',
    10,
    'Correct answer.'
  ),
  (
    'cccccccc-cccc-cccc-cccc-ccccccccccc3',
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    '77777777-7777-7777-7777-777777777777',
    NULL,
    'let can change value, const cannot be reassigned.',
    NULL,
    'Needs manual grading.'
  )
ON CONFLICT (id) DO NOTHING;

INSERT INTO notifications (
  id,
  user_id,
  title,
  message,
  is_read
)
VALUES
  (
    'dddddddd-dddd-dddd-dddd-dddddddddddd',
    '33333333-3333-3333-3333-333333333333',
    'Exam Submitted',
    'Your JavaScript Basics Exam submission was received.',
    FALSE
  )
ON CONFLICT (id) DO NOTHING;

INSERT INTO audit_logs (
  id,
  user_id,
  action,
  entity_type,
  entity_id,
  metadata
)
VALUES
  (
    'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
    '22222222-2222-2222-2222-222222222222',
    'CREATE_EXAM',
    'exam',
    '44444444-4444-4444-4444-444444444444',
    '{"source": "seed.sql"}'::jsonb
  )
ON CONFLICT (id) DO NOTHING;
