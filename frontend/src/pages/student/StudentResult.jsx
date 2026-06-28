import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../../services/api'

function StudentResult() {
  const { submissionId } = useParams()
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadResult = async () => {
      try {
        const response = await api.get(`/api/submissions/${submissionId}/result`)
        setResult(response.data.data)
      } catch (requestError) {
        setError(requestError.response?.data?.message || 'Could not load result.')
      } finally {
        setLoading(false)
      }
    }

    loadResult()
  }, [submissionId])

  return (
    <section className="page-panel">
      <h1>Submission Result</h1>
      {loading && <p>Loading result...</p>}
      {error && <div className="form-error">{error}</div>}
      {result && (
        <div className="item-card">
          <h2>{result.submission.exam?.title || 'Exam result'}</h2>
          <p>Status: {result.submission.status}</p>
          <p>Total score: {result.submission.totalScore ?? 0}</p>
        </div>
      )}
    </section>
  )
}

export default StudentResult
