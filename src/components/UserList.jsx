import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import axios from 'axios'
import { Row, Col, Form, InputGroup, Badge, Spinner, Alert, CloseButton } from 'react-bootstrap'
import UserCard from './UserCard'
import { firstLetter } from '../utils'

const API_URL = 'https://jsonplaceholder.typicode.com/users'

export default function UserList() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [params, setParams] = useSearchParams()

  const search = params.get('q') ?? ''
  const letter = params.get('lettre') ?? ''

  useEffect(() => {
    axios
      .get(API_URL)
      .then((response) => setUsers(response.data))
      .catch(() => setError("Les contacts n'ont pas pu être récupérés."))
      .finally(() => setLoading(false))
  }, [])

  const updateParam = (key, value) => {
    const next = new URLSearchParams(params)
    value ? next.set(key, value) : next.delete(key)
    setParams(next, { replace: true })
  }

  if (loading)
    return (
      <div className="text-center py-5 text-muted">
        <Spinner animation="border" variant="primary" size="sm" className="me-2" />
        Chargement des contacts…
      </div>
    )

  if (error) return <Alert variant="danger">{error}</Alert>

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) &&
      (!letter || firstLetter(u.name) === letter)
  )

  return (
    <section>
      <Row className="g-3 align-items-center mb-3">
        <Col md>
          <InputGroup>
            <InputGroup.Text>🔍</InputGroup.Text>
            <Form.Control
              type="search"
              placeholder="Rechercher un contact par nom…"
              value={search}
              onChange={(e) => updateParam('q', e.target.value)}
            />
          </InputGroup>
        </Col>
        <Col md="auto">
          <Badge bg="primary" pill className="px-3 py-2">
            {filtered.length} / {users.length} contacts
          </Badge>
        </Col>
      </Row>

      {letter && (
        <Badge bg="light" text="dark" className="mb-3 py-2 px-3 border d-inline-flex align-items-center gap-2">
          Lettre {letter}
          <CloseButton onClick={() => updateParam('lettre', '')} />
        </Badge>
      )}

      {filtered.length === 0 ? (
        <Alert variant="secondary">Aucun contact ne correspond à la recherche.</Alert>
      ) : (
        <Row xs={1} md={2} className="g-3">
          {filtered.map((user) => (
            <Col key={user.id}>
              <UserCard user={user} />
            </Col>
          ))}
        </Row>
      )}
    </section>
  )
}