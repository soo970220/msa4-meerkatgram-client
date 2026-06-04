# 08. 프론트엔드 개요

## 1. 프로젝트 소개

**Meerkatgram 프론트엔드**는 Vue 3 기반 SPA(Single Page Application)이다.  
백엔드 API 서버(Spring Boot 3)와 HTTP 통신하며, 사용자가 이미지 게시글을 올리고 소통하는 커뮤니티 화면을 제공한다.

---

## 2. 기술 스택

| 영역 | 기술 | 버전 | 선택 이유 |
|------|------|------|-----------|
| UI 프레임워크 | Vue 3 | 3.5 | Composition API로 로직 재사용성 향상 |
| 상태 관리 | Pinia | 3.0 | Vue 공식 권장 상태 관리 라이브러리, Vuex 대비 간결한 문법 |
| 라우팅 | Vue Router | 4.6 | Vue 공식 라우팅 라이브러리, 네비게이션 가드 지원 |
| HTTP 클라이언트 | Axios | 1.16 | 인터셉터 기반 요청/응답 가공, Promise 지원 |
| JWT 디코드 | jwt-decode | 4.0 | 클라이언트 측 토큰 만료 시각 파싱 |
| 날짜/시간 | dayjs | 1.11 | 토큰 만료 시간 비교, 경량 날짜 라이브러리 |
| 빌드 도구 | Vite | 8.0 | 빠른 개발 서버 HMR, ES Module 기반 번들링 |

---

## 3. 주요 기능 구현 현황

| 분류 | 기능 | 상태 |
|------|------|------|
| 인증 | 로그인 | ✅ 구현 |
| 인증 | 회원가입 | ⬜ 미구현 |
| 인증 | 로그아웃 | ⬜ 미구현 |
| 인증 | Access Token 재발급 | ✅ 구현 |
| 유저 | 유저 정보 조회 | ⬜ 미구현 |
| 게시글 | 목록 (페이지네이션) | ✅ 구현 |
| 게시글 | 상세 조회 | ⬜ 미구현 |
| 게시글 | 작성 | ⬜ 미구현 |
| 게시글 | 삭제 | ⬜ 미구현 |
| 파일 | 게시글 이미지 업로드 | ⬜ 미구현 |
| 파일 | 프로필 이미지 업로드 | ⬜ 미구현 |

---

## 4. 디렉토리 구조

```
src/
│
├── main.js                          ← 앱 진입점 (Vue 인스턴스, 플러그인 등록)
├── App.vue                          ← 루트 컴포넌트 (Header + Main 레이아웃)
├── style.css                        ← 전역 CSS 변수 및 스타일
│
├── api/
│   └── myAxios.js                   ← Axios 인스턴스 (baseURL, 인터셉터)
│
├── components/                      ← 공통 재사용 컴포넌트
│   ├── Header.vue                   ← 상단 네비게이션 바
│   ├── Main.vue                     ← 에러/라우터 뷰 분기 컨테이너
│   ├── button/
│   │   └── MyButton.vue             ← 공통 버튼
│   ├── input/
│   │   └── MyInput.vue              ← 공통 인풋
│   └── text-decoration/
│       └── MyStrikeThroughBehindWord.vue  ← 양쪽 수평선 텍스트 데코레이터
│
├── pages/                           ← 라우트에 대응하는 페이지 컴포넌트
│   ├── auth/
│   │   └── Login.vue                ← 로그인 페이지
│   ├── posts/
│   │   └── PostIndex.vue            ← 게시글 목록 페이지
│   └── errors/
│       └── MyError.vue              ← 전역 에러 표시 페이지
│
├── routes/
│   └── router.js                    ← Vue Router 설정 및 네비게이션 가드
│
├── store/                           ← Pinia 상태 관리
│   ├── auth/
│   │   └── useAuthStore.js          ← 인증 상태 (로그인 여부, 토큰, 유저 정보)
│   ├── post/
│   │   └── usePostIndexStore.js     ← 게시글 목록 상태 (목록, 페이지)
│   └── error/
│       └── useMyErrorStore.js       ← 전역 에러 상태
│
└── utils/
    └── validator/
        ├── domain/
        │   └── auth/
        │       └── loginValidator.js    ← 로그인 폼 검증 함수 모음
        └── rules/
            └── userValidatorRules.js    ← 이메일·비밀번호 유효성 검증 규칙
```

---

## 5. 전체 데이터 흐름

사용자가 화면에서 액션을 취하면 아래 순서로 처리된다.

```
사용자 (브라우저)
    │
    │  클릭 / 폼 제출
    ▼
[Page / Component]                   ← 사용자 이벤트 수신
    │
    │  Store Action 호출
    ▼
[Pinia Store]                        ← 비즈니스 로직, 상태 관리
    │
    │  myAxios 호출
    ▼
[myAxios (인터셉터)]                  ← 토큰 만료 확인, Authorization 헤더 주입
    │
    │  HTTP Request
    ▼
[백엔드 API (Spring Boot)]
    │
    │  HTTP Response { code, message, data }
    ▼
[Pinia Store]                        ← 응답 데이터로 상태 업데이트
    │
    ▼
[Page / Component]                   ← 반응형 상태 변화 → 화면 자동 갱신
```

### 에러 발생 시 흐름

API 호출 중 에러가 발생하면 Store에서 `useMyErrorStore`에 에러 정보를 저장하고, `Main.vue`가 이를 감지하여 라우터 뷰 대신 `MyError.vue`를 표시한다.

```
myAxios → 에러 응답
    │
    ▼
Store (catch 블록)
    │  useMyErrorStore().setErrorInfo(error)
    ▼
useMyErrorStore (isError = true)
    │
    ▼
Main.vue (v-if="myErrorStore.isError")
    │
    ▼
MyError.vue 표시 (에러 코드 + 메시지 + 메인으로 이동 버튼)
```
