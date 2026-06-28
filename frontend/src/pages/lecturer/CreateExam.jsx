import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../../services/api'

const toIsoOrNull = (value) => {
  if (!value) {
    return null
  }

  return new Date(value).toISOString()
}

function CreateExam() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    title: '',
    description: '',
    durationMinutes: 60,
    startsAt: '',
    endsAt: '',
  })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (form.startsAt && form.endsAt && new Date(form.endsAt) <= new Date(form.startsAt)) {
      setError('End date must be after start date.')
      return
    }

    setSubmitting(true)

    try {
      await api.post('/api/exams', {
        title: form.title.trim(),
        description: form.description.trim() || null,
        durationMinutes: Number(form.durationMinutes),
        startsAt: toIsoOrNull(form.startsAt),
        endsAt: toIsoOrNull(form.endsAt),
      })
      navigate('/lecturer/exams')
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not create exam.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="page-panel narrow">
      <div className="page-heading-row">
        <div>
          <h1>Create Exam</h1>
          <p>Add the core exam details. Questions can be managed after creation.</p>
        </div>
        <Link className="text-link" to="/lecturer/exams">
          Back to exams
        </Link>
      </div>

      <form className="stacked-form" onSubmit={handleSubmit}>
        {error && <div className="form-error">{error}</div>}

        <label>
          Title
          <input name="title" value={form.title} onChange={handleChange} required />
        </label>

        <label>
          Description
          <textarea name="description" value={form.description} onChange={handleChange} />
        </label>

        <label>
          Duration minutes
          <input
            name="durationMinutes"
            type="number"
            min="1"
            value={form.durationMinutes}
            onChange={handleChange}
            required
          />
        </label>

        <div className="form-grid two-columns">
          <label>
            Starts at
            <input
              name="startsAt"
              type="datetime-local"
              value={form.startsAt}
              onChange={handleChange}
            />
          </label>

          <label>
            Ends at
            <input
              name="endsAt"
              type="datetime-local"
              value={form.endsAt}
              onChange={handleChange}
            />
          </label>
        </div>

        <button type="submit" disabled={submitting}>
          {submitting ? 'Creating...' : 'Create Exam'}
        </button>
      </form>
    </section>
  )
}

export default CreateExam
