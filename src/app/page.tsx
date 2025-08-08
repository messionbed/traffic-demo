'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { videos } from '@/data/videos'

export default function Home() {
  const [points, setPoints] = useState(0)
  const [watchedVideos, setWatchedVideos] = useState<string[]>([])

  useEffect(() => {
    const savedPoints = localStorage.getItem('userPoints')
    const savedWatched = localStorage.getItem('watchedVideos')
    if (savedPoints) setPoints(parseInt(savedPoints))
    if (savedWatched) setWatchedVideos(JSON.parse(savedWatched))
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-600 text-white p-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Traffic 🚗</h1>
          <div className="flex items-center gap-4">
            <span className="text-lg">💰 {points}P</span>
            <Link href="/rewards" className="bg-yellow-500 text-black px-4 py-2 rounded-lg font-semibold">
              리워드
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4">
        <h2 className="text-xl font-bold mb-6">교통안전 영상 보고 포인트 받기</h2>
        
        <div className="grid gap-4">
          {videos.map((video) => (
            <Link key={video.id} href={`/watch/${video.id}`}>
              <div className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold">{video.title}</h3>
                    <p className="text-gray-600">시청시간: {video.duration}</p>
                    <p className="text-gray-500 text-sm">제공: {video.channel}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-600">+{video.points}P</p>
                    {watchedVideos.includes(video.id) && (
                      <span className="text-green-600 text-sm">✓ 시청완료</span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}