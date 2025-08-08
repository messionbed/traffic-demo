'use client'

import { useEffect, useRef, useState } from 'react'

interface YouTubeEmbedProps {
  videoId: string
  alternativeVideoId?: string
  onReady?: () => void
  onError?: (error: any) => void
  onEnd?: () => void
  autoplay?: boolean
  className?: string
}

export default function YouTubeEmbed({
  videoId,
  alternativeVideoId,
  onReady,
  onError,
  onEnd,
  autoplay = false,
  className = ''
}: YouTubeEmbedProps) {
  const [embedError, setEmbedError] = useState(false)
  const [currentVideoId, setCurrentVideoId] = useState(videoId)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  // iframe 방식으로 임베드 (YouTube API 대신)
  const embedUrl = `https://www.youtube.com/embed/${currentVideoId}?${new URLSearchParams({
    rel: '0',
    modestbranding: '1',
    autoplay: autoplay ? '1' : '0',
    enablejsapi: '1',
    origin: typeof window !== 'undefined' ? window.location.origin : ''
  }).toString()}`

  useEffect(() => {
    // postMessage를 통한 영상 상태 감지
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== 'https://www.youtube.com') return
      
      try {
        const data = JSON.parse(event.data)
        if (data.event === 'onReady') {
          onReady?.()
        } else if (data.event === 'onStateChange') {
          if (data.info === 0) { // 영상 종료
            onEnd?.()
          }
        }
      } catch (e) {
        // JSON 파싱 에러 무시
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [onReady, onEnd])

  const handleIframeError = () => {
    console.error('YouTube 영상 로드 실패:', currentVideoId)
    setEmbedError(true)
    
    // 대체 영상이 있으면 시도
    if (alternativeVideoId && currentVideoId !== alternativeVideoId) {
      console.log('대체 영상으로 전환:', alternativeVideoId)
      setCurrentVideoId(alternativeVideoId)
      setEmbedError(false)
    }
    
    onError?.(new Error('영상 로드 실패'))
  }

  if (embedError && (!alternativeVideoId || currentVideoId === alternativeVideoId)) {
    return (
      <div className={`bg-black text-white flex items-center justify-center ${className}`}>
        <div className="text-center p-8">
          <p className="text-xl mb-4">😢 영상을 재생할 수 없습니다</p>
          <p className="text-gray-400">
            영상이 삭제되었거나 재생이 제한된 상태입니다.
          </p>
          <button 
            onClick={() => {
              setEmbedError(false)
              setCurrentVideoId(videoId)
            }}
            className="mt-4 px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
          >
            다시 시도
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      <iframe
        ref={iframeRef}
        src={embedUrl}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="w-full h-full"
        onError={handleIframeError}
      />
    </div>
  )
}