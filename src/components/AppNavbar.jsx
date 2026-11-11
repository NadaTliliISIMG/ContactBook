import { Link, NavLink } from 'react-router-dom'
import { Navbar, Nav, Container } from 'react-bootstrap'

export default function AppNavbar() {
  return (
    <Navbar expand="sm" sticky="top" className="app-navbar">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold">
          <img src="/agenda.png" alt="ContactBook" style={{ width: '30px', height: '30px', marginRight: '10px' }} />
          ContactBook
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-nav" />
        <Navbar.Collapse id="main-nav" className="justify-content-end">
          <Nav>
            <Nav.Link as={NavLink} to="/" end>Agenda</Nav.Link>
            <Nav.Link as={NavLink} to="/contacts">Contacts</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}