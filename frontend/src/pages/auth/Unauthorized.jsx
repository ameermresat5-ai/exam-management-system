import { Link } from 'react-router-dom'

function Unauthorized() {
  return (
    <section className="page-panel narrow">
      <h1>Unauthorized</h1>
      <p>Your account does not have access to this page.</p>
      <Link className="button-link" to="/login">
        Back to login
      </Link>
    </section>
  )
}

export default Unauthorized
