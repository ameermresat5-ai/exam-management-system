import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

function LecturerDashboard() {
  const { user } = useAuth()

  return (
    <section className="page-panel">
      <div>
        <h1>Lecturer Dashboard</h1>
        <p>Welcome, {user?.fullName || user?.email}. Manage exams, questions, and submissions.</p>
      </div>

      <div className="quick-grid">
        <Link to="/lecturer/exams">My Exams</Link>
        <Link to="/lecturer/exams/create">Create Exam</Link>
      </div>
    </section>
  )
}

export default LecturerDashboard
