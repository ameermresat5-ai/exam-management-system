import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'

function LecturerExams() {
  const [exams, setExams] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadExams = async () => {
      try {
        const response = await api.get('/api/exams/my')
        setExams(response.data.data || [])
      } catch (requestError) {
        setError(requestError.response?.data?.message || 'Could not load exams.')
      } finally {
        setLoading(false)
      }
    }

    loadExams()
  }, [])

  return (
    <section className="page-panel">
      <div className="page-heading-row">
        <h1>My Exams</h1>
        <Link className="button-link" to="/lecturer/exams/create">
          Create exam
        </Link>
      </div>
      {loading && <p>Loading exams...</p>}
      {error && <div className="form-error">{error}</div>}
      <div className="list-stack">
        {exams.map((exam) => (
          <article className="item-card" key={exam.id}>
            <h2>{exam.title}</h2>
            <p>Status: {exam.status}</p>
            <div className="inline-actions">
              <Link to={`/lecturer/exams/${exam.id}/questions`}>Questions</Link>
              <Link to={`/lecturer/exams/${exam.id}/submissions`}>Submissions</Link>
            </div>
          </article>
        ))}
        {!loading && !error && exams.length === 0 && <p>No exams created yet.</p>}
      </div>
    </section>
  )
}

export default LecturerExams
