export async function fetchTaxBands() {
  const response = await fetch('/income-tax-bands.json')

  if (!response.ok) {
    throw new Error('Failed to fetch tax bands')
  }

  const data = await response.json()

  if (!Array.isArray(data)) {
    throw new Error('Invalid tax band response')
  }

  return data
}
