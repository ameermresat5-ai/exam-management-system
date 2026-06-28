import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'

const getStorageKey = (examId) => `student_exam_submission_${examId}`

const formatDate = (value) => {
  if (!value) {
    return 'Not set'
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

function StudentExams() {
  const navigate = useNavigate()
  const [exams, setExams] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [startingId, setStartingId] = useState('')

  useEffect(() => {
    const loadExams = async () => {
      try {
        const response = await api.get('/api/student/exams/available')
        setExams(response.data.data || [])
      } catch (requestError) {
        setError(requestError.response?.data?.message || 'Could not load exams.')
      } finally {
        setLoading(false)
      }
    }

    loadExams()
  }, [])

  const handleStartExam = async (examId) => {
    setError('')
    setStartingId(examId)

    try {
      const response = await api.post(`/api/student/exams/${examId}/start`)
      const submissionId = response.data.data?.submissionId || response.data.data?.submission?.id

      if (submissionId) {
        localStorage.setItem(getStorageKey(examId), submissionId)
      }

      navigate(`/student/exams/${examId}/take`, { state: { submissionId } })
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not start exam.')
    } finally {
      setStartingId('')
    }
  }

  return (
    <section className="page-panel">
      <div>
        <h1>Available Exams</h1>
        <p>Choose a published exam and start when it is available.</p>
      </div>

      {loading && <p>Loading exams...</p>}
      {error && <div className="form-error">{error}</div>}
      {!loading && !error && exams.length === 0 && <p>No available exams.</p>}

      <div className="exam-card-grid">
        {exams.map((exam) => (
          <article className="item-card" key={exam.id}>
            <div className="page-heading-row compact-row">
              <h2>{exam.title}</h2>
              <span className={exam.isAvailable ? 'status-badge available' : 'status-badge muted'}>
                {exam.isAvailable ? 'Available now' : 'Not available now'}
              </span>
            </div>

            <p>{exam.description || 'No description provided.'}</p>

            <div className="detail-grid">
              <span>Duration: {exam.durationMinutes} minutes</span>
              <span>Starts: {formatDate(exam.startsAt)}</span>
              <span>Ends: {formatDate(exam.endsAt)}</span>
            </div>

            <button
              type="button"
              onClick={() => handleStartExam(exam.id)}
              disabled={!exam.isAvailable || startingId === exam.id}
            >
              {startingId === exam.id ? 'Starting...' : 'Start Exam'}
            </button>
          </article>
        ))}
      </div>
    </section>
  )
}

export default StudentExams
