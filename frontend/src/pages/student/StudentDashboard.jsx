import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

function StudentDashboard() {
  const { user } = useAuth()

  return (
    <section className="page-panel">
      <h1>Student Dashboard</h1>
      <p>Welcome, {user?.fullName || user?.email}.</p>
      <div className="quick-grid">
        <Link to="/student/exams">Available exams</Link>
        <Link to="/student/submissions">My submissions</Link>
      </div>
    </section>
  )
}

export default StudentDashboard
