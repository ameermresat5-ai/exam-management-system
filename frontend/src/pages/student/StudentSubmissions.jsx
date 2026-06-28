import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'

const formatDate = (value) => {
  if (!value) {
    return 'Not submitted'
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

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
      <div>
        <h1>My Submissions</h1>
        <p>Track submitted exams and view results when they are published.</p>
      </div>

      {loading && <p>Loading submissions...</p>}
      {error && <div className="form-error">{error}</div>}
      {!loading && !error && submissions.length === 0 && <p>No submissions yet.</p>}

      {submissions.length > 0 && (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Exam</th>
                <th>Submission Status</th>
                <th>Submitted</th>
                <th>Total Score</th>
                <th>Result</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((submission) => {
                const resultAvailable = submission.exam?.status === 'RESULTS_PUBLISHED'

                return (
                  <tr key={submission.id}>
                    <td>
                      <strong>{submission.exam?.title || 'Exam'}</strong>
                      <span className="table-note">Exam status: {submission.exam?.status || 'Unknown'}</span>
                    </td>
                    <td>
                      <span className="status-badge">{submission.status}</span>
                    </td>
                    <td>{formatDate(submission.submittedAt)}</td>
                    <td>{submission.totalScore ?? 'Pending'}</td>
                    <td>
                      {resultAvailable ? (
                        <Link to={`/student/results/${submission.id}`}>View Result</Link>
                      ) : (
                        <span className="muted-text">Not published</span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

export default StudentSubmissions
