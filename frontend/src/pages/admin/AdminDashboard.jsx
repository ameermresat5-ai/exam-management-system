import { useAuth } from '../../context/AuthContext'

function AdminDashboard() {
  const { user } = useAuth()

  return (
    <section className="page-panel">
      <h1>Admin Dashboard</h1>
      <p>Welcome, {user?.fullName || user?.email}.</p>
      <div className="item-card">System administration workspace.</div>
    </section>
  )
}

export default AdminDashboard
