'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const videos = [
  { id: '1', title: '차선변경 안전수칙', youtubeId: 'jNQXAC9IVRw', points: 100 },
  { id: '2', title: '비 오는 날 안전운전', youtubeId: '9bZkp7q19f0', points: 150 },
  { id: '3', title: '스쿨존 안전운전', youtubeId: 'M7lc1UVf-VE', points: 200 },
  { id: '4', title: '졸음운전 예방법', youtubeId: 'dQw4w9WgXcQ', points: 180 },
]

export default function WatchPage() {
  const params = useParams()
  const router = useRouter()
  const [videoEnded, setVideoEnded] = useState(false)
  const [pointsAdded, setPointsAdded] = useState(false)
  const [showAd, setShowAd] = useState(false)
  const [adCountdown, setAdCountdown] = useState(5)
  const [manualEnd, setManualEnd] = useState(false)
  
  const video = videos.find(v => v.id === params.id)

  useEffect(() => {
    // 10초 후 수동으로 종료 버튼 표시 (데모용)
    const timer = setTimeout(() => {
      setManualEnd(true)
    }, 10000)

    return () => clearTimeout(timer)
  }, [])

  const handleVideoEnd = () => {
    if (pointsAdded) return
    
    setVideoEnded(true)
    setShowAd(true)
    
    // 광고 카운트다운
    let countdown = 5
    const timer = setInterval(() => {
      countdown--
      setAdCountdown(countdown)
      
      if (countdown === 0) {
        clearInterval(timer)
        setShowAd(false)
        givePoints()
      }
    }, 1000)
  }

  const givePoints = () => {
    if (!video || pointsAdded) return
    
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

  const skipAd = () => {
    if (adCountdown <= 0) {
      setShowAd(false)
      givePoints()
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
              src={`https://www.youtube.com/embed/${video.youtubeId}`}
              title={video.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="rounded-lg"
            ></iframe>
          </div>
          
          <div className="mt-4 text-center">
            <p className="text-gray-600 mb-4">
              영상을 시청하고 아래 버튼을 클릭하면 {video.points}포인트를 받을 수 있습니다!
            </p>
            
            {manualEnd && !videoEnded && (
              <button 
                onClick={handleVideoEnd}
                className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 mb-4"
              >
                시청 완료! 포인트 받기
              </button>
            )}
            
            {videoEnded && !showAd && (
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

      {/* 광고 오버레이 */}
      {showAd && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4">
            <h3 className="text-2xl font-bold mb-4">오늘의 스폰서</h3>
            
            {/* 광고 이미지 또는 콘텐츠 */}
            <div className="bg-gray-200 rounded-lg p-8 mb-4 text-center">
              <p className="text-3xl mb-4">🚗 안전운전 자동차보험</p>
              <p className="text-lg text-gray-700">무사고 운전자 최대 50% 할인!</p>
              <p className="text-sm text-gray-600 mt-2">KB손해보험</p>
            </div>
            
            <p className="text-gray-600 mb-4 text-center">
              광고 시청 중... ({adCountdown}초)
            </p>
            
            <button 
              onClick={skipAd} 
              disabled={adCountdown > 0}
              className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                adCountdown > 0 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {adCountdown > 0 ? `${adCountdown}초 후 건너뛰기` : '광고 건너뛰기'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}