'use client'

import { useQuery } from 'react-query'
import { fetchStats, formatter, percentage } from '../../utils/donorDrive'
import LurkMerch from '../../assets/img/lurk-merch.png'
import TimeLeft from '../../components/overlay/TimeLeft'

const Overlay = () => {
  const { data, error, isLoading } = useQuery(['extralife', 'donors'], () => fetchStats('478888'))

  return (
    <div style={{ width: 1920, height: 1080 }} className='relative bg-green-500'>
      <div className='absolute bottom-12 left-0 right-0 w-full flex justify-center'>
        <div
          style={{ width: 934 }}
          className='bg-gray-600 border-8 border-black text-white rounded-full text-3xl font-bold text-center relative overflow-hidden'>
          <div
            className='h-16 bg-purple-bar-1 rounded-full'
            style={{ width: `${percentage(data?.sumDonations, data?.fundraisingGoal)}%` }}></div>
          <div className='absolute inset-0 flex items-center justify-center'>
            <p>{formatter.format(data?.sumDonations)}</p>
          </div>
          <div className='absolute bottom-0 right-64 w-16 h-16'>
            <img src={LurkMerch.src} />
          </div>
        </div>
      </div>
      <div className='absolute bottom-14 right-12'>
        <TimeLeft />
      </div>
    </div>
  )
}
export default Overlay
