## 강의의 목적과 사이클 소개

개념을 잘 안다고 JS를 잘 사용하는건 아니다!
-> JS를 잘 사용할 수 있는 사고를 알아보자

1. *바닐라 자바스크립트*로 *상태관리가 가능*한 애플리케이션 만들기
-> 사용자 인터렉트에 따라 내용이 변경, 업데이트 되기

2. ??

ps. 구현하는게 다가 아니다! 유지 보수, 확장 가능하게 만들자!

---

<u>전체 요구사항: 구현을 위한 전략 (내가 한번 해보기)</u><br>

프로그램을 보고 내가 생각한 요구사항:
1. 타이틀 만들기
2. 메뉴 종류 nav 만둘기
    -클릭하는 종류에 반응해 body 내용이 바뀌게 하기
3. 메뉴 관리 body 만들기
    -확인 누르면 메뉴에 추가되기
    -품절 누르면 커피 이름 crossout되기
    -수정 누르면 prompt 떠서 뭘로 수정하고 싶은지 받아내기
        ->확인 누르면 이름 바뀌기 (품절 표시는 그대로 두기)
    -삭제 누르면 삭제 사실을 확인하는 confirm을 띄우기
    -메뉴 추가/삭제하면 "총n개"에서 n이 바뀌도록 하기

실제 요구사항은 https://github.com/blackcoffee-study/moonbucks-menu에 있음

놓친 요구사항:
* 메뉴가 추가되고 나면, input은 빈 값으로 초기화한다.
* 사용자 입력값이 빈 값이라면 추가되지 않는다.
* localStorage에 데이터를 저장하여 **세로고침 해도 데이터가 남게** 한다. 
* 페이지 최초 접근엔 에스프레소 메뉴가 먼저 보이게 한다
* "sold-out class"를 추가해서 품절 상태를 변경한다.
* step3 요구사항 전체...
---

<u>step1 요구사항 정리하기</u><br>
⭐요구사항을 분해해서 한 문장에 한 작업만 남도록 분석해야 한다.

뭐부터 해결해야하는지 순서대로 정리해보자

 - 에스프레소 메뉴에 새로운 메뉴를 확인 버튼 또는 엔터키 입력으로 추가한다.
    * 메뉴가 추가되고 나면, input은 빈 값으로 초기화한다.
    * 사용자 입력값이 빈 값이라면 추가되지 않는다.
 - 메뉴의 수정 버튼을 눌러 메뉴 이름 수정할 수 있다.
    * 메뉴 수정시 브라우저에서 제공하는 prompt 인터페이스를 활용한다.
 - 메뉴 삭제 버튼을 이용하여 메뉴 삭제할 수 있다.
    * 메뉴 삭제시 브라우저에서 제공하는 confirm 인터페이스를 활용한다.
 - 총 메뉴 갯수를 count하여 상단에 보여준다.
 
=> 이를 정리하고 나면

 To Do 메뉴 추가
 - [ ✔ ] 메뉴 이름을 입력 받고 확인 버튼을 누르면 메뉴가 추가된다
 - [ ✔ ] 메뉴 이름을 입력 받고 엔터키 입력으로 추가한다.
 - [ ✔ ] 메뉴 추가시 총 메뉴 갯수가 증가한다.
 - [ ✔ ] 메뉴가 추가되고 나면, input은 빈 값으로 초기화된다.
 - [ ✔ ] 사용자 입력값이 빈 값이라면 추가되지 않는다. 
 - 추가되는 메뉴의 마크업은 <ul id="espresso-menu-list" class="mt-3 pl-0"></ul> 안에 삽입해야 한다.

 To Do 메뉴 수정
 - [ ✔ ] 메뉴의 수정 버튼클릭 이벤트를 받고, prompt 인터페이스가 뜬다
 - [ ✔ ] prompt에서 새로운 메뉴 이름을 받고, 확인 버튼을 누르면 메뉴가 수정된다.

 To Do 메뉴 삭제
 - [ ✔ ] 메뉴 삭제 버튼클릭 이벤트를 받고, 삭제 사실을 확인받는 confirm 인터페이스가 뜬다.
 - [ ✔ ] confirm 인터페이스에 확인을 누르면 메뉴가 삭제된다.
 - [ ✔ ] 메뉴 삭제시 총 메뉴 갯수가 감소한다. 
 
---
### 강의에서 새로 알게된 것 필기: ###

A) <u>event.preventDefault()</u><br>
form에서 엔터키를 누르면 자동으로 페이지 리로드가 됨  
이를 막아주는 코드가 필요함  
(자동으로 전송되는 것을 막아준다.)

    .addEventListener("submit",(e)=>{
            e.preventDefault();
        })
**preventDefault()**        
The preventDefault() method of the Event interface tells the user agent that if the event does not get explicitly handled, its default action should not be taken as it normally would be.  
(No parameters)  
-used for: not toggling checkbox when clicked, prevent automatic form reload, etc...  
   
<br>
<br>

B) <u>"keypress" & "submit" event</u><br>
* input type text에 내용이 적혔는지 확인하기 위한 이벤트는 "keypress"이다.  
* form에 submit한 것을 확인하는 이벤트는 "submit"이다.

<br>

C) <u>Get what the user wrote in input</u><br>
document.getElementById("espresso-menu-name") **.value**<br><br>

D) <u>Recognizing Keypress</u><br>
To find out what key the user pressed, you use 
**event.key**

    if (event.key === "Enter"){}
"A", "a", "4", "+", "$", "F1", "Enter", "HOME", "CAPS LOCK"  
<br>

E) JS에서 아주 긴 <u>HTML코드를 return</u>할 수 있다.  
이는 **innerHTML** 또는 **insertAdjacentHTML**로 붙일 수 있다.  

innerHTML은 같은 요소에 반복적으로 적용하면 안의 내용이 바뀌는데  

insertAdjacentHTML은 같은 요소에 반복적으로 적용하면 React의 component마냥 모양은 똑같지만 안의 내용은 다른 새로운 오브젝트를 adjacent하게 넣어준다.  

> **insertAdjacentHTML**(position, text)  
<u>position</u>: A string representing the position relative to the element. Must be one of the following strings:  
"beforebegin": Before the element.  
"afterbegin": Just inside the element, before its first child  
"beforeend": Just inside the element, after its last child  
"afterend": After the element. <br><br>
<u>text</u>: The string to be parsed as HTML or XML and inserted into the tree.

    const menuItemTemplate = (espressoMenuName)=>{
                    return `<li class="menu-list-item d-flex items-center py-2">
                    <span class="w-100 pl-2 menu-name">${espressoMenuName}</span>
                    <button
                      type="button"
                      class="bg-gray-50 text-gray-500 text-sm mr-1 menu-edit-button"
                    >
                      수정
                    </button>
                    <button
                      type="button"
                      class="bg-gray-50 text-gray-500 text-sm menu-remove-button"
                    >
                      삭제
                    </button>
                  </li>`;
                };
                $("espresso-menu-list").insertAdjacentHTML("beforeend",menuItemTemplate(espressoMenuName));
<br>  

F) <u>innerText vs innerHTML</u><br>

**innerHTML**: 'Element'의 속성으로, element내의 HTML 또는 XML 마크업을 가져오거나 태그와 함께 입력해 내용을 직접 설정할 수 있다.  
**innerText**: 'Element'의 속성으로, element내에서 사용자에게 보여지는 text값들을 가져오거나 설정 가능 (text만 다뤄서 html태그 사용 불가능)

    //내가 작성한 코드
    const menuCount = $("#espresso-menu-list").children
    $(".menu-count").innerText = `총 ${menuCount.length}개`

    //실제 코드
    const menuCount = $("#espresso-menu-list").querySelectorAll("li").length;
    $(".menu-count").innerText = `총 ${menuCount}개`
<br>

G) <u>input text 내용 비우기</u><br>
이미 아는 내용이지만 그냥 잠깐 필기하겠다.

    $("#espresso-menu-name").value = "";  
<br>

H) <u>이벤트 위임</u><br>

이벤트 리스너를 지정하는 요소가 많으면 많을수록 페이지의 실행 속도는 느려집니다. 그래서 효율적으로 이벤트를 관리하기 위해서 이벤트 흐름을 이용합니다.   
이벤트는 이벤트가 발생한 엘리멘트를 포함하고 있는 **부모** 요소에도 영향을 미치기 때문에 자식 요소를 포함할 수 있는 요소에 이벤트 핸들러를 지정하고 이벤트의 흐름을 이용해 다룰 수 있습니다.   
즉, 이벤트 리스너가 실행할 작업을 요소의 부모 요소에게 **위임**할 수 있다는 것입니다.

    $("#espresso-menu-list").addEventListener("click",(e)=>{
        if (e.target.classList.contains("menu-edit-button")){
            const $menuName = e.target.closest("li").querySelector(".menu-name");
            const changedMenu = prompt("메뉴명을 수정하세요",$menuName.innerText);
            $menuName.innerText = changedMenu;
        }
    })
여기서
**event.target**:  
Read-only property. Reference to the object onto which the event was dispatched.  
이벤트가 발생한 요소를 반환해준다. 예시를 들자면, <br>
#espresso-menu-list의 "click" 이벤트를 ***받는***,
#espresso-menu-list 내의 버튼/스팬을 의미한다. <br><br>
<-> 반대로, Returns the element whose event listener triggered the event를 하는 녀석은 <u>currentTarget</u>이다.<br><br>

자, 그러면 event.target으로 받을 수 있는 녀석이 3가지 (버튼 2개, 스팬 한개)인데, 특정 버튼만 가져올 수 있게 class이름을 어떻게 쓸까?
- 초기 코드: 

    event.target.className
    - 문제점: This will contain the full class (which may consist of several classes divided by a space) -> 번거로움
- 해결책:

    event.target.classList.contains(className)
    - 해설:  
    classList로 해당 요소가 속한 모든 클라스를 부르고   
    contains로 내가 원하는 className이 있는지 확인한다.  
    (자바스크립트에서는 classList 함수를 사용하여 HTML 요소에 class 속성을 추가add, 제거remove, 변경toggle, 여부확인contains이 가능하다.)

<br><br>이러면 이제 부모한테 위임한 내용을 자식한테 전달하는 것에 성공하였다.  
근데 그 옆에 있는 span에서 값을 꺼내오고 싶네? <br> 
이는 <u>sibling node이니까 부모로 올라가서 자식으로 꺼내내야한다.</u><br>  
강의에서는 **closest()**을 사용하는데,

    const $menuName = e.target.closest("li").querySelector(".menu-name");

**closest()**: traveses the element and its parents (heading toward the document root) until it finds a node that matches the specified CSS selector   
-> Can find with tags, .classes, #ids  
<br>


근데 솔직히 원리에 더 충실한 코드는 **parentElement**이라고 생각한다.

    const $menuName = e.target.parentElement.querySelector(".menu-name");

I) <u>.value VS .innerText</u><br>
.value는 value property가 있는 오브젝트에만 적용이 된다.  
예를들어, Input Tag들 -> input은 value property가 있다.  
<br>
Input외에는 다 .innerText/.innerHTML 쓴다고 생각하는게 편하다  
<br>

J) <u>Refactoring</u><br>
의미: Restructure a code so as to improve operation without altering functionality  
<br>

K) <u>.remove()</u><br>

    objectToRemove.remove()

No parameters

---
1. 잘한 것은 무엇인가?
2. 아쉬운 점은 무엇인가?
3. 무엇을 배웠는가?
4. 아직도 안 풀린 궁금증은 무엇인가?  
5. 앞으로 어떻게 다르게 할 것인가?
