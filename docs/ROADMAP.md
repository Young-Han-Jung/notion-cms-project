# ROADMAP: 개인 개발 블로그 (Notion CMS 기반)

> **참고 문서:** [PRD](./PRD.md)  
> **총 예상 기간:** 9~14일  
> **목표:** Notion API 연동 개인 기술 블로그 MVP 완성 및 Vercel 배포

---

## 전체 일정 요약

| Phase | 내용 | 예상 기간 | 상태 |
|-------|------|-----------|------|
| Phase 1 | 프로젝트 초기 설정 | 1~2일 | 🔲 예정 |
| Phase 2 | 공통 모듈 개발 | 2~3일 | 🔲 예정 |
| Phase 3 | 핵심 기능 개발 | 3~4일 | 🔲 예정 |
| Phase 4 | 추가 기능 개발 | 2~3일 | 🔲 예정 |
| Phase 5 | 최적화 및 배포 | 1~2일 | 🔲 예정 |

---

## Phase 1: 프로젝트 초기 설정 (1~2일)

> 견고한 기반 없이는 기능 개발이 어렵기 때문에 환경 설정을 먼저 완성한다.

### 작업 목록

- [ ] Next.js 15 프로젝트 생성 (`create-next-app`)
- [ ] TypeScript, Tailwind CSS, ESLint 초기 설정 확인
- [ ] shadcn/ui 초기화 및 기본 컴포넌트 설치
- [ ] Lucide React 설치
- [ ] `@notionhq/client` 패키지 설치
- [ ] `.env.local` 파일 생성 및 Notion API 키 설정
  ```env
  NOTION_API_KEY=secret_...
  NOTION_DATABASE_ID=...
  ```
- [ ] Notion Integration 생성 및 데이터베이스 연결
- [ ] Notion 데이터베이스 스키마 구성 (Title, Category, Tags, Published, Status)
- [ ] 기본 레이아웃 파일 생성 (`app/layout.tsx`)
- [ ] 공통 폴더 구조 생성 (`app/`, `components/`, `lib/`, `types/`)

### 완료 기준

- `npm run dev` 실행 시 오류 없이 로컬 서버 구동
- Notion API 키로 데이터베이스 조회 성공 확인

---

## Phase 2: 공통 모듈 개발 (2~3일)

> 모든 기능에서 재사용되는 코드를 먼저 만들어야 이후 중복을 방지할 수 있다.

### 작업 목록

**타입 정의** (`types/post.ts`)
- [ ] `Post` 타입 정의 (id, title, category, tags, publishedAt, status)
- [ ] `Category` 타입 정의

**Notion API 공통 함수** (`lib/notion.ts`)
- [ ] Notion 클라이언트 초기화
- [ ] `fetchPages()` — 발행된 글 목록 조회 (Status: 발행됨 필터, Published 최신순 정렬)
- [ ] `fetchPageContent(id)` — 개별 글 블록 조회
- [ ] `fetchCategories()` — 카테고리 목록 조회

**공통 컴포넌트** (`components/`)
- [ ] `Header` — 블로그 제목, 네비게이션
- [ ] `Footer` — 기본 푸터
- [ ] `PostCard` — 글 목록 카드 (제목, 카테고리, 태그, 발행일)

### 완료 기준

- `fetchPages()` 호출 시 Notion 데이터베이스에서 글 목록 정상 반환
- `PostCard` 컴포넌트가 더미 데이터로 정상 렌더링

---

## Phase 3: 핵심 기능 개발 (3~4일)

> 블로그의 가장 기본이 되는 기능으로, 이것 없이는 서비스 자체가 성립하지 않는다.

### 작업 목록

**글 목록 페이지** (`app/page.tsx`)
- [ ] `fetchPages()` 호출 후 `PostCard` 목록 렌더링
- [ ] 최신순 정렬 표시
- [ ] 로딩 상태 처리

**글 상세 페이지** (`app/posts/[id]/page.tsx`)
- [ ] 동적 라우트 `[id]` 설정
- [ ] `fetchPageContent(id)`로 블록 조회
- [ ] 글 메타 정보 표시 (제목, 카테고리, 태그, 발행일)
- [ ] `generateStaticParams`로 정적 생성 설정
- [ ] ISR 설정 (`revalidate: 60`)

**Notion 컨텐츠 렌더링** (`components/NotionRenderer.tsx`)
- [ ] 단락(paragraph) 블록 렌더링
- [ ] 제목(heading_1, heading_2, heading_3) 블록 렌더링
- [ ] 코드(code) 블록 렌더링
- [ ] 이미지(image) 블록 렌더링
- [ ] 인용구(quote) 블록 렌더링
- [ ] 목록(bulleted_list_item, numbered_list_item) 블록 렌더링

### 완료 기준

- 홈에서 글 목록이 Notion 데이터 기반으로 렌더링됨
- 카드 클릭 시 상세 페이지로 이동, 본문이 정상 표시됨

---

## Phase 4: 추가 기능 개발 (2~3일)

> 핵심 기능이 완성된 후 사용자 경험을 향상시키는 부가 기능을 추가한다.

### 작업 목록

**카테고리 필터링** (`components/CategoryFilter.tsx`, `app/category/[category]/page.tsx`)
- [ ] 홈 페이지에 카테고리 탭 필터 UI 구현
- [ ] 카테고리 선택 시 해당 글만 표시
- [ ] 카테고리 전용 페이지 (`/category/[category]`) 구현
- [ ] 카테고리 목록 동적 생성 (`fetchCategories()` 활용)

**검색 기능** (`components/SearchBar.tsx`)
- [ ] 검색창 UI 구현
- [ ] 글 제목 기반 클라이언트 사이드 필터링
- [ ] 실시간 검색 결과 반영

**SEO 최적화**
- [ ] 홈 페이지 기본 메타 태그 설정
- [ ] 글 상세 페이지 `generateMetadata` 설정 (제목, 설명, OG 태그)
- [ ] `robots.txt`, `sitemap.xml` 생성

### 완료 기준

- 카테고리 탭 클릭 시 해당 카테고리 글만 필터링됨
- 검색어 입력 시 실시간으로 글 목록 필터링됨
- 글 상세 페이지에서 OG 태그 확인 가능

---

## Phase 5: 최적화 및 배포 (1~2일)

> 기능이 완성된 후 성능과 품질을 높여 실제 서비스 수준으로 마무리한다.

### 작업 목록

**성능 최적화**
- [ ] `next/image`로 이미지 최적화 적용
- [ ] 불필요한 리렌더링 점검
- [ ] LCP 2.5초 이하 달성 확인 (Lighthouse 기준)

**반응형 디자인 개선**
- [ ] 모바일 (~ 768px) 레이아웃 점검
- [ ] 태블릿 (768px ~ 1024px) 레이아웃 점검
- [ ] 데스크톱 (1024px ~) 레이아웃 점검

**Vercel 배포**
- [ ] Vercel 프로젝트 생성 및 GitHub 저장소 연결
- [ ] 환경 변수 등록 (`NOTION_API_KEY`, `NOTION_DATABASE_ID`)
- [ ] 프로덕션 배포 후 정상 동작 확인
- [ ] 커스텀 도메인 설정 (선택)

### 완료 기준

- Vercel 프로덕션 URL에서 전체 기능 정상 동작
- Lighthouse 성능 점수 80점 이상

---

## MVP 이후 백로그 (v2)

PRD의 v2 항목으로 MVP 완성 후 우선순위에 따라 진행한다.

| 기능 | 우선순위 | 비고 |
|------|----------|------|
| 다크 모드 | 높음 | Tailwind `dark:` 클래스 활용 |
| OG 이미지 자동 생성 | 높음 | `next/og` (ImageResponse) 활용 |
| RSS 피드 | 중간 | `/feed.xml` 라우트 핸들러 구현 |
| 댓글 기능 | 중간 | giscus (GitHub Discussions 기반) |
| 글 조회수 집계 | 낮음 | 별도 DB 필요 (예: Vercel KV) |
| 검색 기능 고도화 | 낮음 | Algolia 또는 전문 검색 엔진 연동 |
