import { useParams } from 'react-router-dom'

function ExamQuestions() {
  const { id } = useParams()

  return (
    <section className="page-panel">
      <h1>Exam Questions</h1>
      <p>Exam ID: {id}</p>
      <div className="item-card">Question management workspace.</div>
    </section>
  )
}

export default ExamQuestions
