import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../../services/api'

function GradeSubmission() {
  const { id } = useParams()
  const [submission, setSubmission] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadSubmission = async () => {
      try {
        const response = await api.get(`/api/submissions/${id}`)
        setSubmission(response.data.data)
      } catch (requestError) {
        setError(requestError.response?.data?.message || 'Could not load submission.')
      } finally {
        setLoading(false)
      }
    }

    loadSubmission()
  }, [id])

  return (
    <section className="page-panel">
      <h1>Grade Submission</h1>
      {loading && <p>Loading submission...</p>}
      {error && <div className="form-error">{error}</div>}
      {submission && (
        <div className="list-stack">
          <article className="item-card">
            <h2>{submission.student?.fullName || submission.student?.email}</h2>
            <p>Exam: {submission.exam?.title}</p>
            <p>Status: {submission.submission?.status}</p>
          </article>
        </div>
      )}
    </section>
  )
}

export default GradeSubmission
