'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

const rewards = [
  { id: '1', name: '스타벅스 아메리카노', points: 5000, image: '☕' },
  { id: '2', name: 'GS25 3000원권', points: 3000, image: '🏪' },
  { id: '3', name: '배스킨라빈스 싱글컵', points: 4000, image: '🍦' },
  { id: '4', name: '맥도날드 불고기버거 세트', points: 6000, image: '🍔' },
]

export default function RewardsPage() {
  const [points, setPoints] = useState(0)

  useEffect(() => {
    const savedPoints = localStorage.getItem('userPoints')
    if (savedPoints) setPoints(parseInt(savedPoints))
  }, [])

  const handleExchange = (reward: any) => {
    if (points >= reward.points) {
      alert(`${reward.name} 교환 신청이 완료되었습니다!\n(실제로는 관리자가 처리합니다)`)
      const newPoints = points - reward.points
      setPoints(newPoints)
      localStorage.setItem('userPoints', newPoints.toString())
    } else {
      alert('포인트가 부족합니다!')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-600 text-white p-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">Traffic 🚗</Link>
          <span className="text-lg">💰 {points}P</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4">
        <h2 className="text-xl font-bold mb-6">리워드 교환</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rewards.map((reward) => (
            <div key={reward.id} className="bg-white p-6 rounded-lg shadow">
              <div className="text-4xl mb-4 text-center">{reward.image}</div>
              <h3 className="text-lg font-semibold mb-2">{reward.name}</h3>
              <p className="text-2xl font-bold text-blue-600 mb-4">{reward.points}P</p>
              <button
                onClick={() => handleExchange(reward)}
                disabled={points < reward.points}
                className={`w-full py-2 rounded-lg font-semibold ${
                  points >= reward.points
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {points >= reward.points ? '교환하기' : '포인트 부족'}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="text-blue-600 underline">
            더 많은 포인트 받으러 가기
          </Link>
        </div>
      </main>
    </div>
  )
}