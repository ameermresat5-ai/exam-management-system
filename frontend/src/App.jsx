import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Unauthorized from './pages/auth/Unauthorized'
import AdminDashboard from './pages/admin/AdminDashboard'
import StudentDashboard from './pages/student/StudentDashboard'
import StudentExams from './pages/student/StudentExams'
import StudentResult from './pages/student/StudentResult'
import StudentSubmissions from './pages/student/StudentSubmissions'
import LecturerDashboard from './pages/lecturer/LecturerDashboard'
import LecturerExams from './pages/lecturer/LecturerExams'
import CreateExam from './pages/lecturer/CreateExam'
import ExamQuestions from './pages/lecturer/ExamQuestions'
import ExamSubmissions from './pages/lecturer/ExamSubmissions'
import GradeSubmission from './pages/lecturer/GradeSubmission'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      <Route element={<Layout />}>
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route element={<ProtectedRoute roles={["STUDENT"]} />}>
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/exams" element={<StudentExams />} />
          <Route path="/student/submissions" element={<StudentSubmissions />} />
          <Route path="/student/results/:submissionId" element={<StudentResult />} />
        </Route>

        <Route element={<ProtectedRoute roles={["LECTURER"]} />}>
          <Route path="/lecturer/dashboard" element={<LecturerDashboard />} />
          <Route path="/lecturer/exams" element={<LecturerExams />} />
          <Route path="/lecturer/exams/create" element={<CreateExam />} />
          <Route path="/lecturer/exams/:id/questions" element={<ExamQuestions />} />
          <Route path="/lecturer/exams/:id/submissions" element={<ExamSubmissions />} />
          <Route path="/lecturer/submissions/:id/grade" element={<GradeSubmission />} />
        </Route>

        <Route element={<ProtectedRoute roles={["ADMIN"]} />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App
