# 개인 개발 블로그

Notion을 CMS로 활용한 개인 기술 블로그입니다. Notion 데이터베이스에 글을 작성하면 자동으로 블로그에 반영됩니다.

## 기술 스택

- **Frontend**: Next.js 15, TypeScript
- **CMS**: Notion API (`@notionhq/client`)
- **Styling**: Tailwind CSS, shadcn/ui
- **Icons**: Lucide React
- **Deployment**: Vercel

## 주요 기능

- Notion 데이터베이스에서 블로그 글 목록 조회
- 개별 글 상세 페이지
- 카테고리별 필터링
- 검색 기능
- 반응형 디자인

## 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env.local` 파일을 생성하고 아래 값을 입력합니다.

```env
NOTION_API_KEY=secret_...
NOTION_DATABASE_ID=...
```

Notion API 키 발급 방법:
1. [Notion Developers](https://www.notion.so/my-integrations)에서 Integration 생성
2. API 키 복사 후 `NOTION_API_KEY`에 입력
3. 연결할 데이터베이스 ID를 `NOTION_DATABASE_ID`에 입력

### 3. Notion 데이터베이스 구조

| 필드 | 타입 | 설명 |
|------|------|------|
| Title | title | 글 제목 |
| Category | select | 카테고리 |
| Tags | multi_select | 태그 |
| Published | date | 발행일 |
| Status | select | `초안` / `발행됨` |

### 4. 개발 서버 실행

```bash
npm run dev
```

`http://localhost:3000`에서 확인할 수 있습니다.

## 배포

Vercel에 배포 시 환경 변수(`NOTION_API_KEY`, `NOTION_DATABASE_ID`)를 프로젝트 설정에 등록합니다.

## 문서

- [PRD (제품 요구사항 문서)](./docs/PRD.md)
