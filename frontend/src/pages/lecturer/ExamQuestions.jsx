import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import api from '../../services/api'

const QUESTION_TYPES = [
  'MULTIPLE_CHOICE',
  'TRUE_FALSE',
  'SHORT_ANSWER',
  'ESSAY',
  'CODE',
]

const isOptionQuestion = (type) => ['MULTIPLE_CHOICE', 'TRUE_FALSE'].includes(type)

const getDefaultOptions = (type) => {
  if (type === 'TRUE_FALSE') {
    return [
      { optionText: 'True', isCorrect: true, position: 1 },
      { optionText: 'False', isCorrect: false, position: 2 },
    ]
  }

  if (type === 'MULTIPLE_CHOICE') {
    return [
      { optionText: '', isCorrect: false, position: 1 },
      { optionText: '', isCorrect: false, position: 2 },
    ]
  }

  return []
}

const createInitialForm = (position = 1) => ({
  questionText: '',
  type: 'MULTIPLE_CHOICE',
  points: 1,
  position,
  correctAnswer: '',
  options: getDefaultOptions('MULTIPLE_CHOICE'),
})

function ExamQuestions() {
  const { id: examId } = useParams()
  const [questions, setQuestions] = useState([])
  const [form, setForm] = useState(createInitialForm)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const response = await api.get(`/api/exams/${examId}/questions`)
        const loadedQuestions = response.data.data || []
        setQuestions(loadedQuestions)
        setForm(createInitialForm(loadedQuestions.length + 1))
      } catch (requestError) {
        setError(requestError.response?.data?.message || 'Could not load questions.')
      } finally {
        setLoading(false)
      }
    }

    loadQuestions()
  }, [examId])

  const handleFieldChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleTypeChange = (event) => {
    const nextType = event.target.value
    setForm((current) => ({
      ...current,
      type: nextType,
      options: getDefaultOptions(nextType),
    }))
  }

  const updateOption = (index, field, value) => {
    setForm((current) => ({
      ...current,
      options: current.options.map((option, optionIndex) =>
        optionIndex === index ? { ...option, [field]: value } : option,
      ),
    }))
  }

  const addOption = () => {
    setForm((current) => ({
      ...current,
      options: [
        ...current.options,
        { optionText: '', isCorrect: false, position: current.options.length + 1 },
      ],
    }))
  }

  const removeOption = (index) => {
    setForm((current) => ({
      ...current,
      options: current.options
        .filter((_, optionIndex) => optionIndex !== index)
        .map((option, optionIndex) => ({ ...option, position: optionIndex + 1 })),
    }))
  }

  const buildPayload = () => {
    const payload = {
      questionText: form.questionText.trim(),
      type: form.type,
      points: Number(form.points),
      position: Number(form.position),
      correctAnswer: form.correctAnswer.trim() || null,
    }

    if (isOptionQuestion(form.type)) {
      payload.options = form.options.map((option) => ({
        optionText: option.optionText.trim(),
        isCorrect: Boolean(option.isCorrect),
        position: Number(option.position),
      }))
    }

    return payload
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSuccess('')
    setSubmitting(true)

    try {
      const response = await api.post(`/api/exams/${examId}/questions`, buildPayload())
      const createdQuestion = response.data.data
      setQuestions((current) => [...current, createdQuestion].sort((a, b) => a.position - b.position))
      setForm(createInitialForm(Number(form.position) + 1))
      setSuccess('Question created successfully.')
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not create question.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="page-panel">
      <div className="page-heading-row">
        <div>
          <h1>Exam Questions</h1>
          <p>Build the question set for this exam.</p>
        </div>
        <Link className="text-link" to="/lecturer/exams">
          Back to exams
        </Link>
      </div>

      {loading && <p>Loading questions...</p>}
      {error && <div className="form-error">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <div className="question-layout">
        <div className="list-stack">
          <h2>Questions</h2>
          {!loading && questions.length === 0 && <p>No questions added yet.</p>}

          {questions.map((question) => (
            <article className="item-card" key={question.id}>
              <div className="question-meta">
                <span>#{question.position}</span>
                <span>{question.type}</span>
                <span>{question.points} points</span>
              </div>
              <h2>{question.questionText}</h2>
              {question.correctAnswer && <p>Correct answer: {question.correctAnswer}</p>}

              {question.options?.length > 0 && (
                <ul className="option-list">
                  {question.options.map((option) => (
                    <li key={option.id || `${question.id}-${option.position}`}>
                      <span>{option.position}. {option.optionText}</span>
                      {option.isCorrect && <strong>Correct</strong>}
                    </li>
                  ))}
                </ul>
              )}
            </article>
          ))}
        </div>

        <form className="item-card stacked-form" onSubmit={handleSubmit}>
          <h2>Add Question</h2>

          <label>
            Question text
            <textarea
              name="questionText"
              value={form.questionText}
              onChange={handleFieldChange}
              required
            />
          </label>

          <div className="form-grid three-columns">
            <label>
              Type
              <select name="type" value={form.type} onChange={handleTypeChange} required>
                {QUESTION_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Points
              <input
                name="points"
                type="number"
                min="0.5"
                step="0.5"
                value={form.points}
                onChange={handleFieldChange}
                required
              />
            </label>

            <label>
              Position
              <input
                name="position"
                type="number"
                min="1"
                value={form.position}
                onChange={handleFieldChange}
                required
              />
            </label>
          </div>

          <label>
            Correct answer
            <input
              name="correctAnswer"
              value={form.correctAnswer}
              onChange={handleFieldChange}
              placeholder="Optional for manual grading questions"
            />
          </label>

          {isOptionQuestion(form.type) && (
            <div className="options-editor">
              <div className="page-heading-row compact-row">
                <h2>Options</h2>
                {form.type === 'MULTIPLE_CHOICE' && (
                  <button type="button" className="secondary-button" onClick={addOption}>
                    Add Option
                  </button>
                )}
              </div>

              <div className="list-stack">
                {form.options.map((option, index) => (
                  <div className="option-editor-row" key={`${form.type}-${index}`}>
                    <label>
                      Option text
                      <input
                        value={option.optionText}
                        onChange={(event) => updateOption(index, 'optionText', event.target.value)}
                        required
                      />
                    </label>

                    <label>
                      Position
                      <input
                        type="number"
                        min="1"
                        value={option.position}
                        onChange={(event) =>
                          updateOption(index, 'position', Number(event.target.value))
                        }
                        required
                      />
                    </label>

                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={option.isCorrect}
                        onChange={(event) => updateOption(index, 'isCorrect', event.target.checked)}
                      />
                      Correct
                    </label>

                    {form.type === 'MULTIPLE_CHOICE' && form.options.length > 2 && (
                      <button
                        type="button"
                        className="secondary-button"
                        onClick={() => removeOption(index)}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <button type="submit" disabled={submitting}>
            {submitting ? 'Adding...' : 'Add Question'}
          </button>
        </form>
      </div>
    </section>
  )
}

export default ExamQuestions
