import { Link } from 'react-router-dom'
import { Card } from 'react-bootstrap'
import { initials, avatarColor } from '../utils'

export default function UserCard({ user }) {
  return (
    <Card as={Link} to={`/contacts/${user.id}`} className="h-100 user-card text-decoration-none">
      <Card.Body className="d-flex gap-3">
        <div className="avatar" style={{ background: avatarColor(user.id) }}>
          {initials(user.name)}
        </div>
        <div className="min-w-0">
          <Card.Title as="h3" className="h6 mb-1">{user.name}</Card.Title>
          <Card.Subtitle className="text-primary small mb-2">{user.company.name}</Card.Subtitle>
          <Card.Text as="div" className="text-muted small text-break">
            <div>✉ {user.email}</div>
            <div>☎ {user.phone}</div>
            <div>⌖ {user.address.city}</div>
          </Card.Text>
        </div>
      </Card.Body>
    </Card>
  )
}