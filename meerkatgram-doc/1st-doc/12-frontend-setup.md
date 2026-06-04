# 12. 프론트엔드 환경 설정 및 실행 가이드

## 1. 사전 요구사항

| 도구 | 권장 버전 | 확인 명령 |
|------|-----------|-----------|
| Node.js | 20 이상 (LTS) | `node -v` |
| npm | 10 이상 | `npm -v` |

---

## 2. 프로젝트 초기 설치

```bash
# 저장소 클론 후 프로젝트 루트에서 실행
npm install
```

설치되는 주요 패키지:

| 패키지 | 용도 |
|--------|------|
| `vue` | UI 프레임워크 |
| `vue-router` | 라우팅 |
| `pinia` | 상태 관리 |
| `axios` | HTTP 클라이언트 |
| `jwt-decode` | Access Token 페이로드 파싱 |
| `dayjs` | 토큰 만료 시간 비교 |
| `vite` (dev) | 개발 서버 및 번들러 |
| `@vitejs/plugin-vue` (dev) | Vite의 Vue SFC 변환 플러그인 |

---

## 3. 환경 변수 설정

프로젝트 루트의 `.env` 파일을 수정한다.

```env
VITE_APP_TITLE=meerkatgram-client
VITE_APP_URL=http://localhost:5173
VITE_APP_VERSION=1.0.0
VITE_MODE=develop

VITE_API_BASE_URL=http://localhost:8080
```

| 변수 | 설명 | 예시 |
|------|------|------|
| `VITE_API_BASE_URL` | 백엔드 API 서버 주소 | `http://localhost:8080` |
| `VITE_APP_URL` | 프론트엔드 앱 주소 (CORS 설정 참고용) | `http://localhost:5173` |

> **주의:** `VITE_` 접두사가 붙은 변수만 클라이언트 코드에서 `import.meta.env.VITE_xxx` 로 접근할 수 있다.  
> 접두사 없는 변수는 빌드 시 번들에 포함되지 않으므로 반드시 `VITE_`를 붙인다.

---

## 4. 개발 서버 실행

```bash
npm run dev
```

기본 접속 주소: `http://localhost:5173`

Vite 개발 서버는 파일 변경 시 **HMR(Hot Module Replacement)** 으로 페이지 새로고침 없이 변경 사항을 즉시 반영한다.

---

## 5. 빌드 및 프리뷰

```bash
# 프로덕션 빌드 (dist/ 폴더 생성)
npm run build

# 빌드 결과물 로컬 프리뷰
npm run preview
```

빌드 결과물은 `dist/` 디렉토리에 생성된다. 이 파일들을 정적 파일 서버(Nginx 등)에 배포한다.

---

## 6. 백엔드 연동 확인

프론트엔드가 정상 동작하려면 백엔드 서버가 먼저 실행되어 있어야 한다.

**연동 체크리스트:**

1. 백엔드 서버가 `VITE_API_BASE_URL`에 설정한 주소에서 실행 중인지 확인
2. 백엔드 CORS 설정에 프론트엔드 주소(`http://localhost:5173`)가 허용되어 있는지 확인
3. 백엔드 CORS 설정에서 `allowCredentials = true`가 설정되어 있는지 확인 (Refresh Token 쿠키 전달 필수)

백엔드 환경 설정은 [07-setup-guide.md](07-setup-guide.md)를 참고한다.

---

## 7. 트러블슈팅

### API 요청이 실패하고 CORS 에러가 발생한다

브라우저 콘솔에 `Access-Control-Allow-Origin` 관련 에러가 보이는 경우:

- `VITE_API_BASE_URL`이 백엔드 실제 주소와 일치하는지 확인
- 백엔드 CORS 허용 Origin에 `http://localhost:5173`이 포함되어 있는지 확인
- `withCredentials: true` 사용 시 백엔드에서 `allowCredentials = true`와 구체적인 Origin 지정이 필수 (`*` 와일드카드 불가)

---

### 로그인 후 게시글 목록이 표시되지 않는다

- 백엔드 서버가 실행 중인지 확인 (`npm run dev` 터미널과 별개로 백엔드 서버 확인)
- 브라우저 개발자 도구 → Network 탭에서 `/api/posts` 요청의 응답 상태 코드 확인
- 401 응답이면 Access Token이 올바르게 전송되지 않은 것 → `myAxios.js`의 `baseURL` 설정 확인

---

### 새로고침 시 항상 로그인 페이지로 이동된다

- 백엔드 `/api/reissue-token` 엔드포인트가 정상 동작하는지 확인
- 브라우저 개발자 도구 → Application → Cookies에서 Refresh Token 쿠키가 존재하는지 확인
- 쿠키가 없으면 정상 동작 (로그인이 필요한 상태)
- 쿠키가 있는데 실패하면 백엔드 Refresh Token 만료 또는 서버 오류

---

### 환경 변수가 적용되지 않는다

- `.env` 파일 수정 후 개발 서버를 재시작해야 반영된다 (`Ctrl+C` 후 `npm run dev`)
- 변수명에 `VITE_` 접두사가 있는지 확인
