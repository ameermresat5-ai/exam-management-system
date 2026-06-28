import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
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

  const submission = result?.submission
  const answers = result?.answers || []

  return (
    <section className="page-panel">
      <div className="page-heading-row">
        <div>
          <h1>Submission Result</h1>
          <p>Review your score, feedback, and submitted answers.</p>
        </div>
        <Link className="text-link" to="/student/submissions">
          Back to submissions
        </Link>
      </div>

      {loading && <p>Loading result...</p>}
      {error && <div className="form-error">{error}</div>}

      {submission && (
        <>
          <article className="item-card result-summary">
            <h2>{submission.exam?.title || 'Exam result'}</h2>
            <div className="detail-grid">
              <span>Status: {submission.status}</span>
              <span>Total score: {submission.totalScore ?? 0}</span>
            </div>
            {submission.feedback && <p>Feedback: {submission.feedback}</p>}
          </article>

          <div className="list-stack">
            <h2>Answers</h2>
            {answers.map((answer) => (
              <article className="item-card" key={answer.id}>
                <div className="question-meta">
                  <span>#{answer.position}</span>
                  <span>{answer.type}</span>
                  <span>{answer.points} points</span>
                </div>
                <h2>{answer.questionText}</h2>
                <p>
                  Your answer:{' '}
                  {answer.selectedOptionText || answer.answerText || 'No answer submitted'}
                </p>
                <p>Score: {answer.score ?? 'Pending manual grading'}</p>
                {answer.feedback && <p>Feedback: {answer.feedback}</p>}
              </article>
            ))}
          </div>
        </>
      )}
    </section>
  )
}

export default StudentResult
