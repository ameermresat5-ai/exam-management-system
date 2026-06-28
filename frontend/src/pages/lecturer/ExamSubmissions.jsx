import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import api from '../../services/api'

function ExamSubmissions() {
  const { id } = useParams()
  const [submissions, setSubmissions] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadSubmissions = async () => {
      try {
        const response = await api.get(`/api/exams/${id}/submissions`)
        setSubmissions(response.data.data?.submissions || [])
      } catch (requestError) {
        setError(requestError.response?.data?.message || 'Could not load submissions.')
      } finally {
        setLoading(false)
      }
    }

    loadSubmissions()
  }, [id])

  return (
    <section className="page-panel">
      <h1>Exam Submissions</h1>
      {loading && <p>Loading submissions...</p>}
      {error && <div className="form-error">{error}</div>}
      <div className="list-stack">
        {submissions.map((submission) => (
          <article className="item-card" key={submission.id}>
            <h2>{submission.student?.fullName || submission.student?.email}</h2>
            <p>Status: {submission.status}</p>
            <Link to={`/lecturer/submissions/${submission.id}/grade`}>Grade</Link>
          </article>
        ))}
        {!loading && !error && submissions.length === 0 && <p>No submissions yet.</p>}
      </div>
    </section>
  )
}

export default ExamSubmissions
