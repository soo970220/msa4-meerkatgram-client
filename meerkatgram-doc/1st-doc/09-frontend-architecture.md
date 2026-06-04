# 09. 프론트엔드 아키텍처

## 1. 레이어 구조

프론트엔드는 역할에 따라 세 레이어로 나뉜다.

```
┌────────────────────────────────────────────┐
│          View Layer (Pages / Components)   │  화면 렌더링, 사용자 이벤트 처리
└────────────────────┬───────────────────────┘
                     │ Action 호출 / 상태 구독
┌────────────────────▼───────────────────────┐
│          Store Layer (Pinia)               │  상태 관리, API 호출, 비즈니스 로직
└────────────────────┬───────────────────────┘
                     │ HTTP 요청
┌────────────────────▼───────────────────────┐
│          API Layer (myAxios)               │  HTTP 통신, 토큰 주입
└────────────────────────────────────────────┘
```

| 레이어 | 구성 파일 | 책임 | 금지 사항 |
|--------|-----------|------|-----------|
| View | `pages/`, `components/` | 화면 렌더링, 이벤트 수신 | 직접 API 호출, 복잡한 비즈니스 로직 |
| Store | `store/` | 상태 관리, API 호출, 상태 가공 | DOM 조작, 라우팅 |
| API | `api/myAxios.js` | HTTP 요청/응답, 토큰 주입 | 상태 직접 변경, 화면 렌더링 |

---

## 2. View Layer

### 컴포넌트 계층 구조

```
App.vue
├── Header.vue                     ← 모든 페이지 공통 상단 바
└── Main.vue                       ← 에러 여부에 따라 분기
    ├── MyError.vue                ← isError = true 일 때 표시
    └── <router-view>              ← isError = false 일 때 현재 라우트 렌더링
        ├── Login.vue              ← /login
        └── PostIndex.vue          ← /posts
```

### Pages vs Components 구분 기준

| 구분 | 위치 | 특징 |
|------|------|------|
| Page | `src/pages/` | 라우트와 1:1 대응. Vue Router가 직접 렌더링 |
| Component | `src/components/` | 여러 페이지/컴포넌트에서 재사용. 라우트 비종속 |

---

## 3. Store Layer (Pinia)

Pinia는 Vue 공식 상태 관리 라이브러리로, Composition API 스타일로 작성한다.  
이 프로젝트는 Setup Store 방식(`defineStore` + `() => {}`)을 사용한다.

### Store 목록

| Store | 파일 | 관리 대상 |
|-------|------|-----------|
| `useAuthStore` | `store/auth/useAuthStore.js` | 로그인 여부, Access Token, 유저 정보 |
| `usePostIndexStore` | `store/post/usePostIndexStore.js` | 게시글 목록, 현재 페이지, 마지막 페이지 여부 |
| `useMyErrorStore` | `store/error/useMyErrorStore.js` | 에러 발생 여부, 에러 코드, 에러 메시지 |

### Store 내부 구조 패턴

```js
export const useXxxStore = defineStore('xxxStore', () => {
  // 1. State (ref)      ← 반응형 상태 변수
  // 2. Getters (computed) ← 상태에서 파생된 값
  // 3. Actions (function) ← 상태 변경 및 API 호출 함수

  return { /* 외부에 노출할 state, getters, actions */ }
});
```

### useAuthStore 상세

```js
// store/auth/useAuthStore.js

const isLoggedIn = ref(false);      // 로그인 여부
const accessToken = ref('');        // 메모리에만 저장 (보안: localStorage 미사용)
const userInfo = ref(null);         // 로그인한 유저 정보
const isTryReissue = ref(false);    // 재발급 시도 여부 (무한 루프 방지)
```

> **accessToken을 메모리에만 저장하는 이유**  
> localStorage/sessionStorage에 저장하면 XSS 공격으로 탈취될 수 있다.  
> 대신 Refresh Token은 HttpOnly 쿠키로 백엔드가 관리하여 JS에서 접근 불가하다.

### usePostIndexStore 상세

```js
// store/post/usePostIndexStore.js

const items = ref([]);             // 게시글 배열 (페이지 누적)
const isLastPage = ref(false);     // 마지막 페이지 도달 여부
const currentPage = ref(0);        // 현재까지 로드한 페이지 번호

const getNextPageNumber = computed(() => currentPage.value + 1);  // 다음 요청 페이지
```

### useMyErrorStore 상세

```js
// store/error/useMyErrorStore.js

const isError = ref(false);        // 에러 표시 여부 (Main.vue가 구독)
const errorCode = ref('');         // 백엔드 에러 코드 (예: "UNAUTHORIZED")
const errorMsg = ref('');          // 사용자에게 표시할 에러 메시지
```

---

## 4. API Layer

### myAxios 인스턴스

`src/api/myAxios.js`에서 Axios 인스턴스를 생성하여 전역에서 공유한다.

```js
const myAxios = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,  // 환경 변수로 baseURL 관리
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,                        // Refresh Token 쿠키 전송 허용
});
```

`withCredentials: true` 설정이 필요한 이유: Refresh Token은 HttpOnly 쿠키로 전달되며, 크로스 오리진 요청에서 쿠키를 자동으로 첨부하려면 이 옵션이 필수다.

---

## 5. 라우터 구조

```js
// routes/router.js

const routes = [
  { path: '/',        redirect: '/posts' },         // 루트 → 게시글 목록으로 리다이렉트
  { path: '/login',   component: Login,    meta: { guestOnly: true } },   // 비로그인 전용
  { path: '/posts',   component: PostIndex },       // 게시글 목록 (공개)
  // { path: '/posts/:id', component: PostShow, ... }  ← 미구현 (게시글 상세)
];
```

### meta 옵션

| 옵션 | 타입 | 의미 |
|------|------|------|
| `isAuthenticated` | Boolean | `true` → 로그인한 사용자만 접근 가능 |
| `guestOnly` | Boolean | `true` → 비로그인 사용자만 접근 가능 (로그인 상태면 `/`로 이동) |

---

## 6. 유틸리티 구조

### 유효성 검증 (validator)

두 단계로 분리되어 있다.

```
utils/validator/
├── rules/
│   └── userValidatorRules.js     ← 도메인 무관한 순수 검증 규칙 함수
└── domain/
    └── auth/
        └── loginValidator.js     ← 로그인 도메인용 검증 함수 조합
```

**규칙 함수** (`userValidatorRules.js`): 입력값을 받아 에러 메시지 문자열을 반환한다.  
에러 없으면 빈 문자열 `''` 반환.

```js
export const email = (input) => {
  if (!input) return '이메일은 필수입니다.';
  if (!regex.test(input)) return '이메일 양식이 올바르지 않습니다.';
  return '';
};
```

**도메인 조합** (`loginValidator.js`): 규칙 함수를 조합하여 도메인별로 re-export.

```js
import { email, password } from '../../rules/userValidatorRules';
export default { email, password };
```

이 구조 덕분에 같은 규칙 함수를 회원가입, 정보 수정 등 다른 도메인에서도 재사용할 수 있다.
