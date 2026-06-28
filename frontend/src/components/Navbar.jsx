import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const navByRole = {
  STUDENT: [
    { to: '/student/dashboard', label: 'Dashboard' },
    { to: '/student/exams', label: 'Exams' },
    { to: '/student/submissions', label: 'Submissions' },
  ],
  LECTURER: [
    { to: '/lecturer/dashboard', label: 'Dashboard' },
    { to: '/lecturer/exams', label: 'Exams' },
  ],
  ADMIN: [{ to: '/admin/dashboard', label: 'Dashboard' }],
}

function Navbar() {
  const { user, logout, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const links = user ? navByRole[user.role] || [] : []

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="navbar">
      <Link className="brand" to={user ? `/${user.role.toLowerCase()}/dashboard` : '/login'}>
        Exam Management
      </Link>

      <nav className="nav-links" aria-label="Primary navigation">
        {links.map((link) => (
          <NavLink key={link.to} to={link.to}>
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="nav-user">
        {isAuthenticated && user ? (
          <>
            <span>{user.fullName || user.email}</span>
            <span className="role-pill">{user.role}</span>
            <button type="button" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <NavLink to="/login">Login</NavLink>
        )}
      </div>
    </header>
  )
}

export default Navbar
