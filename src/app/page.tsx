'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { videos, categories } from '@/data/videos'

export default function Home() {
  const [points, setPoints] = useState(0)
  const [watchedVideos, setWatchedVideos] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  useEffect(() => {
    const savedPoints = localStorage.getItem('userPoints')
    const savedWatched = localStorage.getItem('watchedVideos')
    if (savedPoints) setPoints(parseInt(savedPoints))
    if (savedWatched) setWatchedVideos(JSON.parse(savedWatched))
  }, [])

  // 카테고리별 필터링
  const filteredVideos = selectedCategory === 'all' 
    ? videos 
    : videos.filter(video => video.category === selectedCategory)

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-600 text-white p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">🚗 Traffic 안전운전 리워드</h1>
            <div className="flex items-center gap-4">
              <span className="text-lg">💰 {points}P</span>
              <Link href="/rewards" className="bg-yellow-500 text-black px-4 py-2 rounded-lg font-semibold">
                리워드
              </Link>
            </div>
          </div>
          <p className="text-sm opacity-90">교통안전 영상 시청하고 포인트 받자!</p>
        </div>
      </header>

      {/* 카테고리 필터 */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto p-4">
          <div className="flex gap-2 overflow-x-auto">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-full whitespace-nowrap ${
                selectedCategory === 'all' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              전체
            </button>
            {Object.entries(categories).map(([key, category]) => (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={`px-4 py-2 rounded-full whitespace-nowrap ${
                  selectedCategory === key 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.emoji} {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto p-4">
        {/* 카테고리 설명 */}
        {selectedCategory !== 'all' && categories[selectedCategory as keyof typeof categories] && (
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <p className="text-gray-700">
              {categories[selectedCategory as keyof typeof categories].description}
            </p>
          </div>
        )}

        {/* 오늘의 추천 (전체 선택시만) */}
        {selectedCategory === 'all' && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">🎯 오늘의 추천 영상</h2>
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg">
              <Link href="/watch/1">
                <h3 className="text-lg font-bold mb-2">
                  {videos[0].title}
                </h3>
                <p className="text-sm opacity-90 mb-2">{videos[0].description}</p>
                <div className="flex items-center gap-4">
                  <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                    +{videos[0].points}P
                  </span>
                  {videos[0].hasQuiz && (
                    <span className="bg-yellow-400 text-black px-3 py-1 rounded-full text-sm">
                      퀴즈 있음
                    </span>
                  )}
                </div>
              </Link>
            </div>
          </div>
        )}

        {/* 영상 목록 */}
        <h2 className="text-xl font-bold mb-4">
          {selectedCategory === 'all' ? '전체 영상' : `${categories[selectedCategory as keyof typeof categories]?.name} 영상`}
        </h2>
        
        <div className="grid gap-4">
          {filteredVideos.map((video) => (
            <Link key={video.id} href={`/watch/${video.id}`}>
              <div className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                        {categories[video.category].emoji} {categories[video.category].name}
                      </span>
                      {video.type === 'shorts' && (
                        <span className="text-sm bg-red-500 text-white px-2 py-1 rounded">
                          Shorts
                        </span>
                      )}
                      {video.hasQuiz && (
                        <span className="text-sm bg-yellow-400 text-black px-2 py-1 rounded">
                          퀴즈
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold mb-1">
                      {video.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-1">{video.description}</p>
                    <p className="text-gray-500 text-sm">
                      {video.channel} · {video.duration}
                    </p>
                  </div>
                  <div className="text-right ml-4">
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

        {/* 통계 섹션 */}
        <div className="mt-8 bg-gray-100 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">📊 나의 학습 현황</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">시청한 영상</p>
              <p className="text-xl font-bold">{watchedVideos.length}개</p>
            </div>
            <div>
              <p className="text-gray-600">획득한 포인트</p>
              <p className="text-xl font-bold">{points}P</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}