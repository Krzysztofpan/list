'use server'

import { revalidatePath } from 'next/cache'

export const addDomain = async (DomainName: string) => {
  if (!DomainName)
    return { success: false, message: 'enter domain name is required.' }
  try {
    const params = new URLSearchParams()
    params.append('DomainName', DomainName)
    params.append('FriendlyName', DomainName)

    const res = await fetch(
      `https://twilio-api.mock.beeceptor.com/2010-04-01/Accounts/${process.env.ACCOUNT_SID}/SIP/Domains.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
      }
    )

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status} ${res.statusText}`)
    }
  } catch (error) {
    console.log(error)

    return { success: false, message: 'Something went wrong' }
  }
  revalidatePath('/')
  return { success: true, message: 'Domain was added' }
}
