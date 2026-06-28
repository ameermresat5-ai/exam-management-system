import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

function LecturerDashboard() {
  const { user } = useAuth()

  return (
    <section className="page-panel">
      <h1>Lecturer Dashboard</h1>
      <p>Welcome, {user?.fullName || user?.email}.</p>
      <div className="quick-grid">
        <Link to="/lecturer/exams">My exams</Link>
        <Link to="/lecturer/exams/create">Create exam</Link>
      </div>
    </section>
  )
}

export default LecturerDashboard
