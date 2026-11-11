import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import axios from 'axios'
import { Card, Row, Col, ListGroup, Spinner, Alert, Button } from 'react-bootstrap'
import { initials, avatarColor } from '../utils'

export default function ContactDetail() {
  const { id } = useParams()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    axios
      .get(`https://jsonplaceholder.typicode.com/users/${id}`)
      .then((r) => setUser(r.data))
      .catch(() => setError("Ce contact n'a pas pu être récupéré."))
      .finally(() => setLoading(false))
  }, [id])

  if (loading)
    return (
      <div className="text-center py-5 text-muted">
        <Spinner animation="border" variant="primary" size="sm" className="me-2" />
        Chargement du contact…
      </div>
    )

  if (error) return <Alert variant="danger">{error}</Alert>

  const { address: a, company: c } = user

  return (
    <>
      <Button as={Link} to="/contacts" variant="outline-primary" className="px-4 mb-4 rounded-pill" >
        ← Retour aux contacts
      </Button>

      <Card className="shadow-sm">
        <Card.Body className="p-4">
          <div className="d-flex align-items-center gap-3 mb-4">
            <div className="avatar big" style={{ background: avatarColor(user.id) }}>
              {initials(user.name)}
            </div>
            <div>
              <h1 className="h3 mb-1">{user.name}</h1>
              <span className="text-primary">{c.name} · @{user.username}</span>
            </div>
          </div>

          <Row className="g-3">
            <Col md={6}>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <small className="text-muted d-block">E-mail</small>
                  <a href={`mailto:${user.email}`}>{user.email}</a>
                </ListGroup.Item>
                <ListGroup.Item>
                  <small className="text-muted d-block">Téléphone</small>
                  <a href={`tel:${user.phone}`}>{user.phone}</a>
                </ListGroup.Item>
                <ListGroup.Item>
                  <small className="text-muted d-block">Site web</small>
                  {user.website}
                </ListGroup.Item>
              </ListGroup>
            </Col>
            <Col md={6}>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <small className="text-muted d-block">Ville</small>
                  {a.city}
                </ListGroup.Item>
                <ListGroup.Item>
                  <small className="text-muted d-block">Adresse</small>
                  {a.street}, {a.suite}, {a.zipcode}
                </ListGroup.Item>
                <ListGroup.Item>
                  <small className="text-muted d-block">Entreprise</small>
                  {c.name} <small className="text-muted">— {c.catchPhrase}</small>
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </>
  )
}