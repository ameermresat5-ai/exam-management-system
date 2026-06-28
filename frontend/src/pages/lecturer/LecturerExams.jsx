import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'

const formatDate = (value) => {
  if (!value) {
    return 'Not set'
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

const getErrorMessage = (error, fallback) => {
  return error.response?.data?.message || fallback
}

function LecturerExams() {
  const [exams, setExams] = useState([])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState('')

  useEffect(() => {
    const loadExams = async () => {
      try {
        const response = await api.get('/api/exams/my')
        setExams(response.data.data || [])
      } catch (requestError) {
        setError(getErrorMessage(requestError, 'Could not load exams.'))
      } finally {
        setLoading(false)
      }
    }

    loadExams()
  }, [])

  const updateExamStatus = async (examId, actionPath, message) => {
    setError('')
    setSuccess('')
    setUpdatingId(examId)

    try {
      const response = await api.patch(`/api/exams/${examId}/${actionPath}`)
      const updatedExam = response.data.data
      setExams((current) => current.map((exam) => (exam.id === examId ? updatedExam : exam)))
      setSuccess(message)
    } catch (requestError) {
      setError(getErrorMessage(requestError, 'Could not update exam status.'))
    } finally {
      setUpdatingId('')
    }
  }

  const renderStatusAction = (exam) => {
    if (exam.status === 'DRAFT') {
      return (
        <button
          type="button"
          onClick={() => updateExamStatus(exam.id, 'publish', 'Exam published successfully.')}
          disabled={updatingId === exam.id}
        >
          Publish Exam
        </button>
      )
    }

    if (exam.status === 'PUBLISHED') {
      return (
        <button
          type="button"
          onClick={() => updateExamStatus(exam.id, 'close', 'Exam closed successfully.')}
          disabled={updatingId === exam.id}
        >
          Close Exam
        </button>
      )
    }

    if (exam.status === 'CLOSED') {
      return (
        <button
          type="button"
          onClick={() =>
            updateExamStatus(exam.id, 'publish-results', 'Exam results published successfully.')
          }
          disabled={updatingId === exam.id}
        >
          Publish Results
        </button>
      )
    }

    return null
  }

  return (
    <section className="page-panel">
      <div className="page-heading-row">
        <div>
          <h1>My Exams</h1>
          <p>Review exam status and continue exam setup.</p>
        </div>
        <Link className="button-link" to="/lecturer/exams/create">
          Create Exam
        </Link>
      </div>

      {loading && <p>Loading exams...</p>}
      {error && <div className="form-error">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      {!loading && !error && exams.length === 0 && <p>No exams created yet.</p>}

      {exams.length > 0 && (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Duration</th>
                <th>Starts</th>
                <th>Ends</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {exams.map((exam) => (
                <tr key={exam.id}>
                  <td>
                    <strong>{exam.title}</strong>
                    {exam.description && <span className="table-note">{exam.description}</span>}
                  </td>
                  <td>
                    <span className="status-badge">{exam.status}</span>
                  </td>
                  <td>{exam.durationMinutes} minutes</td>
                  <td>{formatDate(exam.startsAt)}</td>
                  <td>{formatDate(exam.endsAt)}</td>
                  <td>
                    <div className="inline-actions wrap-actions">
                      <Link to={`/lecturer/exams/${exam.id}/questions`}>Manage Questions</Link>
                      <Link to={`/lecturer/exams/${exam.id}/submissions`}>View Submissions</Link>
                      {renderStatusAction(exam)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

export default LecturerExams
