# 11. 프론트엔드 컴포넌트 가이드

## 1. 공통 컴포넌트

공통 컴포넌트는 `src/components/` 아래에 위치하며, 특정 페이지에 종속되지 않고 여러 곳에서 재사용된다.

---

### MyButton

**파일:** `src/components/button/MyButton.vue`

범용 버튼 컴포넌트. 크기와 색상을 props로 조합하여 사용한다.

#### Props

| Prop | 타입 | 기본값 | 허용 값 | 설명 |
|------|------|--------|---------|------|
| `btnType` | String | `'button'` | `'button'`, `'submit'`, `'reset'` | HTML button type 속성 |
| `size` | String | - | `'big'`, `'middle'`, `'small'` | 버튼 크기 |
| `color` | String | - | `'black'`, `'white'`, `'gray'` | 버튼 색상 |
| `content` | String | - | 임의 문자열 | 버튼 텍스트 |

#### 크기 규격

| 크기 | 너비 | 높이 | 폰트 크기 |
|------|------|------|-----------|
| `big` | 350px | 45px | 20px |
| `middle` | 300px | 70px | 40px |
| `small` | 90px | 45px | 20px |

#### 색상 규격

| 색상 | 배경 | 글자색 |
|------|------|--------|
| `black` | `--personal-color-black` | `--personal-color-white` |
| `gray` | `--personal-color-gray` | `--personal-color-white` |
| `white` | `--personal-color-white` | `--personal-color-black` |

#### 사용 예시

```html
<!-- 로그인 제출 버튼 -->
<MyButton
  :btnType="'submit'"
  :color="'gray'"
  :size="'middle'"
  :content="'Log in'"
/>

<!-- 클릭 이벤트 처리 -->
<MyButton
  :color="'gray'"
  :size="'big'"
  :content="'Show more posts'"
  @click="getNextPage()"
/>
```

---

### MyInput

**파일:** `src/components/input/MyInput.vue`

범용 인풋 컴포넌트. `v-model`로 부모와 양방향 바인딩한다.

#### Props

| Prop | 타입 | 설명 |
|------|------|------|
| `type` | String | HTML input type (예: `'text'`, `'password'`) |
| `placeholder` | String | 안내 텍스트 |
| `readonly` | Boolean | 읽기 전용 여부 |
| `required` | Boolean | 필수 입력 여부 (HTML 기본 유효성 검사 연동) |

#### v-model

Vue 3.4+ `defineModel()`을 사용하여 부모와 직접 양방향 바인딩한다.

```html
<!-- 부모 컴포넌트에서 -->
<MyInput
  :type="'text'"
  :placeholder="'Email'"
  :readonly="false"
  :required="true"
  v-model="inputs.email"
/>
```

> **참고:** `Login.vue`에서 `validatorFnc` prop을 전달하고 있으나, 현재 `MyInput` 컴포넌트에 해당 prop이 정의되어 있지 않아 실제 검증은 동작하지 않는다. (⬜ 미구현 — 클라이언트 실시간 유효성 검증 표시 기능)

---

### MyStrikeThroughBehindWord

**파일:** `src/components/text-decoration/MyStrikeThroughBehindWord.vue`

텍스트 양쪽에 수평선이 붙는 데코레이터 컴포넌트.  
로그인 폼의 "or" 구분선 등에 사용한다.

```
───── or ─────
```

#### Props

| Prop | 타입 | 설명 |
|------|------|------|
| `content` | String | 가운데에 표시할 텍스트 |

#### 사용 예시

```html
<MyStrikeThroughBehindWord :content="'or'" />
```

---

### Header

**파일:** `src/components/Header.vue`

모든 페이지 상단에 고정으로 표시되는 네비게이션 바.  
`useAuthStore.isLoggedIn` 상태에 따라 버튼을 조건부 렌더링한다.

#### 렌더링 분기

| 상태 | 표시 버튼 |
|------|-----------|
| 비로그인 | Sign In (→ `/login`), Sign Up (→ `/registration`) |
| 로그인 | Logout |

> **Sign Up 버튼:** `/registration` 경로로 이동하나, 해당 라우트와 페이지가 미구현 상태다.  
> **Logout 버튼:** 버튼은 렌더링되나 클릭 핸들러가 미구현 상태다.

#### 코드

```js
// Header.vue
function redirectMain() { router.push('/'); }
function redirectLogin() { router.push('/login'); }
function redirectRegistration() { router.push('/registration'); }  // ⬜ 미구현 페이지
```

---

### Main

**파일:** `src/components/Main.vue`

`App.vue` 내에서 `Header` 아래를 담당하는 컨테이너.  
`useMyErrorStore.isError` 값에 따라 에러 화면 또는 라우터 뷰를 표시한다.

```html
<!-- Main.vue -->
<template>
  <MyError v-if="myErrorStore.isError" />
  <router-view v-else />
</template>
```

이 구조 덕분에 어느 페이지에서든 Store에 에러를 저장하면 즉시 에러 화면으로 전환된다.

---

## 2. 페이지 컴포넌트

### Login.vue

**파일:** `src/pages/auth/Login.vue`  
**경로:** `/login`

이메일과 비밀번호를 입력받아 로그인을 처리한다.

#### 구성

```
Login.vue
├── MyInput (email)
├── MyInput (password)
├── MyButton (Log in / submit)
├── MyStrikeThroughBehindWord (or)
└── MyButton (Sign Up / button)    ← ⬜ 미구현 (클릭 시 동작 없음)
```

#### 폼 처리 흐름

```js
// Login.vue
const handleSubmit = async () => {
  await authStore.login(inputs);   // 로그인 API 호출
  router.replace('/posts');        // 성공 시 게시글 목록으로 이동
};
```

`router.replace()`를 사용하는 이유: `push()` 대신 `replace()`를 사용하면 로그인 페이지가 히스토리 스택에 남지 않아 뒤로 가기로 로그인 페이지로 돌아오는 것을 방지한다.

---

### PostIndex.vue

**파일:** `src/pages/posts/PostIndex.vue`  
**경로:** `/posts`

게시글 목록을 카드 그리드로 표시하고, "더 보기" 버튼으로 페이지를 추가 로드한다.

#### 구성

```
PostIndex.vue
├── .card (v-for 반복) ← 게시글 썸네일 카드 (배경 이미지)
└── MyButton "Show more posts" ← isLastPage = false 일 때만 표시
```

#### 페이지네이션 흐름

```js
// PostIndex.vue
onBeforeMount(postIndexStore.getPostPagination);     // 진입 시 1페이지 자동 로드
onBeforeUnmount(postIndexStore.clearPostIndex);      // 이탈 시 목록 초기화

const getNextPage = async () => {
  await postIndexStore.getPostPagination(postIndexStore.getNextPageNumber);
};
```

```js
// usePostIndexStore.js
const getPostPagination = async (page = 1) => {
  if (!isLastPage.value) {           // 마지막 페이지면 요청 생략
    const res = await myAxios.get('/api/posts', { params: { page } });
    const data = res.data.data;
    isLastPage.value = data.lastPage;
    items.value.push(...data.posts); // 기존 목록에 누적 (무한 스크롤 방식)
    currentPage.value++;
  }
};
```

`onBeforeUnmount`에서 `clearPostIndex()`를 호출하는 이유: 페이지를 벗어났다가 다시 진입할 때 이전 목록이 남아 중복 표시되는 것을 방지한다.

---

### MyError.vue

**파일:** `src/pages/errors/MyError.vue`

전역 에러 발생 시 `Main.vue`가 라우터 뷰 대신 이 컴포넌트를 렌더링한다.

#### 표시 내용

- 에러 코드 (`useMyErrorStore.errorCode`)
- 에러 메시지 (`useMyErrorStore.errorMsg`)
- 메인으로 이동 버튼

#### 메인으로 이동 처리

```js
const redirectMain = () => {
  myErrorStore.clearErrorInfo();   // isError = false 로 변경 → Main.vue가 router-view 복원
  router.replace('/');
};
```
