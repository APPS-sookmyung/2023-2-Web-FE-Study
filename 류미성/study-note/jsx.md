# JSX

- update: 2023.11.24
  <br />

### 정의

- 리액트에서 HTML 코드를 쉽게 작성할 수 있도록 처음 만들어진 `자바스크립트 확장 문법`

### JSX와 HTML의 차이점

- 하나의 부모 태그로 작성된 구조일 것
- 반드시 태그는 닫아야 함
- class 속성은 className 속성으로!
- style 속성은 객체 형태로 값 지정
  ```jsx
  export default function App() {
  	return (
  		<div className="App">
  			<h1 style={{ color: "red", fontSize: "22px" }}> Hello CodeSandbox</h1>
  			<h2>Start editing to see some magic happen!</h2>
  		</div>
  	);
  }
  ```
- JSX는 자바스크립트 변수 대입 가능

### JSX를 사용한 코드 vs 사용하지 않은 코드 비교

- JSX를 사용한 코드

```jsx
const element = <h1 className="greeting">Hello, world!</h1>;
```

- JSX를 사용하지 않은 코드
