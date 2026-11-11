import { Link } from 'react-router-dom'
import { Button } from 'react-bootstrap'
import AgendaBook from '../components/AgendaBook'

export default function Home() {
  const today = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <section>
      <div className="text-center mb-4">
        <p className="eyebrow text-capitalize">{today}</p>
        <h1 className="display-5">Feuilletez l'agenda. Trouvez un contact.</h1>
      </div>

      <AgendaBook />

      <div className="text-center mt-4">
        <Button as={Link} to="/contacts" variant="outline-primary" className="rounded-pill px-4">
          Voir tous les contacts avec la recherche →
        </Button>
      </div>
    </section>
  )
}