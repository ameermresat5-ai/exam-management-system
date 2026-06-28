import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import api from '../../services/api'

const TEXT_QUESTION_TYPES = ['SHORT_ANSWER', 'ESSAY', 'CODE']

const getStorageKey = (examId) => `student_exam_submission_${examId}`

const buildInitialAnswers = (questions) => {
  return questions.reduce((current, question) => {
    current[question.id] = {
      selectedOptionId: '',
      answerText: '',
    }
    return current
  }, {})
}

function StudentTakeExam() {
  const { id: examId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [exam, setExam] = useState(null)
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState({})
  const [submissionId, setSubmissionId] = useState(() =>
    location.state?.submissionId || localStorage.getItem(getStorageKey(examId)),
  )
  const [submissionStatus, setSubmissionStatus] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    const loadExam = async () => {
      setLoading(true)
      setError('')

      try {
        const [startResponse, examResponse] = await Promise.all([
          api.post(`/api/student/exams/${examId}/start`),
          api.get(`/api/student/exams/${examId}`),
        ])

        const startData = startResponse.data.data
        const nextSubmissionId = startData?.submissionId || startData?.submission?.id

        if (nextSubmissionId) {
          localStorage.setItem(getStorageKey(examId), nextSubmissionId)
          setSubmissionId(nextSubmissionId)
        }

        setSubmissionStatus(startData?.submission?.status || '')
        setExam(examResponse.data.data?.exam || null)
        setQuestions(examResponse.data.data?.questions || [])
        setAnswers(buildInitialAnswers(examResponse.data.data?.questions || []))
      } catch (requestError) {
        setError(requestError.response?.data?.message || 'Could not load exam.')
      } finally {
        setLoading(false)
      }
    }

    loadExam()
  }, [examId])

  const updateSelectedOption = (questionId, selectedOptionId) => {
    setAnswers((current) => ({
      ...current,
      [questionId]: {
        ...(current[questionId] || {}),
        selectedOptionId,
      },
    }))
  }

  const updateAnswerText = (questionId, answerText) => {
    setAnswers((current) => ({
      ...current,
      [questionId]: {
        ...(current[questionId] || {}),
        answerText,
      },
    }))
  }

  const buildAnswerPayload = () => {
    return questions.map((question) => {
      const answer = answers[question.id] || {}

      return {
        questionId: question.id,
        selectedOptionId: answer.selectedOptionId || null,
        answerText: TEXT_QUESTION_TYPES.includes(question.type) ? answer.answerText || null : null,
      }
    })
  }

  const saveAnswers = async () => {
    if (!submissionId) {
      throw new Error('Submission was not started yet.')
    }

    const response = await api.patch(`/api/submissions/${submissionId}/auto-save`, {
      answers: buildAnswerPayload(),
    })

    return response.data.data
  }

  const handleSave = async () => {
    setError('')
    setSuccess('')
    setSaving(true)

    try {
      await saveAnswers()
      setSuccess('Answers saved successfully.')
    } catch (requestError) {
      setError(requestError.response?.data?.message || requestError.message || 'Could not save answers.')
    } finally {
      setSaving(false)
    }
  }

  const handleSubmit = async () => {
    setError('')
    setSuccess('')
    setSubmitting(true)

    try {
      await saveAnswers()
      await api.post(`/api/submissions/${submissionId}/submit`)
      localStorage.removeItem(getStorageKey(examId))
      navigate('/student/submissions')
    } catch (requestError) {
      setError(requestError.response?.data?.message || requestError.message || 'Could not submit exam.')
    } finally {
      setSubmitting(false)
    }
  }

  const renderQuestionInput = (question) => {
    const answer = answers[question.id] || {}

    if (['MULTIPLE_CHOICE', 'TRUE_FALSE'].includes(question.type)) {
      return (
        <div className="answer-options">
          {question.options.map((option) => (
            <label className="radio-option" key={option.id}>
              <input
                type="radio"
                name={question.id}
                value={option.id}
                checked={answer.selectedOptionId === option.id}
                onChange={() => updateSelectedOption(question.id, option.id)}
                disabled={!canEdit}
              />
              <span>{option.optionText}</span>
            </label>
          ))}
        </div>
      )
    }

    return (
      <textarea
        className={question.type === 'CODE' ? 'code-textarea' : undefined}
        value={answer.answerText || ''}
        onChange={(event) => updateAnswerText(question.id, event.target.value)}
        disabled={!canEdit}
        placeholder={question.type === 'CODE' ? 'Write your code answer here' : 'Write your answer here'}
      />
    )
  }

  const canEdit = submissionStatus === 'IN_PROGRESS'

  return (
    <section className="page-panel">
      <div className="page-heading-row">
        <div>
          <h1>{exam?.title || 'Take Exam'}</h1>
          {exam && <p>{exam.description || 'Answer each question and save your progress.'}</p>}
        </div>
        <Link className="text-link" to="/student/exams">
          Back to exams
        </Link>
      </div>

      {loading && <p>Loading exam...</p>}
      {error && <div className="form-error">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      {!loading && submissionStatus && !canEdit && (
        <div className="form-error">This submission is {submissionStatus}. Answers can no longer be edited.</div>
      )}

      {!loading && questions.length === 0 && !error && <p>No questions are available for this exam.</p>}

      {questions.length > 0 && (
        <div className="take-exam-layout">
          {questions.map((question) => (
            <article className="item-card" key={question.id}>
              <div className="question-meta">
                <span>#{question.position}</span>
                <span>{question.type}</span>
                <span>{question.points} points</span>
              </div>
              <h2>{question.questionText}</h2>
              {renderQuestionInput(question)}
            </article>
          ))}

          <div className="take-actions">
            <button type="button" onClick={handleSave} disabled={!canEdit || saving || submitting}>
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button type="button" onClick={handleSubmit} disabled={!canEdit || saving || submitting}>
              {submitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </div>
      )}
    </section>
  )
}

export default StudentTakeExam
