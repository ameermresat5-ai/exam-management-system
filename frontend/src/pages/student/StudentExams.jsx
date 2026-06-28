import { useEffect, useState } from 'react'
import api from '../../services/api'

function StudentExams() {
  const [exams, setExams] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

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

  return (
    <section className="page-panel">
      <h1>Available Exams</h1>
      {loading && <p>Loading exams...</p>}
      {error && <div className="form-error">{error}</div>}
      <div className="list-stack">
        {exams.map((exam) => (
          <article className="item-card" key={exam.id}>
            <h2>{exam.title}</h2>
            <p>{exam.description || 'No description provided.'}</p>
            <span>{exam.durationMinutes} minutes</span>
          </article>
        ))}
        {!loading && !error && exams.length === 0 && <p>No available exams.</p>}
      </div>
    </section>
  )
}

export default StudentExams
