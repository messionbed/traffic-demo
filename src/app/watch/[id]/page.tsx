'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState, useRef } from 'react'
import { videos, quizzes, ads } from '@/data/videos'

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
  const [showQuiz, setShowQuiz] = useState(false)
  const [adCountdown, setAdCountdown] = useState(5)
  const [playerReady, setPlayerReady] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [quizCorrect, setQuizCorrect] = useState(false)
  const playerRef = useRef<any>(null)
  
  const video = videos.find(v => v.id === params.id)
  const quiz = quizzes.find(q => q.videoId === params.id)
  const randomAd = ads[Math.floor(Math.random() * ads.length)]

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
    
    // 퀴즈가 있으면 퀴즈 먼저, 없으면 광고
    if (video?.hasQuiz && quiz) {
      setShowQuiz(true)
    } else {
      setShowAd(true)
      startAdCountdown()
    }
  }

  const startAdCountdown = () => {
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

  const handleQuizSubmit = () => {
    if (selectedAnswer === null || !quiz) return
    
    const correct = selectedAnswer === quiz.questions[0].correctAnswer
    setQuizCorrect(correct)
    setShowResult(true)
    
    // 2초 후 광고로 넘어가기
    setTimeout(() => {
      setShowQuiz(false)
      setShowResult(false)
      setShowAd(true)
      startAdCountdown()
    }, 2000)
  }

  const givePoints = () => {
    if (!video || pointsAdded) return
    
    setPointsAdded(true)

    // 퀴즈 정답 시 보너스 포인트
    const bonusPoints = quizCorrect ? 50 : 0
    const totalPoints = video.points + bonusPoints

    const currentPoints = parseInt(localStorage.getItem('userPoints') || '0')
    const newPoints = currentPoints + totalPoints
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

  const manualComplete = () => {
    if (!videoEnded) {
      handleVideoEnd()
    }
  }

  if (!video) return <div>영상을 찾을 수 없습니다</div>

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
              {video.hasQuiz && (
                <span className="block text-sm text-yellow-600 font-semibold mt-1">
                  📝 퀴즈 정답 시 +50P 보너스!
                </span>
              )}
              <span className="block text-sm text-blue-600 font-semibold mt-2">
                👆 위 영상의 재생 버튼을 클릭해주세요
              </span>
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
            
            {videoEnded && !showAd && !showQuiz && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                🎉 축하합니다! {video.points + (quizCorrect ? 50 : 0)}포인트를 획득했습니다!
                {quizCorrect && <span className="block text-sm mt-1">퀴즈 정답 보너스 +50P!</span>}
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

      {/* 퀴즈 오버레이 */}
      {showQuiz && quiz && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full">
            <h3 className="text-2xl font-bold mb-6">📝 퀴즈 타임!</h3>
            
            <div className="mb-6">
              <p className="text-lg mb-4">{quiz.questions[0].question}</p>
              
              <div className="space-y-3">
                {quiz.questions[0].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => !showResult && setSelectedAnswer(index)}
                    disabled={showResult}
                    className={`w-full p-4 text-left rounded-lg border-2 transition-colors ${
                      selectedAnswer === index
                        ? showResult
                          ? index === quiz.questions[0].correctAnswer
                            ? 'border-green-500 bg-green-50'
                            : 'border-red-500 bg-red-50'
                          : 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    } ${showResult && index === quiz.questions[0].correctAnswer ? 'border-green-500 bg-green-50' : ''}`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {showResult && (
              <div className={`p-4 rounded-lg mb-4 ${
                quizCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                <p className="font-semibold">
                  {quizCorrect ? '✅ 정답입니다! +50P 보너스!' : '❌ 아쉽네요!'}
                </p>
                <p className="text-sm mt-1">{quiz.questions[0].explanation}</p>
              </div>
            )}

            {!showResult && (
              <button
                onClick={handleQuizSubmit}
                disabled={selectedAnswer === null}
                className={`w-full py-3 rounded-lg font-semibold ${
                  selectedAnswer !== null
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                정답 확인
              </button>
            )}
          </div>
        </div>
      )}

      {/* 광고 오버레이 */}
      {showAd && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full">
            <h3 className="text-2xl font-bold mb-4">오늘의 스폰서</h3>
            
            {/* 교통 관련 광고 */}
            <div className={`rounded-lg p-8 mb-4 text-center ${
              randomAd.type === 'insurance' ? 'bg-blue-50' :
              randomAd.type === 'product' ? 'bg-orange-50' : 'bg-green-50'
            }`}>
              <p className="text-3xl mb-4">{randomAd.title}</p>
              <p className="text-lg text-gray-700 mb-4">{randomAd.description}</p>
              <button className={`px-6 py-2 rounded-lg font-semibold ${
                randomAd.type === 'insurance' ? 'bg-blue-600 text-white' :
                randomAd.type === 'product' ? 'bg-orange-600 text-white' : 'bg-green-600 text-white'
              }`}>
                {randomAd.cta}
              </button>
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