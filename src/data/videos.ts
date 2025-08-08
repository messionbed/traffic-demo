// 교통안전 영상 데이터
// 테스트용 영상으로 변경 (실제 재생 가능한 영상들)

export interface Video {
  id: string
  title: string
  youtubeId: string
  alternativeYoutubeId?: string
  points: number
  duration: string
  channel: string
  description?: string
}

export const videos: Video[] = [
  {
    id: '1',
    title: '차선변경 안전수칙',
    youtubeId: 'jNQXAC9IVRw',  // 짧은 테스트 영상
    points: 100,
    duration: '0:19',
    channel: '교통안전 시뮬레이션',
    description: '안전한 차선변경을 위한 기본 수칙'
  },
  {
    id: '2',
    title: '비 오는 날 안전운전',
    youtubeId: '9bZkp7q19f0',  // PSY - Gangnam Style (테스트용)
    points: 150,
    duration: '4:12',
    channel: '교통안전 캠페인',
    description: '우천시 안전운전 요령'
  },
  {
    id: '3',
    title: '스쿨존 안전운전',
    youtubeId: 'M7lc1UVf-VE',  // Google 데모 영상
    points: 200,
    duration: '0:17',
    channel: '어린이 안전',
    description: '어린이 보호구역 안전수칙'
  },
  {
    id: '4',
    title: '졸음운전 예방법',
    youtubeId: 'dQw4w9WgXcQ',  // Rick Astley (유명 테스트 영상)
    points: 180,
    duration: '3:32',
    channel: '고속도로 안전',
    description: '졸음운전 예방을 위한 실천 방법'
  }
]

// 교통안전 관련 YouTube 채널 정보
export const trafficSafetyChannels = {
  koroad: {
    name: '도로교통공단',
    description: '교통안전 교육 및 캠페인 영상',
    website: 'https://www.koroad.or.kr/'
  },
  kotsa: {
    name: '한국교통안전공단',
    description: '사람 중심 교통안전 콘텐츠',
    website: 'https://www.kotsa.or.kr/'
  },
  mois: {
    name: '행정안전부 안전한TV',
    description: '국민안전방송 교통안전 콘텐츠',
    website: 'https://www.safetv.go.kr/'
  }
}

// YouTube 영상 재생 문제 해결을 위한 유틸리티
export const videoUtils = {
  // YouTube embed URL 생성
  getEmbedUrl: (videoId: string, autoplay: boolean = false): string => {
    const params = new URLSearchParams({
      rel: '0', // 관련 영상 표시 안함
      modestbranding: '1', // YouTube 로고 최소화
      ...(autoplay && { autoplay: '1' })
    })
    return `https://www.youtube.com/embed/${videoId}?${params.toString()}`
  },

  // 영상 유효성 검사 (실제 구현시 YouTube API 사용)
  checkVideoAvailability: async (videoId: string): Promise<boolean> => {
    // 실제로는 YouTube Data API v3를 사용하여 영상 상태 확인
    // 현재는 항상 true 반환 (실제 구현 필요)
    return true
  },

  // 대체 영상 URL 반환
  getAlternativeVideo: (video: Video): string => {
    return video.alternativeYoutubeId || video.youtubeId
  }
}