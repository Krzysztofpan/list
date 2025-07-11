'use client'

import { Entry } from '@/types'
import { SendHorizonal } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { FormEvent, useOptimistic, useState, useTransition } from 'react'
import toast from 'react-hot-toast'

type Props = {
  entries: Entry[]
}

const MainContent = ({ entries }: Props) => {
  const [optimisticEntries, addOptimisticEntry] = useOptimistic(
    entries,
    (state, newEntry: Entry) => [newEntry, ...state]
  )
  const router = useRouter()
  const [, startTransition] = useTransition()
  const [value, setValue] = useState<string>('')

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!value) return
    const id = Date.now()

    setValue('')
    startTransition(async () => {
      addOptimisticEntry({
        id,
        desc: value,
      })
      console.log({
        id,
        desc: value,
      })

      const res = await fetch(`/api/entries`, {
        body: JSON.stringify({ id, desc: value }),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      })
      const json = await res.json()

      if (!res.ok || !json.success) {
        toast('something went wrong')
      } else {
        router.refresh()
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
        {optimisticEntries.map((entry) => (
          <div
            key={entry.id}
            className="bg-gray-500 py-2 px-2  mx-2 rounded-xl text-xl "
          >
            <p className="truncate">{entry.desc}</p>
          </div>
        ))}
      </div>
    </>
  )
}

export default MainContent
