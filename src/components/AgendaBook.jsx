import { useCallback, useEffect, useMemo, useState } from 'react'
import { Alert, Button, Spinner } from 'react-bootstrap'
import UserCard from './UserCard'
import useUsers from '../hooks/useUsers'
import { cleanName, firstLetter } from '../utils'

const PER_PAGE = 2

const chunk = (arr, n) =>
  Array.from({ length: Math.ceil(arr.length / n) }, (_, i) => arr.slice(i * n, i * n + n))

function BookPage({ users, number }) {
  return (
    <div className="book-page-inner">
      {users.map((u) => (
        <div key={u.id} className="book-slot">
          <UserCard user={u} />
        </div>
      ))}
      {users.length > 0 && <span className="page-number">{number}</span>}
    </div>
  )
}

export default function AgendaBook() {
  const { users, loading, error } = useUsers()
  const [current, setCurrent] = useState(0)
  const [flip, setFlip] = useState(null) // null | 'next' | 'prev'

  const sorted = useMemo(
    () => [...users].sort((a, b) => cleanName(a.name).localeCompare(cleanName(b.name))),
    [users]
  )

  // double pages : { left: [...], right: [...], leftNo, rightNo }
  const spreads = useMemo(() => {
    const pages = chunk(sorted, PER_PAGE)
    if (pages.length % 2) pages.push([])
    return chunk(pages, 2).map(([left, right], i) => ({
      left,
      right,
      leftNo: i * 2 + 1,
      rightNo: i * 2 + 2,
    }))
  }, [sorted])

  // première double page contenant chaque lettre
  const letterIndex = useMemo(() => {
    const map = {}
    spreads.forEach((s, i) =>
      [...s.left, ...s.right].forEach((u) => {
        const l = firstLetter(u.name)
        if (!(l in map)) map[l] = i
      })
    )
    return map
  }, [spreads])

  const last = spreads.length - 1

  const next = useCallback(() => {
    if (!flip && current < last) setFlip('next')
  }, [flip, current, last])

  const prev = useCallback(() => {
    if (!flip && current > 0) setFlip('prev')
  }, [flip, current])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft') prev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [next, prev])

  if (loading)
    return (
      <div className="text-center py-5 text-muted">
        <Spinner animation="border" variant="primary" size="sm" className="me-2" />
        Chargement des contacts…
      </div>
    )
  if (error) return <Alert variant="danger">{error}</Alert>
  if (spreads.length === 0) return <Alert variant="secondary">Aucun contact.</Alert>

  const cur = spreads[current]

  // pages fixes (celles qui sont révélées sous la feuille qui tourne)
  const leftSpread = flip === 'prev' ? spreads[current - 1] : cur
  const rightSpread = flip === 'next' ? spreads[current + 1] : cur

  
  let leaf = null
  if (flip === 'next') {
    const n = spreads[current + 1]
    leaf = {
      front: { users: cur.right, number: cur.rightNo },
      back: { users: n.left, number: n.leftNo },
    }
  } else if (flip === 'prev') {
    const p = spreads[current - 1]
    leaf = {
      front: { users: p.right, number: p.rightNo },
      back: { users: cur.left, number: cur.leftNo },
    }
  }

  const finishFlip = (e) => {
    if (e.target !== e.currentTarget) return
    setCurrent((c) => (flip === 'next' ? c + 1 : c - 1))
    setFlip(null)
  }

  const jump = (letter) => {
    if (!flip) setCurrent(letterIndex[letter])
  }

  return (
    <div>
      <div className="letter-tabs">
        {Object.keys(letterIndex)
          .sort()
          .map((l) => (
            <Button
              key={l}
              size="sm"
              variant={letterIndex[l] === current ? 'primary' : 'outline-primary'}
              onClick={() => jump(l)}
            >
              {l}
            </Button>
          ))}
      </div>

      <div className="book-stage">
        <Button
          variant="light"
          className="arrow-btn"
          onClick={prev}
          disabled={current === 0 || !!flip}
          aria-label="Page précédente"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </Button>

        <div className="book-frame">
          <div className="book">
            <div className="book-page left">
              <BookPage users={leftSpread.left} number={leftSpread.leftNo} />
            </div>
            <div className="book-page right">
              <BookPage users={rightSpread.right} number={rightSpread.rightNo} />
            </div>

            {leaf && (
              <div className={`leaf leaf-${flip}`} onAnimationEnd={finishFlip}>
                <div className="leaf-face front book-page right">
                  <BookPage {...leaf.front} />
                </div>
                <div className="leaf-face back book-page left">
                  <BookPage {...leaf.back} />
                </div>
              </div>
            )}

            <div className="spine" />
          </div>
          <div className="ribbon" />
        </div>

        <Button
          variant="light"
          className="arrow-btn"
          onClick={next}
          disabled={current === last || !!flip}
          aria-label="Page suivante"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </Button>
      </div>

      <p className="text-center text-muted small mt-3 mb-0">
        Feuillet {current + 1} / {spreads.length}
      </p>
    </div>
    
  )
}