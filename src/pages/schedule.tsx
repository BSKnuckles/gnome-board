import { useSession } from 'next-auth/react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { ReactElement, useState } from 'react'
import { toast } from 'react-toastify'
import Layout from '../components/Layout'
import { trpc } from '../utils/trpc'
import type { NextPageWithLayout } from './_app'

const SchedulePage: NextPageWithLayout = () => {
  const [now, setNow] = useState('')
  const [next, setNext] = useState('')
  const schedule = trpc.useQuery(['schedule.get'], {
    refetchInterval: 5000
  })
  const create = trpc.useMutation('schedule.new')
  const update = trpc.useMutation('schedule.update')
  const { push } = useRouter()
  const { status } = useSession()
  if (status === 'loading') {
    return <p>Loading...</p>
  }
  if (status === 'unauthenticated') {
    push('/api/auth/signin')
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      if (now.length < 4 || next.length < 4) {
        toast.error('Fuck you. Enter more than 3 characters you lazy sack of shit.')
      } else {
        if (schedule?.data?.id) {
          await update.mutate({ id: schedule.data.id, now, next })
        } else {
          await create.mutate({ now, next })
        }

        toast.success('Schedule updated!')
        setNow('')
        setNext('')
      }
    } catch (e) {
      toast.error('Something went wrong. Try again later.')
    }
  }

  return (
    <>
      <Head>
        <title>Schedule | GnomeBoard</title>
        <meta name='description' content='Generated by create-t3-app' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <h2 className='text-4xl'>Schedule Page</h2>

      <div className='grid grid-cols-2 gap-8 my-8 max-w-lg'>
        <div className='bg-white rounded-xl p-4 shadow'>
          <p className='font-bold text-3xl text-center text-el-light-blue'>Now</p>
          <p className='font-semibold text-xl text-center mt-2'>{schedule?.data?.now ?? 'nothing'}</p>
        </div>
        <div className='bg-white rounded-xl p-4 shadow'>
          <p className='font-bold text-3xl text-center text-el-light-blue'>Up Next</p>
          <p className='font-semibold text-xl text-center mt-2'>{schedule?.data?.next ?? 'nothing'}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className='flex max-w-lg gap-4 bg-white rounded-xl p-4 shadow'>
        <div className='flex-1'>
          <label htmlFor='now' className='block text-sm font-medium text-gray-700'>
            Now
          </label>
          <div className='mt-1'>
            <input
              type='text'
              name='now'
              id='now'
              required
              value={now}
              onChange={e => setNow(e.target.value)}
              className='block w-full rounded-md border-gray-300 shadow-sm focus:border-el-dark-blue focus:ring-el-dark-blue sm:text-sm'
            />
          </div>
        </div>
        <div className='flex-1'>
          <label htmlFor='next' className='block text-sm font-medium text-gray-700'>
            Next
          </label>
          <div className='mt-1'>
            <input
              type='text'
              name='next'
              id='next'
              required
              value={next}
              onChange={e => setNext(e.target.value)}
              className='block w-full rounded-md border-gray-300 shadow-sm focus:border-el-dark-blue focus:ring-el-dark-blue sm:text-sm'
            />
          </div>
        </div>

        <div className='flex items-end justify-end'>
          <button
            type='submit'
            className='inline-flex items-center rounded-md border border-transparent bg-el-dark-blue px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-opacity-75 focus:outline-none focus:ring-2 focus:ring-el-dark-blue focus:ring-offset-2'>
            Save
          </button>
        </div>
      </form>
    </>
  )
}

SchedulePage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}

export default SchedulePage
