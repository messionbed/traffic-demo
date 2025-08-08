# YouTube 영상 재생 문제 해결 가이드

## 문제 분석

### 현재 사용 중인 YouTube 영상 ID
1. `M9Z3mNq-_GU` - 차선변경 안전수칙
2. `bTpGX84r9lw` - 비 오는 날 안전운전
3. `OZ4bVJLlBFo` - 스쿨존 30 지키기
4. `6fEeAjNjfHE` - 졸음운전 예방법

### YouTube 영상이 재생되지 않는 주요 원인

1. **잘못된 영상 ID**
   - 영상이 삭제되었거나 존재하지 않는 ID
   - 오타나 잘못된 형식의 ID

2. **임베드 제한**
   - 영상 소유자가 외부 사이트 임베드를 비활성화
   - YouTube의 저작권 정책에 의한 제한

3. **지역 제한**
   - 특정 국가/지역에서만 재생 가능한 영상
   - 라이선스 문제로 인한 지역 차단

4. **기술적 문제**
   - CORS (Cross-Origin Resource Sharing) 정책
   - Content Security Policy (CSP) 제한
   - YouTube API 키 문제
   - HTTPS/HTTP 혼용 문제

## 해결 방법

### 1. 코드 개선사항

#### videos.ts 파일 생성
- 영상 데이터를 중앙화하여 관리
- 대체 영상 ID 포함
- 영상 메타데이터 추가

#### YouTube Player API 개선
```javascript
playerVars: {
  'origin': window.location.origin,
  'rel': 0,  // 관련 영상 표시 안함
  'modestbranding': 1  // YouTube 로고 최소화
}
```

#### 에러 핸들링 추가
- `onError` 이벤트로 영상 로드 실패 감지
- 대체 영상 자동 로드 기능
- 사용자 친화적인 에러 메시지

### 2. YouTubeEmbed 컴포넌트 특징
- 재사용 가능한 컴포넌트 설계
- iframe 임베드 방식 사용
- 에러 발생 시 대체 영상 자동 전환
- 재시도 기능 포함

### 3. 대체 가능한 교통안전 영상 소스

#### 공식 기관
1. **도로교통공단 (KoROAD)**
   - 웹사이트: www.koroad.or.kr
   - 교통안전 교육센터: trafficedu.koroad.or.kr
   - 교육 영상 제공

2. **한국교통안전공단 (KOTSA)**
   - 웹사이트: www.kotsa.or.kr
   - 사람 중심 교통안전 콘텐츠
   - Facebook: 30,497 팔로워
   - Instagram: @kotsa_kr (24K 팔로워)

3. **행정안전부 안전한TV**
   - 웹사이트: www.safetv.go.kr
   - 국민안전방송 콘텐츠
   - 다양한 안전 교육 영상

## 테스트 방법

### 1. 영상 유효성 확인
```bash
# 브라우저에서 직접 확인
https://www.youtube.com/watch?v=[VIDEO_ID]
```

### 2. 임베드 가능 여부 확인
1. YouTube 영상 페이지 방문
2. "공유" 버튼 클릭
3. "퍼가기" 옵션 확인
4. 옵션이 없으면 임베드 제한됨

### 3. 개발자 도구 활용
- Console 탭에서 에러 메시지 확인
- Network 탭에서 YouTube API 요청 상태 확인
- 403, 404 등의 HTTP 에러 코드 확인

## 추천 사항

### 1. 안정적인 영상 소스 확보
- 공식 기관의 YouTube 채널 구독
- 정기적으로 영상 유효성 검증
- 여러 개의 백업 영상 ID 준비

### 2. 기술적 개선
- YouTube Data API v3 사용 고려
- 영상 메타데이터 캐싱
- 오프라인 대비 로컬 영상 백업

### 3. 사용자 경험 개선
- 로딩 상태 표시
- 명확한 에러 메시지
- 대체 콘텐츠 제공