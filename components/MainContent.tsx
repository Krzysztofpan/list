'use client'

import { addDomain } from '@/lib/domain.action'
import { Domains } from '@/types'
import { SendHorizonal } from 'lucide-react'
import { nanoid } from 'nanoid'

import { FormEvent, useOptimistic, useState, useTransition } from 'react'
import toast from 'react-hot-toast'

type Props = {
  domains: Domains[]
}

const MainContent = ({ domains }: Props) => {
  const [optimisticDomains, addOptimisticDomain] = useOptimistic(
    domains,
    (state, newDomain: Domains) => [newDomain, ...state]
  )

  const [, startTransition] = useTransition()
  const [value, setValue] = useState<string>('')

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!value) return
    const id = nanoid()

    setValue('')
    startTransition(async () => {
      addOptimisticDomain({
        sid: id,
        domain_name: value,
      })
      const res = await addDomain(value)

      if (res.success) {
        toast(res.message)
      }
    })
  }

  return (
    <>
      <div className="space-y-4 border-b-[1px] border-b-white p-8">
        <h1 className="text-2xl">Enter something into the input and send</h1>
        <form className="flex gap-2" onSubmit={handleSubmit}>
          <input
            type="text"
            className="flex-1 border-white border-[1px] rounded-full h-10 bg-gray-600 px-2"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />

          <button
            className="w-11 h-11 bg-blue-600 rounded-lg cursor-pointer hover:bg-blue-500 flex items-center justify-center"
            type="submit"
          >
            <SendHorizonal />
          </button>
        </form>
      </div>
      <div className="h-full bg-gray-600 overflow-y-auto flex flex-col gap-4 py-2 ">
        {optimisticDomains.map((domain) => (
          <div
            key={domain.sid}
            className="bg-gray-500 py-2 px-2  mx-2 rounded-xl text-xl "
          >
            <p className="truncate">{domain.domain_name || domain.sid}</p>
          </div>
        ))}
      </div>
    </>
  )
}

export default MainContent
