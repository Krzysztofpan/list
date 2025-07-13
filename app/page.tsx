import MainContent from '@/components/MainContent'

export default async function Home() {
  const res = await fetch(
    `https://twilio-api.mock.beeceptor.com/2010-04-01/Accounts/${process.env.ACCOUNT_SID}/SIP/Domains.json`,
    {
      cache: 'no-store',
    }
  )

  /*   if (!res.ok) return null */

  const data = await res.json()

  return <MainContent domains={data.domains} />
}
