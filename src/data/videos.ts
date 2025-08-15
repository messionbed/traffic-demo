// 교통안전 콘텐츠 데이터 - 한문철 TV 스타일
export interface Video {
  id: string
  title: string
  youtubeId: string
  alternativeYoutubeId?: string
  points: number
  duration: string
  channel: string
  description?: string
  type?: 'video' | 'shorts'
  category: 'blackbox' | 'education' | 'law' | 'safety-tip' | 'accident-analysis'
  hasQuiz?: boolean
}

export const videos: Video[] = [
  // 블랙박스 영상
  {
    id: '1',
    title: '🚨 신호위반 사고 분석 - 누구의 과실일까?',
    youtubeId: 'jNQXAC9IVRw',
    points: 150,
    duration: '3:45',
    channel: '교통안전 블랙박스',
    description: '교차로 신호위반 사고 영상 분석',
    type: 'video',
    category: 'blackbox',
    hasQuiz: true
  },
  {
    id: '2',
    title: '⚠️ 빗길 추돌사고 - 안전거리의 중요성',
    youtubeId: '9bZkp7q19f0',
    points: 200,
    duration: '5:20',
    channel: '블랙박스 아카이브',
    description: '우천 시 안전거리 미확보로 인한 사고',
    type: 'video',
    category: 'blackbox',
    hasQuiz: true
  },
  
  // 교통법규 교육
  {
    id: '3',
    title: '📚 개정된 스쿨존 법규 완벽 정리',
    youtubeId: 'M7lc1UVf-VE',
    points: 250,
    duration: '8:15',
    channel: '교통법규 마스터',
    description: '2024년 개정 어린이보호구역 법규',
    type: 'video',
    category: 'law',
    hasQuiz: true
  },
  {
    id: '4',
    title: '🚦 우회전 신호등 바뀐 규정 총정리',
    youtubeId: 'dQw4w9WgXcQ',
    points: 180,
    duration: '6:30',
    channel: '교통법규 마스터',
    description: '헷갈리는 우회전 규정 완벽 가이드',
    type: 'video',
    category: 'law'
  },
  
  // 안전운전 팁 (Shorts)
  {
    id: '5',
    title: '💡 1분 안전팁: 사각지대 확인법',
    youtubeId: 'JE3eVU7AiFc',
    points: 50,
    duration: '0:58',
    channel: '1분 교통안전',
    description: '사이드미러 사각지대 체크 방법',
    type: 'shorts',
    category: 'safety-tip'
  },
  {
    id: '6',
    title: '💡 장마철 운전 필수 체크리스트',
    youtubeId: '1ZhtwInuOD0',
    points: 50,
    duration: '0:45',
    channel: '1분 교통안전',
    description: '비 오는 날 안전운전 5가지 팁',
    type: 'shorts',
    category: 'safety-tip'
  },
  
  // 사고 분석
  {
    id: '7',
    title: '🔍 고속도로 다중추돌 사고 분석',
    youtubeId: 'jNQXAC9IVRw',
    points: 300,
    duration: '12:30',
    channel: '사고분석 전문가',
    description: '안개 낀 고속도로 100중 추돌 사고 상세 분석',
    type: 'video',
    category: 'accident-analysis',
    hasQuiz: true
  }
]

// 카테고리 정보
export const categories = {
  blackbox: { 
    name: '블랙박스 영상', 
    emoji: '🚨',
    description: '실제 사고 영상으로 배우는 안전운전'
  },
  education: { 
    name: '교통안전 교육', 
    emoji: '📚',
    description: '꼭 알아야 할 교통안전 지식'
  },
  law: { 
    name: '교통법규', 
    emoji: '⚖️',
    description: '최신 교통법규 업데이트'
  },
  'safety-tip': { 
    name: '안전운전 팁', 
    emoji: '💡',
    description: '1분 안에 배우는 안전 팁'
  },
  'accident-analysis': { 
    name: '사고 분석', 
    emoji: '🔍',
    description: '전문가의 사고 원인 분석'
  }
}

// 퀴즈 데이터
export interface Quiz {
  videoId: string
  questions: {
    question: string
    options: string[]
    correctAnswer: number
    explanation: string
  }[]
}

export const quizzes: Quiz[] = [
  {
    videoId: '1',
    questions: [
      {
        question: '영상에서 사고의 주요 원인은 무엇인가요?',
        options: [
          '과속',
          '신호 위반',
          '졸음운전',
          '음주운전'
        ],
        correctAnswer: 1,
        explanation: '해당 사고는 적색 신호를 무시하고 진행한 차량에 의해 발생했습니다.'
      }
    ]
  },
  {
    videoId: '2',
    questions: [
      {
        question: '빗길 안전거리는 평소의 몇 배로 유지해야 할까요?',
        options: [
          '1.5배',
          '2배',
          '2.5배',
          '3배'
        ],
        correctAnswer: 1,
        explanation: '빗길에서는 제동거리가 늘어나므로 평소의 2배 이상 안전거리를 유지해야 합니다.'
      }
    ]
  },
  {
    videoId: '3',
    questions: [
      {
        question: '스쿨존에서 제한속도는 몇 km/h인가요?',
        options: [
          '20km/h',
          '30km/h',
          '40km/h',
          '50km/h'
        ],
        correctAnswer: 1,
        explanation: '어린이보호구역(스쿨존)의 제한속도는 30km/h입니다.'
      }
    ]
  }
]

// 광고 데이터
export interface Ad {
  id: string
  title: string
  description: string
  image?: string
  type: 'insurance' | 'product' | 'service'
  cta: string
  link?: string
}

export const ads: Ad[] = [
  {
    id: '1',
    title: '🚗 KB손해보험 다이렉트',
    description: '블랙박스 영상 제출 시 보험료 10% 추가 할인!',
    type: 'insurance',
    cta: '보험료 계산하기'
  },
  {
    id: '2',
    title: '📹 아이나비 블랙박스',
    description: 'QHD 고화질, 나이트비전 탑재! 교통사고 완벽 대비',
    type: 'product',
    cta: '최대 30% 할인 보기'
  },
  {
    id: '3',
    title: '🛡️ 삼성화재 애니카',
    description: '안전운전 점수 높으면 보험료 할인! AI 운전습관 분석',
    type: 'insurance',
    cta: '안전운전 할인 확인'
  },
  {
    id: '4',
    title: '🚙 현대 블루링크',
    description: '실시간 교통정보 & 안전운전 도우미 서비스',
    type: 'service',
    cta: '1개월 무료 체험'
  }
]