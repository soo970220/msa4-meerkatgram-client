# 10. 프론트엔드 인증 흐름

## 1. 인증 개요

이 프로젝트는 **Access Token + Refresh Token** 이중 토큰 방식을 사용한다.

| 토큰 | 저장 위치 | 관리 주체 | 특징 |
|------|-----------|-----------|------|
| Access Token | 메모리 (Pinia Store) | 프론트엔드 | 짧은 만료 시간, JS로 접근 가능 |
| Refresh Token | HttpOnly 쿠키 | 백엔드 발급/관리 | JS 접근 불가, 탈취 위험 최소화 |

Access Token은 만료가 임박하면 프론트엔드가 자동으로 재발급을 요청한다.  
Refresh Token은 쿠키에 담겨 자동으로 요청에 포함되어 JS 코드에서 직접 다루지 않는다.

---

## 2. 전체 인증 흐름

```
[최초 앱 진입]
    │
    ▼
라우터 가드 (beforeEach)
    │  isLoggedIn = false, isTryReissue = false
    │
    ├─▶ POST /api/reissue-token (Refresh Token 쿠키 자동 첨부)
    │       ├─ 성공 → accessToken, userInfo 저장, isLoggedIn = true
    │       └─ 실패 → isTryReissue = true, /login 으로 이동
    │
    ▼
[로그인 페이지 or 요청한 페이지 진입]
    │
    │  (로그인 페이지에서 폼 제출 시)
    ▼
POST /api/login
    │  성공 → accessToken, userInfo 저장, isLoggedIn = true
    │
    ▼
[이후 API 요청마다]
    │
    ▼
myAxios 요청 인터셉터
    │  토큰 만료 5분 전 이내?
    │       ├─ 예 → POST /api/reissue-token → 새 accessToken으로 교체
    │       └─ 아니오 → 기존 accessToken 사용
    │
    │  Authorization: Bearer {accessToken} 헤더 자동 추가
    ▼
백엔드 API 호출
```

---

## 3. 로그인

### 흐름

```
Login.vue (폼 제출)
    │  authStore.login(inputs)
    ▼
useAuthStore.login()
    │  POST /api/login  { email, password }
    ▼
백엔드
    │  응답: { accessToken, user }
    │  Set-Cookie: refreshToken=...; HttpOnly
    ▼
useAuthStore
    │  isLoggedIn = true
    │  accessToken = 응답값
    │  userInfo = 응답값
    ▼
Login.vue
    │  router.replace('/posts')  ← 히스토리 스택 교체 (뒤로 가기로 로그인 페이지 복귀 방지)
    ▼
PostIndex.vue
```

### 코드

```js
// store/auth/useAuthStore.js
const login = async (inputs) => {
  try {
    const res = await myAxios.post('/api/login', inputs);
    const data = res.data.data;
    isLoggedIn.value = true;
    accessToken.value = data.accessToken;
    userInfo.value = data.user;
    isTryReissue.value = false;
  } catch (error) {
    clearAuthStore();
    useMyErrorStore().setErrorInfo(error);
  }
};
```

> **로그인 실패 시**: `clearAuthStore()`로 상태를 초기화하고, `useMyErrorStore`에 에러를 전달하여 에러 화면을 표시한다.

---

## 4. 토큰 재발급 (Refresh Token 흐름)

### 재발급이 필요한 두 가지 상황

| 상황 | 트리거 |
|------|--------|
| 앱 최초 진입 (새로고침 등) | 라우터 가드 `beforeEach` |
| API 요청 직전 토큰 만료 임박 | myAxios 요청 인터셉터 |

### 코드 — useAuthStore.reissue()

```js
// store/auth/useAuthStore.js
const reissue = async () => {
  try {
    const res = await myAxios.post('/api/reissue-token');
    const data = res.data.data;
    isLoggedIn.value = true;
    accessToken.value = data.accessToken;
    userInfo.value = data.user;
  } catch (error) {
    clearAuthStoreReissue();  // isTryReissue = true 로 설정하여 재시도 방지
  }
};
```

`reissue` 요청은 별도 Authorization 헤더 없이 Refresh Token 쿠키만으로 인증된다.  
`clearAuthStoreReissue()`는 상태 초기화와 함께 `isTryReissue = true`를 설정하여 라우터 가드가 재발급을 무한 반복하는 것을 막는다.

---

## 5. 라우터 가드 (네비게이션 가드)

모든 라우트 이동 전에 `beforeEach` 훅이 실행된다.

```js
// routes/router.js
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  // 1단계: 아직 로그인 상태가 아니고 재발급 시도도 안 했으면 재발급 시도
  if (!authStore.isLoggedIn && !authStore.isTryReissue) {
    try {
      await authStore.reissue();
    } catch (error) {
      return next('/login');
    }
  }

  // 2단계: 인증 필요 페이지인데 비로그인 상태
  if (to.meta.isAuthenticated && !authStore.isLoggedIn) {
    return next('/login');
  }

  // 3단계: 게스트 전용 페이지인데 로그인 상태 (예: /login 재접근)
  if (to.meta.guestOnly && authStore.isLoggedIn) {
    return next('/');
  }

  next();
});
```

### 가드 처리 흐름 도식

```
라우트 이동 요청
    │
    ▼
isLoggedIn=false && isTryReissue=false?
    ├─ 예 → reissue() 시도
    │         ├─ 성공 → isLoggedIn = true, 계속 진행
    │         └─ 실패 → /login 으로 강제 이동
    └─ 아니오 → 계속 진행
    │
    ▼
to.meta.isAuthenticated && !isLoggedIn?
    ├─ 예 → /login 으로 강제 이동
    └─ 아니오 → 계속 진행
    │
    ▼
to.meta.guestOnly && isLoggedIn?
    ├─ 예 → / 으로 강제 이동
    └─ 아니오 → next() (이동 허용)
```

### `isTryReissue` 플래그의 역할

새로고침 시 `isLoggedIn`은 항상 `false`로 초기화된다.  
재발급에 실패(Refresh Token 만료/없음)한 경우에도 `isLoggedIn`은 `false`이므로, 플래그 없이는 라우트 이동마다 재발급을 반복 시도하게 된다.  
`isTryReissue = true`로 표시하여 "이미 시도했고 실패했다"는 상태를 보존한다.

---

## 6. Axios 요청 인터셉터 (토큰 자동 갱신)

모든 API 요청 직전에 인터셉터가 실행된다.

```js
// api/myAxios.js
myAxios.interceptors.request.use(async (config) => {
  const authStore = useAuthStore();
  let accessToken = authStore.accessToken;
  const denyUrl = /^\/api\/auth\/reissue$/;    // 재발급 요청 자체는 제외

  if (!denyUrl.test(config.url) && authStore.isLoggedIn) {
    const claims = jwtDecode(accessToken);     // 토큰 페이로드 파싱
    const now = dayjs().unix();
    const expTime = dayjs.unix(claims.exp).add(-5, 'minute').unix();  // 만료 5분 전

    if (now >= expTime) {                      // 만료 5분 전이면 선제적으로 갱신
      const response = await authStore.reissue();
      accessToken = response.data.accessToken;
    }
  }

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});
```

### 만료 5분 전 갱신을 하는 이유

토큰이 실제로 만료된 후 요청하면 백엔드에서 401이 반환되어 사용자 경험이 끊긴다.  
만료 **5분 전**에 미리 갱신함으로써 사용자가 인식하지 못하는 사이 토큰을 교체한다.

---

## 7. 로그아웃

⬜ **미구현** — Header.vue에 Logout 버튼은 렌더링되어 있으나 클릭 핸들러가 없다.

구현 예정 동작:
- `POST /api/logout` 호출 (백엔드에서 Refresh Token 쿠키 삭제)
- `useAuthStore.clearAuthStore()` 호출 (메모리의 accessToken, userInfo 초기화)
- `/login` 으로 이동

---

## 8. 회원가입

⬜ **미구현** — Header.vue에서 `/registration` 경로로 라우팅을 시도하나, 해당 라우트와 페이지 컴포넌트가 존재하지 않는다.
