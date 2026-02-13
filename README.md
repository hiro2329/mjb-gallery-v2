# 📸 MJB Photo Gallery (Ver.2)

React와 Supabase를 활용하여 구축한 반응형 이미지 갤러리입니다. > TanStack Query를 도입하여 최적화된 캐싱 전략을 구현했으며, 관리자 페이지를 통해 사진 데이터를 안전하게 관리합니다.

<div align="center"> <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=React&logoColor=black"> <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=TypeScript&logoColor=white"> <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=Tailwind CSS&logoColor=white"> <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=Supabase&logoColor=white"> <img src="https://img.shields.io/badge/React_Query-FF4154?style=for-the-badge&logo=React Query&logoColor=white"> <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=Vercel&logoColor=white"> </div>

## 🔗 링크 (Links)

**배포 링크** (Deployment)
👉 https://mjb-gallery-v2.vercel.app/

**Project Docs (Notion):**
👉 https://adorable-panama-924.notion.site/Project-MJB-Photo-Gallery-v2-0-Refactoring-2e08c3bce035801a9308f3a2327237f5?source=copy_link

> 📌 **개발 동기, 기술적 의사결정, 트러블슈팅 로그** 등 프로젝트의 모든 과정을 기록했습니다.

👀 미리보기

1. 갤러리 뷰 (Gallery View)
   반응형 그리드 레이아웃과 모달을 통한 이미지 상세 보기 경험을 제공합니다.

![갤러리_시연](public/갤러리%20뷰.gif)

2. 관리자 로그인 (Admin Auth)
   Supabase Auth와 Protected Route를 통해 인가되지 않은 사용자의 접근을 차단합니다.

![로그인_시연](public/로그인%20시연.gif)

3. 사진 업로드 (Image Upload)
   browser-image-compression을 통해 이미지를 자동 압축(WebP, 1MB 이하)하여 업로드합니다.

![업로드_시연](public/업로드%20시연.gif)

4. 데이터 수정 및 삭제 (Edit & Delete)
   데이터를 수정하거나 삭제하면, React Query의 invalidateQueries가 동작하여 즉시 UI에 반영됩니다.

![수정_시연](public/수정%20시연.gif)
![삭제_시연](public/삭제%20시연.gif)

🚀 5. 성능 최적화: 캐싱 시연 (Zero Latency)
(핵심 기능) Network 탭을 확인해보세요!

이미 방문했던 카테고리(Jeju ↔ Sapporo)를 다시 클릭할 때, **서버 요청(Fetch) 없이 캐시된 데이터를 즉시 반환(0ms)**하여 로딩 없는 경험을 제공합니다.

![캐싱_시연](public/캐싱시연.gif.gif)

🛠 기술 스택 (Tech Stack)
Frontend
Core: React, TypeScript, Vite

State Management: TanStack Query (React Query) - Server State 관리 및 캐싱

Styling: Tailwind CSS - Mobile First 반응형 디자인

Routing: React Router DOM v6

Utility: browser-image-compression (이미지 최적화)

Backend (BaaS)
Database: Supabase (PostgreSQL)

Storage: Supabase Storage (이미지 호스팅)

Auth: Supabase Auth (관리자 인증)

🔥 기술적 챌린지 및 해결 (Technical Challenges)

1. React Query 도입을 통한 렌더링 최적화
   문제 (Problem): 기존 useEffect 방식은 페이지 이동 시마다 불필요한 네트워크 요청이 발생하여 로딩 스피너가 반복적으로 노출됨.

해결 (Solution): TanStack Query를 도입하여 Server State를 관리.

staleTime을 5분으로 설정하여, 동일한 데이터 요청 시 캐시된 데이터를 사용하여 로딩 시간 0초 달성.

위 '미리보기 5번' 영상에서 네트워크 요청이 발생하지 않는 것을 확인할 수 있음.

2. 데이터 무결성 유지를 위한 Invalidation 전략
   문제 (Problem): 캐싱 시간이 길어짐에 따라, 관리자가 사진을 추가/삭제해도 갤러리 페이지에 즉시 반영되지 않는 문제 발생.

해결 (Solution): 관리자 기능(업로드/수정/삭제) 성공 시 queryClient.invalidateQueries를 실행.

관련된 쿼리 데이터를 강제로 '상한 상태(Stale)'로 처리하여, 갤러리 진입 시 자동으로 최신 데이터를 서버에서 받아오도록 구현.

3. Supabase RLS를 이용한 강력한 보안 적용
   문제 (Problem): 프론트엔드 라우팅만으로는 API를 통한 직접적인 데이터 변조를 막을 수 없음.

해결 (Solution): Supabase의 Row Level Security (RLS) 및 Storage Policy 적용.

SELECT: public (누구나 조회 가능)

INSERT/UPDATE/DELETE: authenticated (로그인한 관리자만 가능)

DB와 스토리지 모두 정책을 적용하여 보안 구멍 원천 봉쇄.

🚀 설치 및 실행 (Getting Started)
⚠️ 관리자 기능 테스트 방법
이 프로젝트는 개인 포트폴리오 용도로, 배포된 사이트에서는 관리자 로그인이 제한됩니다. 관리자 기능을 직접 테스트하고 싶으시다면, 로컬 환경에서 본인의 Supabase 프로젝트를 연결하여 테스트해 보실 수 있습니다.

프로젝트 클론

Bash

git clone [[레포지토리\_주소](https://github.com/hiro2329/mjb-gallery-v2)]
패키지 설치

Bash

npm install
환경 변수 설정 (.env)

Bash

VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
실행

Bash

npm run dev
