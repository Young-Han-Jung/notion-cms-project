# Development Guidelines

## 프로젝트 개요

- Notion API(`@notionhq/client`)를 CMS로 사용하는 Next.js 15 개인 기술 블로그
- Notion 데이터베이스의 `Status: 발행됨` 글만 블로그에 노출
- 배포: Vercel

---

## 프로젝트 아키텍처

### 디렉토리 구조

```
notion-cms-project/
├── app/
│   ├── layout.tsx                  # 루트 레이아웃 (Header, Footer 포함)
│   ├── page.tsx                    # 홈 (글 목록 + 카테고리 필터 + 검색)
│   ├── posts/[id]/page.tsx         # 글 상세
│   └── category/[category]/page.tsx # 카테고리별 목록
├── components/
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── PostCard.tsx
│   ├── CategoryFilter.tsx
│   ├── SearchBar.tsx
│   └── NotionRenderer.tsx
├── lib/
│   └── notion.ts                   # Notion API 호출 전용 모듈
├── types/
│   └── post.ts                     # Post, Category 타입 정의
└── docs/
    ├── PRD.md
    └── ROADMAP.md
```

### 파일 역할 규칙

- `lib/notion.ts`: 모든 Notion API 호출은 이 파일에만 작성
- `types/post.ts`: 프로젝트 전역 타입은 이 파일에만 정의
- `components/NotionRenderer.tsx`: Notion 블록을 HTML로 변환하는 렌더러 전용

---

## 코드 규칙

### 네이밍

- 컴포넌트 파일: PascalCase (`PostCard.tsx`, `NotionRenderer.tsx`)
- 함수/변수: camelCase
- 타입/인터페이스: PascalCase

### 들여쓰기

- 2칸 스페이스

### 타입

- `any` 타입 사용 금지
- `Post`, `Category` 타입은 반드시 `types/post.ts`에서 import
- Notion API 응답 타입은 `@notionhq/client`의 내장 타입 활용

---

## Notion API 규칙

### 함수명 고정 (`lib/notion.ts`)

| 함수 | 역할 |
|------|------|
| `fetchPages()` | 발행된 글 목록 조회 (Status: 발행됨 필터, Published 최신순) |
| `fetchPageContent(id: string)` | 특정 글의 Notion 블록 조회 |
| `fetchCategories()` | 카테고리 목록 조회 |

### Notion 데이터베이스 필드명

| 필드 | Notion 타입 | 값 |
|------|-------------|----|
| `Title` | title | 글 제목 |
| `Category` | select | 카테고리 |
| `Tags` | multi_select | 태그 배열 |
| `Published` | date | 발행일 |
| `Status` | select | `초안` / `발행됨` |

- `fetchPages()` 호출 시 반드시 `Status == "발행됨"` 필터 적용
- 정렬: `Published` 내림차순

---

## 환경 변수 규칙

- 사용 가능한 환경 변수: `NOTION_API_KEY`, `NOTION_DATABASE_ID`
- 환경 변수는 `lib/notion.ts` 서버 모듈에서만 접근
- **`"use client"` 컴포넌트에서 `process.env` 직접 접근 금지**
- `.env.local`에만 저장, `.env` 파일 생성 금지

---

## 컴포넌트 작성 규칙

### Server / Client 컴포넌트

- 기본값: Server Component (파일 상단에 `"use client"` 없음)
- `"use client"` 추가 조건: `useState`, `useEffect`, 이벤트 핸들러가 필요한 경우만
- 데이터 페칭은 Server Component에서 수행 후 props로 전달

### shadcn/ui 우선 사용

- 버튼, 입력창, 카드 등 UI 요소는 shadcn/ui 컴포넌트를 먼저 사용
- shadcn/ui에 없는 경우에만 직접 작성

### 금지

- 클라이언트 컴포넌트에서 Notion API 직접 호출 금지
- `lib/notion.ts` 외 파일에서 `@notionhq/client` import 금지

---

## 데이터 페칭 및 캐싱 규칙

### ISR 설정

- 모든 페이지에 `export const revalidate = 60` 적용
- 글 상세 페이지(`app/posts/[id]/page.tsx`)에는 반드시 `generateStaticParams` 구현

### generateStaticParams 패턴

```typescript
export async function generateStaticParams() {
  const pages = await fetchPages();
  return pages.map((page) => ({ id: page.id }));
}
```

---

## NotionRenderer 블록 지원 목록

`components/NotionRenderer.tsx`에서 렌더링해야 하는 블록 타입:

- `paragraph`
- `heading_1`, `heading_2`, `heading_3`
- `code`
- `image`
- `quote`
- `bulleted_list_item`
- `numbered_list_item`

지원하지 않는 블록 타입은 무시(렌더링 생략)하되, 에러를 throw하지 않음

---

## 다중 파일 수정 기준

| 변경 내용 | 동시 수정 필요 파일 |
|-----------|---------------------|
| Post 타입 필드 추가 | `types/post.ts` + `lib/notion.ts` (매핑 로직) |
| 새 Notion API 함수 추가 | `lib/notion.ts` + 해당 함수를 사용하는 페이지/컴포넌트 |
| 새 라우트 추가 | `app/[route]/page.tsx` + `components/Header.tsx` (네비게이션) |
| 카테고리 페이지 수정 | `app/category/[category]/page.tsx` + `components/CategoryFilter.tsx` |

---

## AI 의사결정 기준

### 데이터 페칭 위치 결정

```
데이터 필요 여부?
├── 서버에서 정적으로 가능 → Server Component에서 fetch
├── 사용자 인터랙션 후 필요 → props로 전달받거나 Server Action 사용
└── 실시간 필터링 (검색, 카테고리) → 초기 데이터는 서버, 필터링은 클라이언트
```

### 컴포넌트 분리 기준

- 동일 UI가 2곳 이상 사용되면 `components/`로 분리
- 페이지 전용 UI는 해당 `page.tsx` 파일 내 로컬 컴포넌트로 유지

### 스타일링 우선순위

1. shadcn/ui 컴포넌트
2. Tailwind CSS 유틸리티 클래스
3. CSS Modules (필요 시)

---

## 금지 사항

- `any` 타입 사용 금지
- `lib/notion.ts` 외부에서 `@notionhq/client` import 금지
- 클라이언트 컴포넌트에서 Notion API 호출 금지
- `Status: 초안` 글을 목록이나 상세 페이지에 노출 금지
- `process.env`를 `"use client"` 컴포넌트에서 직접 참조 금지
- `revalidate` 설정 없이 데이터 페칭하는 정적 페이지 생성 금지
- `NOTION_API_KEY`, `NOTION_DATABASE_ID` 외 Notion 관련 환경 변수 추가 금지
