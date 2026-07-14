# LocalHub Frontend

광주·전라 지역의 맛집 정보를 조회하고, 현지 사용자들의 후기를 익명으로 공유할 수 있는 지역 정보 커뮤니티 서비스입니다.

사용자는 지역별 맛집을 검색하고 상세 정보를 확인할 수 있으며, 카카오맵을 통해 위치 확인 및 길찾기를 이용할 수 있습니다.  
또한 AI 챗봇을 통해 광주·전라 지역의 맛집과 주변 관광지를 추천받을 수 있습니다.

---

## 1. 프로젝트 개요

- 프로젝트명: LocalHub
- 선정 권역: 광주·전라
- 개발 기간: 2026.07.14 ~ 2026.07.16
- 개발 인원: 3명
- 프론트엔드: Vue 3
- 백엔드: FastAPI
- 데이터베이스: SQLite

---

## 2. 핵심 기능

### Must Have

- 광주·전라 음식점 목록 조회
- 음식점 검색
- 음식점 상세 조회
- AI 챗봇을 통한 맛집 및 관광지 추천
- 익명 게시판 CRUD
- 게시글 비밀번호 기반 수정 및 삭제
- Vue 3 SPA 구현
- FastAPI REST API 연동
- Netlify 배포

### Should / Could Have

- 카카오맵 음식점 위치 표시
- 현재 위치에서 음식점까지 길찾기
- 게시글 조회수
- 게시글 검색

---

## 3. 기술 스택

### Frontend

- Vue 3
- Vite
- Vue Router
- Pinia
- Axios
- Kakao Maps JavaScript SDK

### Deployment

- Netlify

---

## 4. 실행 방법

### 4.1 저장소 복제

```bash
git clone https://github.com/sc-teamproject/Frontend.git
cd Frontend