'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const videos = [
  { id: '1', title: '초보운전 필수 팁', youtubeId: 'JgHDWpJwfKQ', points: 100 },
  { id: '2', title: '안전한 차선변경 방법', youtubeId: 'JgHDWpJwfKQ', points: 150 },
  { id: '3', title: '주차 마스터 되기', youtubeId: 'JgHDWpJwfKQ', points: 200 },
]

export default function WatchPage() {
  const params = useParams()
  const router = useRouter()
  const [videoEnded, setVideoEnded] = useState(false)
  const [pointsAdded, setPointsAdded] = useState(false)
  const [countdown, setCountdown] = useState(10)
  
  const video = videos.find(v => v.id === params.id)

  useEffect(() => {
    if (!video) return

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          handleVideoEnd()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [video])

  const handleVideoEnd = () => {
    if (!video || pointsAdded) return
    
    setVideoEnded(true)
    setPointsAdded(true)

    const currentPoints = parseInt(localStorage.getItem('userPoints') || '0')
    const newPoints = currentPoints + video.points
    localStorage.setItem('userPoints', newPoints.toString())

    const watched = JSON.parse(localStorage.getItem('watchedVideos') || '[]')
    if (!watched.includes(video.id)) {
      watched.push(video.id)
      localStorage.setItem('watchedVideos', JSON.stringify(watched))
    }
  }

  if (!video) return <div>영상을 찾을 수 없습니다</div>

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-600 text-white p-4">
        <h1 className="text-xl font-bold max-w-4xl mx-auto">{video.title}</h1>
      </header>

      <main className="max-w-4xl mx-auto p-4">
        <div className="bg-white rounded-lg shadow-lg p-4">
          <div className="w-full aspect-video bg-black rounded-lg">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1`}
              title={video.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="rounded-lg"
            ></iframe>
          </div>
          
          <div className="mt-4 text-center">
            {!videoEnded && (
              <p className="text-gray-600 mb-4">
                {countdown}초 후 자동으로 {video.points}포인트가 지급됩니다!
                <br />
                <span className="text-sm">(데모용: 실제로는 영상을 끝까지 봐야 합니다)</span>
              </p>
            )}
            
            {videoEnded && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                🎉 축하합니다! {video.points}포인트를 획득했습니다!
              </div>
            )}
            
            <button 
              onClick={() => router.push('/')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700"
            >
              다른 영상 보러가기
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}