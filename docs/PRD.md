# PRD: 개인 개발 블로그 (Notion CMS 기반)

## 1. 프로젝트 개요

| 항목 | 내용 |
|------|------|
| 프로젝트명 | 개인 개발 블로그 |
| 목적 | Notion을 CMS로 활용한 개인 기술 블로그 |
| 작성일 | 2026-05-18 |
| 상태 | 기획 중 |

### 배경 및 목적

Notion에서 글을 작성하면 자동으로 블로그에 반영되는 개인 기술 블로그를 구축한다. 별도의 CMS 어드민 없이 Notion 데이터베이스를 콘텐츠 소스로 사용하여 글 작성 및 관리 부담을 최소화한다.

### CMS로 Notion을 선택한 이유

- 이미 익숙한 Notion에서 글을 작성하면 블로그에 자동 반영
- 별도 어드민 UI 개발 불필요
- Notion의 리치 에디터 기능 활용 가능
- 무료 API 제공

---

## 2. 기술 스택

| 영역 | 기술 |
|------|------|
| Frontend | Next.js 15, TypeScript |
| CMS | Notion API (`@notionhq/client`) |
| Styling | Tailwind CSS, shadcn/ui |
| Icons | Lucide React |
| Deployment | Vercel |

---

## 3. Notion 데이터베이스 구조

블로그 글 관리를 위한 Notion 데이터베이스 스키마는 다음과 같다.

| 필드명 | Notion 타입 | 설명 |
|--------|-------------|------|
| Title | title | 글 제목 |
| Category | select | 카테고리 (예: React, Next.js, TypeScript 등) |
| Tags | multi_select | 태그 목록 |
| Published | date | 발행일 |
| Status | select | 글 상태 (`초안` / `발행됨`) |
| Content | page content | 글 본문 (Notion 페이지 내용) |

> **참고:** `Status`가 `발행됨`인 글만 블로그에 노출한다.

---

## 4. 주요 기능

### 4.1 Notion 데이터베이스 연동

- Notion API를 통해 데이터베이스 내 글 목록 조회
- `Status: 발행됨` 필터 적용하여 초안 글 제외
- `Published` 날짜 기준 최신순 정렬

### 4.2 글 목록 페이지

- 발행된 글의 제목, 카테고리, 태그, 발행일 표시
- 페이지 진입 시 최신 글부터 나열

### 4.3 글 상세 페이지

- Notion 페이지 블록을 파싱하여 본문 렌더링
- 제목, 카테고리, 태그, 발행일 메타 정보 표시

### 4.4 카테고리 필터링

- 카테고리별 글 목록 필터링
- 카테고리 목록은 데이터베이스에서 동적으로 가져옴

### 4.5 검색 기능

- 글 제목 기반 클라이언트 사이드 검색
- 실시간 검색 결과 반영

### 4.6 반응형 디자인

- 모바일, 태블릿, 데스크톱 모든 화면에서 최적화된 레이아웃 제공
- Tailwind CSS 반응형 유틸리티 사용

---

## 5. 화면 구성

### 5.1 홈 페이지 (`/`)

```
[헤더: 블로그 제목 + 네비게이션]
[검색창]
[카테고리 필터 탭]
[최근 글 목록 카드 그리드]
[푸터]
```

- 최근 발행된 글 목록 카드 형태로 표시
- 카테고리 탭으로 빠른 필터링
- 검색창으로 글 제목 검색

### 5.2 글 상세 페이지 (`/posts/[id]`)

```
[헤더]
[글 제목]
[카테고리 | 발행일 | 태그]
[본문 콘텐츠]
[이전 글 / 다음 글 네비게이션]
[푸터]
```

- Notion 블록을 HTML로 변환하여 렌더링
- 코드 블록, 이미지, 인용구 등 주요 블록 타입 지원

### 5.3 카테고리 페이지 (`/category/[category]`)

```
[헤더]
[카테고리명]
[해당 카테고리 글 목록]
[푸터]
```

---

## 6. MVP 범위

MVP에서 구현할 항목과 이후 버전으로 미루는 항목을 구분한다.

### MVP에 포함

- [x] Notion API 연동 및 글 목록 조회
- [x] 글 목록 페이지 (홈)
- [x] 글 상세 페이지
- [x] 카테고리 필터링
- [x] 기본 스타일링 (Tailwind CSS + shadcn/ui)
- [x] 반응형 디자인
- [x] Vercel 배포

### MVP 이후 (v2)

- [ ] 검색 기능 고도화 (전문 검색)
- [ ] 다크 모드
- [ ] 글 조회수 집계
- [ ] OG 이미지 자동 생성
- [ ] RSS 피드
- [ ] 댓글 기능 (예: giscus)

---

## 7. 구현 단계

### Step 1. 환경 설정

- Next.js 15 프로젝트 초기화
- `@notionhq/client` 패키지 설치
- `.env.local`에 Notion API 키 및 데이터베이스 ID 설정

```env
NOTION_API_KEY=secret_...
NOTION_DATABASE_ID=...
```

### Step 2. Notion 데이터베이스 설정

- Notion에서 블로그용 데이터베이스 생성
- 위 스키마에 따라 속성 구성
- Integration 생성 후 API 키 발급
- 데이터베이스에 Integration 연결

### Step 3. 글 목록 페이지 구현

- Notion API로 발행된 글 목록 조회하는 서버 함수 작성
- 홈 페이지에서 글 목록 카드 렌더링
- 카테고리 필터 UI 구현

### Step 4. 글 상세 페이지 구현

- `[id]` 동적 라우트 설정
- Notion 페이지 블록 조회 및 렌더링
- `generateStaticParams`로 정적 생성 (ISR 적용)

### Step 5. 스타일링 및 최적화

- shadcn/ui 컴포넌트 적용
- 반응형 레이아웃 완성
- `next/image`로 이미지 최적화
- 메타데이터 설정 (`generateMetadata`)
- Vercel 배포 및 환경 변수 등록

---

## 8. 비기능 요구사항

| 항목 | 목표 |
|------|------|
| 초기 로딩 속도 | LCP 2.5초 이하 |
| 접근성 | 시맨틱 HTML, aria 속성 기본 준수 |
| SEO | 글별 메타 태그, OG 태그 설정 |
| 캐싱 | ISR 적용 (재검증 주기: 60초) |

---

## 9. 디렉토리 구조 (예정)

```
notion-cms-project/
├── app/
│   ├── page.tsx                  # 홈 (글 목록)
│   ├── posts/
│   │   └── [id]/
│   │       └── page.tsx          # 글 상세
│   └── category/
│       └── [category]/
│           └── page.tsx          # 카테고리별 목록
├── components/
│   ├── PostCard.tsx
│   ├── CategoryFilter.tsx
│   ├── SearchBar.tsx
│   └── NotionRenderer.tsx
├── lib/
│   └── notion.ts                 # Notion API 호출 함수
├── types/
│   └── post.ts                   # 타입 정의
├── docs/
│   └── PRD.md
└── .env.local
```
