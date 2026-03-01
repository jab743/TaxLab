import { useEffect, useState } from 'react'
import { fetchTaxBands } from '../services/taxBandService'

function useTaxBands() {
  const [taxBands, setTaxBands] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true

    const load = async () => {
      try {
        setLoading(true)
        setError(null)

        const data = await fetchTaxBands()

        if (isMounted) {
          setTaxBands(data)
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message)
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    load()

    return () => {
      isMounted = false
    }
  }, [])

  return {
    taxBands,
    loading,
    error,
  }
}

export default useTaxBands
