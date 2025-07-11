import MainContent from '@/components/MainContent'

export default async function Home() {
  const res = await fetch(`/api/entries`, {
    cache: 'no-store',
  })

  if (!res.ok) return null

  const { data } = await res.json()

  return <MainContent entries={data.entries} />
}
