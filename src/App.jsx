import { Routes, Route } from 'react-router-dom'
import { Container } from 'react-bootstrap'
import AppNavbar from './components/AppNavbar'
import Home from './pages/Home'
import Contacts from './pages/Contacts'
import ContactDetail from './pages/ContactDetail'

export default function App() {
  return (
    <>
      <AppNavbar />
      <Container as="main" className="py-4 app-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/contacts/:id" element={<ContactDetail />} />
          <Route path="*" element={<p className="text-center text-muted py-5">Page introuvable.</p>} />
        </Routes>
      </Container>
  
    </>
  )
}