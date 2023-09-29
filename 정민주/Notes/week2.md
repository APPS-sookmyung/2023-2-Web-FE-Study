TODO: localStorage Read & Write
 - [ ✔ ] LocalStorage에 데이터를 저장한다.
 - [ ✔ ] 메뉴를 추가할 때
 - [ ✔ ] 메뉴를 수정할 때
 - [ ✔ ] 메뉴를 삭제할 때
 - [ ✔ ] localStorage에 저장한 데이터를 읽어와 새로고침해도 데이터가 남아있는다. 

 TODO: 카테고리별 메뉴판 관리
 - [ ✔ ] 에스프레소 메뉴판 관리
 - [ ✔ ] 프라푸치노 메뉴판 관리
 - [ ✔ ] 블렌디드 메뉴판 관리
 - [ ✔ ] 티바나 메뉴판 관리
 - [ ✔ ] 디저트 메뉴판 관리

TODO: 페이지 접근 시 최초 데이터 Read & Rendering
 - [ ✔ ] 페이지를 최초 로딩할때 localStorage에 에스프레소 메뉴를 읽어온다.
 - [ ✔ ] 에스프레소 메뉴를 페이지에 띄어준다.

TODO: 품절 관리
- [ ✔ ] 품절 버튼 추가하기
- [ ✔ ] 품절 버튼을 누르면 localStorage에 상태값이 저장된다.
- [ ✔ ] 클릭이벤트에서 가장가까운 li태그의 class속성 값에 sold-out을 추가한다. 
- [ ✔ ] sold-out class에 대해 취소선을 그려준다. 
---
## 새로 깨달은 것   

### * 몇 번째 요소인지 파악하기   
지금 하고 있는 birdieBuddy 프로젝트에 사용하는 "몇 번째 요소"의 방법은   
```javascript
const thingToFindNumOf = e.target
const listToFindNumFrom = document.querySelectorAll(".number")
const index = Array.prototype.indexOf.call(listToFindNumFrom, thingToFindNumOf);
```   
이런 식으로 찾았다.   
<br>  

강의에서 배운 방식은 다음과 같다.   
1. localStorage에 먼저 메뉴를 저장한다. 
2. localStorage에 있는 녀석들을 
```javascript
const template = this.menu.map((item, index) =>{
    //data- :data 속성을 저장하고 싶을때의 표준 속성
    return `<li data-menu-id='${index}' class="menu-list-item d-flex items-center py-2">
        <!--생략된 코드-->
  </li>`;
}).join("");
$("#espresso-menu-list").innerHTML = template;
```  
해서 data-menu-id라는 custom attribtue를 부여해 준다.    
https://velog.io/@gga01075/HTML%ED%83%9C%EA%B7%B8%EC%97%90-%EB%82%98%EB%A7%8C%EC%9D%98-%EC%BB%A4%EC%8A%A4%ED%85%80-%EC%86%8D%EC%84%B1-%EC%B6%94%EA%B0%80%ED%95%98%EA%B8%B0-ppec05qv  (custom attribute에 대하여)

3. 나중에 localStorage의 특정 data에 접근하고 싶으면   
```javascript
const menuId = e.target.closest("li").dataset.menuId
```

**.dataset.customAttributeName** 방식으로 꺼내내서 
```javascript
this.menu[menuId].name = changedMenu;
```
이런 식으로 써준다. 
<br>

꽤 쓸만 한 것 같다. 

<br>
<br>

### * 최대한 한 파일에 객체의 개수는 최대한 적을수록 좋다.   
<br>

### * utility 관련된 코드들은 (범용적- 범'파일'적) 따로 .js로 저장해 놓고 export하고 import하는 것이 좋다.

### * if문이 여러개 있고, 하나를 완료하면 다른 것을 볼 필요 없을 시 return하는 습관을 들여라

### * bool에 따라 className을 넣을지 말지 정하기
```html
<span class="${item.soldOut ? "sold-out":""} w-100 pl-2 menu-name">${item.name}</span>
```

---

## 필기

### * localStorage에 대하여
브라우저에 저장할 수 있는 저장소 (url 별로 사용 가능)   
개발창 -> Application -> Storage -> Local Storage   
* delete하면 지워짐
* **문자열**로만 저장해야 함

```javascript
//key라는 녀석에 value라는 값을 저장해줌
localStorage.setItem("key","value")

//localStorage에서 꺼내오기
localStorage.getItem("key")
```

물어 볼 사항에 적었 듯, 왜 따로 함수로 뒀는지는 아직 완전히는 이해가 안 가지만...   
```javascript
const store = {
    setLocalStorage(menu){
        localStorage.setItem("menu", JSON.stringify(menu));
    },
    getLocalStorage(){
        return JSON.parse(localStorage.getItem("menu"));
    }
}
```
이런 식으로 미리 정형화 된 함수를 만들어 주고 이용하는 듯 하다. 
<br>
<br>



### * localStorage에 저장하기
1. localStorage 초기화 해주는 코드 짜기
```javascript
this.menu =[];
```
2. 메뉴를 추가할때 동시에 this.menu에 저장해 주기
**this.menu.push()**
```javascript
this.menu.push({ name: espressoMenuName });
```
3. this.menu 내용을 localStorage에 땅땅 박아주기
```javascript
store.setLocalStorage(this.menu);
```
<br>

### * localStorage 업데이트 하기
1. 어느 localStorage를 바꿔 줄 것인지 index를 찾아주기
```javascript
const menuId = e.target.closest("li").dataset.menuId
```
2. 바꿔주기   
this.menu[menuId] = '바꾸고 싶은 내용'    
<br>
3. this.menu 내용을 localStorage에 땅땅 박아주기
```javascript
store.setLocalStorage(this.menu)
```
<br>

### localStorage 지우기
1. 어느 localStorage를 지워 줄 것인지 index를 찾아주기
```javascript
const menuId = e.target.closest("li").dataset.menuId
```
2. this.menu에서 지우기
**this.menu.splice(index, 1);**
```javascript
this.menu.splice(menuId, 1);
```
3. this.menu 내용을 localStorage에 땅땅 박아주기
```javascript
store.setLocalStorage(this.menu)
```
<br>

### 새로고침 해도 내용이 남게 하기   
-> 새로고침 하자마자 localStorage에서 읽어내는 역할

* 새로고침 하자마자 읽으세요 하는 코드
**this.init = () => {}**
```javascript
this.init = () => {}
```
* localStorage에서 읽어오기
```javascript
this.init = () =>{
        if (store.getLocalStorage().length > 1){
            this.menu = store.getLocalStorage();
            render();
        }
    }
```
(이때 render이라는 함수는 addMenuName에 있던 코드)

```javascript
    const render = ()=>{
            const template = this.menu.map((item, index) =>{
                //data- :data 속성을 저장하고 싶을때의 표준 속성
                return `<!--HTML 태그-->;}).join("");
            $("#espresso-menu-list").innerHTML = template;
            updateMenuCount();
        }
```

https://www.udemy.com/course/vanilla-js-lv1/learn/lecture/28368074#questions/15938964

---
## 궁금한 것
1. 왜 localStorage로 다이렉트로 바꾸지 않는가? <- const store()를 만든 이유
>데이터를 변경하는 역할은 최소한의 write하는 로직을 써야지  
>안그러면 여기저기서 데이터가 변경되어서 상태가 꼬일 수 있다. 
>
>한 함수에서 모든걸 하려면.... 한 함수의 역할이 많아져서 역할을 분리 해 준 것이다. 
근데 솔직히 뭐니뭐니해도 그냥 코드가 길어서 함수로 정리한거 같다.   
오히려 강사 설명이 더 헷갈렸다. 저 대답은 무슨 의미의 대답이었을까?   

   
2. 정의하지 않은 boolean object는 true로부터 시작하는가...?
```javascript
this.menu[this.currentCategory][menuId].soldOut = 
    !this.menu[this.currentCategory][menuId].soldOut;
```
뭐.. 딱히 어디에 뭐시기뭐시기.soldOUt가 true부터 시작한다는 코드가 없는데도 잘 돌아간다.   

