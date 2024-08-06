# editor.osb.im

## 프로젝트 목적 및 목표

목적은 대용량 HTML 파일을 보다 효율적으로 처리하고, 사용자가 원활하게 편집할 수 있도록 하는 것입니다.
<br />
이를 통해 성능을 개선하고, 사용자 경험을 향상시키는 것을 목표로 합니다.

---

## 프로젝트 소개
이 프로젝트는 다음 두 옵저버를 활용하여 대용량 HTML 파일의 사용 성능을 개선하였습니다.
- IntersectionObserver
  - [영어 MDN 문서](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)
  - [한국어 MDN 문서](https://developer.mozilla.org/ko/docs/Web/API/Intersection_Observer_API)
- MutationObserver
  - [영어 MDN 문서](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver)
  - [한국어 MDN 문서](https://developer.mozilla.org/ko/docs/Web/API/MutationObserver)

---

### 문제 정의
일정 수 이상의 내용을 삽입하면 성능이 저하되는 것을 확인하였습니다.<br />
이는 단순 스크롤링, 텍스트 입력, 이미지 삽입 등의 모든 작업에 대해 발생하였습니다.

### 분석
원인 파악 도중, CKEditor 에서 `contenteditable` 속성을 사용하여 발생한 문제임을 확인하였습니다.<br />
`contenteditable` 속성은 사용자가 텍스트를 입력할 수 있도록 하는 속성으로, 사용자가 텍스트를 입력할 때마다 DOM 트리가 변경되어 성능 저하를 발생시킵니다.<br />

이에 대한 해결책을 찾던 중, 리플로우 발생을 최소화 하면 성능을 개선할 수 있다고 생각하였습니다.<br />
아래는 리플로우 관련 내용을 담은 티스토리 블로그 입니다.
- [리플로우, 리페인트와 브라우저 랜더링 알아보기 :: Mong dev blog](https://mong-blog.tistory.com/entry/%EB%A6%AC%ED%94%8C%EB%A1%9C%EC%9A%B0-%EB%A6%AC%ED%8E%98%EC%9D%B8%ED%8A%B8%EC%99%80-%EB%B8%8C%EB%9D%BC%EC%9A%B0%EC%A0%80-%EB%A0%8C%EB%8D%94%EB%A7%81-%EC%95%8C%EC%95%84%EB%B3%B4%EA%B8%B0)

우선, 잦은 DOM 트리 변경으로 인한 레이아웃 계산을 최소화하기 위해 화면에 보이는 몇몇 요소만 남기고 `visibility: hidden` 속성을 적용하였습니다.<br />
그리고 추가적으로 몇몇 방법을 더 적용해 봤으나, 성능 변화는 미미하였습니다.

조금 더 탐색 도중, NHN 의 Toast UI Editor 팀에서 작성한 기술 블로그에서 이에 대한 원인 및 권장 사항을 확인할 수 있었습니다.
> ### HTML 마크업 최적화<br />
> HTML은 태그의 중첩을 최소화하여 단순하게 구성한다. 또한 공백, 주석 등을 제거하여 사용한다.<br />
> 권장하는 DOM 트리의 노드 수는 전체 1500개 미만, 최대 깊이는 32개, 자식 노드를 가지는 부모 노드는 60개 미만이다. (참조: Excessive DOM)<br />
> 불필요한 마크업 사용으로 인해 DOM 트리가 커지는 것을 막고, HTML 파일 용량이 늘어나지 않도록 해야 한다.
- [NHN 기술 블로그 - #HTML 마크업 최적화](https://ui.toast.com/fe-guide/ko_PERFORMANCE#html-%EB%A7%88%ED%81%AC%EC%97%85-%EC%B5%9C%EC%A0%81%ED%99%94)
- [Google 과도한 DOM 크기 피하기](https://developer.chrome.com/docs/lighthouse/performance/dom-size?hl=ko)

제 상황에서는 DOM 트리의 노드 수에 제한을 걸기가 어려웠습니다.<br />
그래서 최대 깊이 수와 자식 노드를 가지는 부모 노드 수라도 줄이기 위해 노력하였습니다.<br />

### 첫번째 해결책
지금까지 분석한 내용을 바탕으로, 현재 화면상에 보이는 아이템만 렌더링하고 나머지 아이템은 `dummy` 아이템으로 대체하여 렌더링하는 방식을 고안하였습니다.<br />
처음에는 브라우저의 스크롤 이벤트를 활용하여 화면에 보이는 아이템을 렌더링하려 했으나, 이는 또다른 성능 저하를 가져올 수 있다고 판단하였습니다.<br />

### 두번째 해결책
다시 더 검색해본 결과, 화면에 태그가 감지될 때마다 콜백 함수를 실행하는 `IntersectionObserver`를 활용하여 화면에 보이는 아이템만 렌더링하는 방식을 찾았습니다.<br />

`dummy` 아이템을 실제 아이템으로 교체하거나 혹은 반대로 실제 아이템을 `dummy` 아이템으로 교체할 때, `IntersectionObserver` 다시 적용하기 위해 노드를 검색하게 됩니다.<br />
그 과정에 성능 저하가 발생할 수 있다는 판단이 들어, 이를 방지하기 위해 `MutationObserver`를 활용하여 아이템이 추가될 때마다 `IntersectionObserver`를 적용하였습니다.

추가로, 최초 문서 삽입 시 전부를 렌더링하는 것이 아닌 최초 50개 아이템만 렌더링하고 나머지 아이템은 `dummy` 아이템으로 대체하여 렌더링하였습니다.<br />

### 결과
위 내용을 통해 화면에 보이는 아이템만 렌더링하고, 나머지 아이템은 렌더링하지 않아 DOM 트리의 크기를 줄일 수 있었습니다.<br />
이를 통한 상당한 성능 개선을 확인할 수 있었습니다.

---

### 작동 방식
작동 방식은 아래와 같습니다.
1. 사용자가 대용량 HTML 파일을 업로드합니다.
2. Dom Parser를 활용하여 HTML 파일을 파싱하여 문자열 배열로 변환합니다.
3. 최초 50개 아이템을 화면에 렌더링합니다.
4. 나머지 아이템은 `dummy` 아이템으로 대체하여 렌더링합니다.
5. 사용자가 스크롤을 내릴 때마다 `IntersectionObserver`를 활용하여 화면에 보이는 아이템을 렌더링합니다.
   - `Chunk` ↔ `Dummy` 동적으로 교체합니다.
6. `MutationObserver`를 활용하여 아이템이 에디터 영역에 추가될 때마다 `IntersectionObserver`를 적용합니다.

---

### 사진으로 보는 작동 방식
사진으로 보면 다음과 같습니다.

#### 초기 데이터 삽입
![초기 데이터 삽입 방식을 표현하는 이미지](docs/01.Insert.png)
#### 편집 중 데이터 제어
![동작 방식을 표현하는 이미지](docs/02.Operating.png)
#### 데이터 추가 / 삭제 시 동작
![데이터 추가 / 삭제 시 동작을 표현하는 이미지](docs/03.Data_Controll.png)

---

## 프로젝트 환경
- Vue 3
- Composition API
- CKEditor 5
- npm
- Node.js 18.20.0

---

## 디렉토리 구조
일관된 구조를 위해 FSD(기능 분할 설계) 아키텍처 구성을 따릅니다.
```plaintext
/src/pages/ckeditor/virtual-scroll.vue                  // 성능 개선을 위한 Vue 템플릿이 위치한 파일
/src/features/ckeditor/model/virtual-scroll/index.js    // 성능 개선을 위한 스크립트가 위치한 파일

/src/pages/ckeditor/default.vue                         // 비교를 위해 준비된 기본 Vue 템플릿
/src/features/ckeditor/model/default/index.js           // 비교를 위해 준비된 기본 스크립트
```

---

## 테스트 방법
1. [테스트 페이지](https://editor.osb.im/ckeditor/virtual-scroll)로 이동
2. `File Upload` 버튼을 클릭하여 대용량 HTML 파일을 업로드
3. [비교 페이지](https://editor.osb.im/ckeditor/default)와 비교하여 성능 차이 확인

---

## 설치 및 실행

### 배포
이 프로젝트의 배포판은 아래 주소에서 확인하실 수 있습니다.
- https://editor.osb.im/ckeditor/virtual-scroll

아래는 비교를 위해 준비된 기본 에디터의 주소입니다.
- https://editor.osb.im/ckeditor/default

### 로컬
1. 저장소 클론
```bash
git clone https://github.com/your-username/editor.osb.im.git
cd editor.osb.im
```

2. 의존성 설치
```bash
npm install
```

3. 로컬 서버 실행
```bash
npm run dev
```

4. 브라우저에서 확인
```plaintext
http://localhost:5173/ckeditor/virtual-scroll
```
