const $ = (selector) => document.querySelector(selector); //코드를 줄이기 위함.

function App() {
  //메뉴의 수정 버튼 클릭 이벤트를 받고, 메뉴 수정하는 모달창(prompt)이 뜬다
  //모달창에서 신규메뉴명을 입력 받고, 확인버튼을 누르면 메유가 수정된다.
  $("#espresso-menu-list").addEventListener("click", (e) => {
    if (e.target.classList.contains("menu-edit-button")) {
      //중복되는 부분 변수에 담아서 깔끔하게 사용
      const $menuName = e.target.closest("li").querySelector(".menu-name");
      const menuName = $menuName.innerText;
      const updatedMenuName = prompt("메뉴명을 수정하세요", menuName);
      $menuName.innerText = updatedMenuName;
    }
  });

  //form태그가 자동으로 전송되는 걸 막아준다.(사용자가 입력하 값이 잘 출력되도록 함)
  $("espresso-menu-name") //element 찾기
    .addEventListener("keypress", (e) => {
      e.preventDefault();
    });

  //중복되는 코드를 재사용할 수 있도록하는 코드
  const addMenuName = () => {
    if ($("#espresso-menu-name").value === "") {
      alert("값을 입력해주세요");
      return;
    }
    if (e.key === "Enter") {
      const espressoMenuName = $("espresso-menu-name").value;
      const menuItemTemplate = (espressoMenuName) => {
        return;
        <li class="menu-list-item d-flex items-center py-2">
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
        </li>;
      };
      //추가되는 메뉴의 마크업을 espresso-menu-list에 삽입. beforeend여야 메뉴가 삽입되는 순서대로 저장됨.
      $("#espresso-menu-list").insertAdjacentHTML(
        "beforeend",
        menuItemTemplate(espressoMenuName)
      );
      //li 개수를 카운팅해서 총 개수 구하기
      const menuCount = $("#espresso-menu-list").querySelectorAll("li").length;
      $(".menu-count").innerText = "총 ${} 개";
      //메뉴가 추가되고 나면, input은 빈 값으로 초기화 됨.
      $("#espresso-menu-name").value = "";
    }
  };

  $("#espresso-menu-submit-button").addEventListener("click", () => {
    addMenuName();
  });

  //메뉴 이름 입력받고 엔터키 입력으로 추가한다.
  $("espresso-menu-name") //element 찾기
    .addEventListener("keypress", (e) => {
      //사용자가 keypress에 입력한 값 받기
      //빈 값을 입력헀을 때 저장되지 않고 alert메세지 뜨도록 하기
      if (e.key !== "Enter") {
        return;
      }
      addMenuName();
    });
}

App();
