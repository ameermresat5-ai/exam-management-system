import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'

function CreateExam() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ title: '', description: '', durationMinutes: 60 })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      await api.post('/api/exams', {
        ...form,
        durationMinutes: Number(form.durationMinutes),
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
      <h1>Create Exam</h1>
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
        <button type="submit" disabled={submitting}>
          {submitting ? 'Creating...' : 'Create exam'}
        </button>
      </form>
    </section>
  )
}

export default CreateExam
