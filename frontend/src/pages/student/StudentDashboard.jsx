import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

function StudentDashboard() {
  const { user } = useAuth()

  return (
    <section className="page-panel">
      <div>
        <h1>Student Dashboard</h1>
        <p>Welcome, {user?.fullName || user?.email}. Start exams and review your submissions.</p>
      </div>

      <div className="quick-grid">
        <Link to="/student/exams">Available Exams</Link>
        <Link to="/student/submissions">My Submissions</Link>
      </div>
    </section>
  )
}

export default StudentDashboard
