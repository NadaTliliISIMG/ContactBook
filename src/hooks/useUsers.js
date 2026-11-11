import { useEffect, useState } from 'react'
import axios from 'axios'

const API_URL = 'https://jsonplaceholder.typicode.com/users'

export default function useUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    axios
      .get(API_URL)
      .then((response) => setUsers(response.data))
      .catch(() => setError("Les contacts n'ont pas pu être récupérés."))
      .finally(() => setLoading(false))
  }, [])

  return { users, loading, error }
}