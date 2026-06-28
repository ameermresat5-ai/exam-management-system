import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'

function StudentSubmissions() {
  const [submissions, setSubmissions] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadSubmissions = async () => {
      try {
        const response = await api.get('/api/submissions/my')
        setSubmissions(response.data.data || [])
      } catch (requestError) {
        setError(requestError.response?.data?.message || 'Could not load submissions.')
      } finally {
        setLoading(false)
      }
    }

    loadSubmissions()
  }, [])

  return (
    <section className="page-panel">
      <h1>My Submissions</h1>
      {loading && <p>Loading submissions...</p>}
      {error && <div className="form-error">{error}</div>}
      <div className="list-stack">
        {submissions.map((submission) => (
          <article className="item-card" key={submission.id}>
            <h2>{submission.exam?.title || 'Exam'}</h2>
            <p>Status: {submission.status}</p>
            <Link to={`/student/results/${submission.id}`}>View result</Link>
          </article>
        ))}
        {!loading && !error && submissions.length === 0 && <p>No submissions yet.</p>}
      </div>
    </section>
  )
}

export default StudentSubmissions
