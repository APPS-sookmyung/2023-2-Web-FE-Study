// 서비스 관련
// d] 웹 서버를 띄운다
// [] 서버의 새로운 메뉴명이 추가될 수 있도록 요청한다 ( api 당 하나의 카테고리로 해서 서버에 요청하도록 )
// [] 서버에 카테고리별 메뉴리스트를 불러온다
// [] 서버에 메뉴를 수정될 수 있도록 요청한다.
// [] 서버 메뉴의 품질상태가 토글될 수 있도록 요청한다
// [] 서버의 메뉴가 삭제될 수 있도록 요청한다

// 리팩터링 관련
// [] localStorage에 저장되는 로직은 지운다
// [] fetch 비동기 api를 사용하는 부분을 async await을 사용하여 구현한다.

//사용자 경험
// [] API 통신이 실패하는 경우에 대해 사용자가 알 수 있게 alert으로 예외처리를 진행한다.
// [] 중복되는 메뉴는 추가할 수 없다.

import { $ } from "./utils/dom.js";
import store from "./store/index.js";

const BASE_URL = "http://localhost:3000/api";

function App() {
  // 상태: 변할 수 있는 데이터=> 변하기 떄문에 관리를 해줘야 한다. (변할 수 있는 거: 메뉴명- 메뉴명의 길이만 가지고 오면 갯수 구할 수 있으니까 메뉴명만 관리하기)

  this.menu = {
    // 각 카테고리 별로 나눠서 메뉴 관리를 할 수 있음
    espresso: [],
    frappuccino: [],
    blended: [],
    teavana: [],
    dessert: [],
  };

  // 상태관리 ( 현재상태를 알아야 하는 부분들 관리 : 나중에 변경될 수 있기 때문에 알아야 함. ) , 최초는 espresso
  this.currentCategory = "espresso";

  // 상태값 변화가 있는 부분에만 this. 메서드를 사용

  this.init = () => {
    // app 이라는 function 이 랜더링 될때 실행하는 메서드 ( )
    if (store.getLocalStorage()) {
      // 로컬 스토리지에 데이터가 있으면 보여주기
      this.menu = store.getLocalStorage();
    }
    render();
    this.initEventListeners();
  };

  const render = () => {
    const template = this.menu[this.currentCategory]
      .map((item, index) => {
        //html 태그 중 배열의 원소에 유일한 값을 부여하고 싶을 때 = id(data) 를 사용  => data- ~ 라고 id 주기
        return `
        <li data-menu-id="${index}" class="menu-list-item d-flex items-center py-2">
          <span class="w-100 pl-2 menu-name ${
            item.soldOut ? "sold-out" : ""
          }">${item.name}</span>
          <button
            type="button"
            class="bg-gray-50 text-gray-500 text-sm mr-1 menu-sold-out-button"
          >
            품절
          </button>
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
      })
      .join("");

    $("#menu-list").innerHTML = template; // Update the entire menu list
    updateMenuCount();
  };

  const updateMenuCount = () => {
    const MenuCount = this.menu[this.currentCategory].length;
    $(".menu-count").innerText = `총 ${MenuCount} 개`;
  };

  //재사용하는 부분을 한곳에 모아줌
  const addMenuName = () => {
    if ($("#menu-name").value === "") {
      alert("값을 입력해주세요.");
      return;
    }
    const MenuName = $("#menu-name").value;

    fetch(`${BASE_URL}/category/${this.currentCategory}/menu`, {
      // 데이터 생성하는 요청
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: MenuName }),
    })
      .then((responce) => {
        //서버한테 데이터를 받을 때
        return responce.json();
      })
      .then((data) => {
        console.log(data);
      });
    // this.menu[this.currentCategory].push({ name: MenuName });
    // store.setLocalStorage(this.menu);
    // render();
    // $("#menu-name").value = "";
  };

  const updateMenuName = (e) => {
    const menuId = e.target.closest("li").dataset.menuId; // element 객체의 ( dataset 메서드) 사용한다
    const $menuName = e.target.closest("li").querySelector(".menu-name");
    // e.target 중 가장 가까운 li 찾음. 이너텍스트로 텍스트 가져오기
    const updatedMenuName = prompt("메뉴명을 수정하세요", $menuName.innerText); // 인자 사용 유의하기

    //html 태그에 id 값을 줘보기 ( 상태 데이터의 유일한 값을 주기 위해 )
    this.menu[this.currentCategory][menuId].name = updatedMenuName;
    store.setLocalStorage(this.menu);
    render();
  };

  const removeMenuName = (e) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      const menuId = e.target.closest("li").dataset.menuId;
      this.menu[this.currentCategory].splice(menuId, 1); //배열의 특정 원소를 삭제하는 index  두번째 매개변수는 삭제할 개수 )
      store.setLocalStorage(this.menu);
      render(); // e.target.closest("li").remove(); 를 리팩토링
    }
  };

  const soldOutMenu = (e) => {
    const menuId = e.target.closest("li").dataset.menuId;
    this.menu[this.currentCategory][menuId].soldOut =
      !this.menu[this.currentCategory][menuId].soldOut;
    store.setLocalStorage(this.menu);
    render();
  };

  const initEventListeners = () => {
    $("#menu-list").addEventListener("click", (e) => {
      //if 로 올바른(수정) 버튼인지 ( class 로 구분 )
      if (e.target.classList.contains("menu-edit-button")) {
        updateMenuName(e); //리팩터링
        return; // 불필요한 밑부분의 if 문은 실행하지 않도록 만들어줌
      }

      if (e.target.classList.contains("menu-remove-button")) {
        removeMenuName(e); //리팩터링
        return;
      }

      if (e.target.classList.contains("menu-sold-out-button")) {
        soldOutMenu(e);
        return;
      }
    });

    //form태그가 자동으로 전송되는걸 막아준다.
    $("#menu-form").addEventListener("submit", (e) => {
      e.preventDefault();
    });

    $("#menu-submit-button").addEventListener("click", addMenuName);

    // 메뉴의 이름을 입력받는건
    $("#menu-name").addEventListener("keypress", (e) => {
      if (e.key !== "Enter") {
        // 처음에 엔터를 눌러도 alert 안뜨게
        return;
      }
      addMenuName();
    });

    //메뉴판 관리하기
    $("nav").addEventListener("click", (e) => {
      // button 마다 이벤트를 모두 다는 것은 비효율적임.
      const isCategoryButton =
        e.target.classList.contains("cafe-category-name");
      if (isCategoryButton) {
        // 예외처리 : nav 바 아무데나 클릭하면 이벤트 발생하는 것을 방지하기 위해 작성
        const categoryName = e.target.dataset.categoryName; // html 에서 이미 id 를 data- 형태로 줬기 때문에, dataset 이라는 메서드를 사용해서 접근하기.
        this.currentCategory = categoryName;
        $("#category-title").innerText = `${e.target.innerText} 메뉴관리 `;
        render();
      }
    });
  };
}

const app = new App();
app.init();
