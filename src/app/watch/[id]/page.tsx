'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState, useRef } from 'react'

const videos = [
  { id: '1', title: '차선변경 안전수칙', youtubeId: 'jNQXAC9IVRw', points: 100, type: 'video' },
  { id: '2', title: '비 오는 날 안전운전', youtubeId: '9bZkp7q19f0', points: 150, type: 'video' },
  { id: '3', title: '스쿨존 안전운전', youtubeId: 'M7lc1UVf-VE', points: 200, type: 'video' },
  { id: '4', title: '졸음운전 예방법', youtubeId: 'dQw4w9WgXcQ', points: 180, type: 'video' },
  { id: '5', title: '안전운전 Shorts 테스트', youtubeId: 'SqcY0GlETPk', points: 50, type: 'shorts' },
]

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export default function WatchPage() {
  const params = useParams()
  const router = useRouter()
  const [videoEnded, setVideoEnded] = useState(false)
  const [pointsAdded, setPointsAdded] = useState(false)
  const [showAd, setShowAd] = useState(false)
  const [adCountdown, setAdCountdown] = useState(5)
  const [playerReady, setPlayerReady] = useState(false)
  const playerRef = useRef<any>(null)
  
  const video = videos.find(v => v.id === params.id)

  useEffect(() => {
    if (!video) return

    // YouTube IFrame Player API 스크립트 로드
    if (!window.YT) {
      const tag = document.createElement('script')
      tag.src = 'https://www.youtube.com/iframe_api'
      const firstScriptTag = document.getElementsByTagName('script')[0]
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag)
    }

    // API 준비 완료 시 플레이어 생성
    window.onYouTubeIframeAPIReady = () => {
      playerRef.current = new window.YT.Player('youtube-player', {
        height: '100%',
        width: '100%',
        videoId: video.youtubeId,
        playerVars: {
          'autoplay': 0,
          'controls': 1,
          'rel': 0,
          'showinfo': 0,
          'modestbranding': 1,
          'playsinline': 1
        },
        events: {
          'onReady': onPlayerReady,
          'onStateChange': onPlayerStateChange
        }
      })
    }

    // 이미 API가 로드되어 있다면 바로 실행
    if (window.YT && window.YT.Player) {
      window.onYouTubeIframeAPIReady()
    }

    return () => {
      if (playerRef.current && playerRef.current.destroy) {
        playerRef.current.destroy()
      }
    }
  }, [video])

  const onPlayerReady = (event: any) => {
    setPlayerReady(true)
    // 자동 재생 (음소거 상태로)
    event.target.mute()
    event.target.playVideo()
  }

  const onPlayerStateChange = (event: any) => {
    // 영상 종료 시 (YT.PlayerState.ENDED = 0)
    if (event.data === 0) {
      handleVideoEnd()
    }
  }

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

  // 수동 완료 버튼 (백업용)
  const manualComplete = () => {
    if (!videoEnded) {
      handleVideoEnd()
    }
  }

  if (!video) return <div>영상을 찾을 수 없습니다</div>

  // Shorts인 경우 세로형 레이아웃
  const isShorts = video.type === 'shorts'

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-600 text-white p-4">
        <h1 className="text-xl font-bold max-w-4xl mx-auto">{video.title}</h1>
      </header>

      <main className="max-w-4xl mx-auto p-4">
        <div className="bg-white rounded-lg shadow-lg p-4">
          {/* YouTube Player Container */}
          <div className={`relative bg-black rounded-lg overflow-hidden mx-auto ${
            isShorts ? 'max-w-sm' : 'w-full'
          }`}>
            <div className={isShorts ? 'aspect-[9/16]' : 'aspect-video'}>
              <div id="youtube-player"></div>
            </div>
          </div>
          
          <div className="mt-4 text-center">
            <p className="text-gray-600 mb-4">
              {isShorts ? 'Shorts' : '영상'}을 끝까지 시청하면 {video.points}포인트를 받을 수 있습니다!
            </p>
            
            {/* 디버그용: 수동 완료 버튼 */}
            {!videoEnded && playerReady && (
              <button 
                onClick={manualComplete}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-600 mb-4"
              >
                (테스트) 수동으로 완료하기
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