// 서비스 관련
// [o] 웹 서버를 띄운다
// [o] 서버의 새로운 메뉴명이 추가될 수 있도록 요청한다 ( api 당 하나의 카테고리로 해서 서버에 요청하도록 )
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

const MenuApi = {
  async getAllMenuByCategory(category) {
    const response = await fetch(`${BASE_URL}/category/${category}/menu`);
    return response.json();
  },
  async createMenu(category, name) {
    const response = await fetch(`${BASE_URL}/category/${category}/menu`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    });

    if (!response.ok) {
      console.error("API 오류");
    }
  },

  async updateMenu(category, name, menuId) {
    const response = await fetch(
      `${BASE_URL}/category/${category}/menu/${menuId}`,
      {
        method: "PUT", //수정할 때 PUT 을 사용한다
        headers: {
          "Content-Type": "application/json", // requestbody 가 있기 때문에 header 작성해야함
        },
        body: JSON.stringify({ name }),
      }
    );
    if (!response.ok) {
      console.error("에러발생");
    }
    return response.json();
  },

  async toggleSoldOutMenu(category, menuId) {
    const response = await fetch(
      `${BASE_URL}/category/${category}/menu/${menuId}/soldout`,
      {
        method: "PUT",
      }
    );
    if (!response.ok) {
      console.error("에러발생");
    }
  },

  async deleteMenu(category, menuId) {
    const response = await fetch(
      `${BASE_URL}/category/${category}/menu/${menuId}/`,
      {
        method: "DELETE",
      }
    );
    if (!response.ok) {
      console.error("에러발생");
    }
  },
};

function App() {
  this.menu = {
    espresso: [],
    frappuccino: [],
    blended: [],
    teavana: [],
    dessert: [],
  };

  this.currentCategory = "espresso";

  this.init = async () => {
    this.menu[this.currentCategory] = await MenuApi.getAllMenuByCategory(
      this.currentCategory
    );
    render();
    initEventListeners();
  };

  const render = () => {
    const template = this.menu[this.currentCategory]
      .map((menuItem, index) => {
        return `
      <li data-menu-id="${
        menuItem.id
      }" class="menu-list-item d-flex items-center py-2">
        <span class="w-100 pl-2 menu-name ${
          menuItem.isSoldOut ? "sold-out" : ""
        } ">${menuItem.name}</span>
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

    $("#menu-list").innerHTML = template;
    updateMenuCount();
  };

  const updateMenuCount = () => {
    const MenuCount = this.menu[this.currentCategory].length;
    $(".menu-count").innerText = `총 ${MenuCount} 개`;
  };

  const addMenuName = async () => {
    if ($("#menu-name").value === "") {
      alert("값을 입력해주세요.");
      return;
    }
    const menuName = $("#menu-name").value;
    await MenuApi.createMenu(this.currentCategory, menuName);
    this.menu[this.currentCategory] = await MenuApi.getAllMenuByCategory(
      this.currentCategory
    );
    render();
    $("#menu-name").value = "";
  };

  const updateMenuName = async (e) => {
    const menuId = e.target.closest("li").dataset.menuId; // element 객체의 ( dataset 메서드) 사용한다
    const $menuName = e.target.closest("li").querySelector(".menu-name");
    // e.target 중 가장 가까운 li 찾음. 이너텍스트로 텍스트 가져오기
    const updatedMenuName = prompt("메뉴명을 수정하세요", $menuName.innerText); // 인자 사용 유의하기
    await MenuApi.updateMenu(this.currentCategory, updatedMenuName, menuId);
    //html 태그에 id 값을 줘보기 ( 상태 데이터의 유일한 값을 주기 위해 )
    this.menu[this.currentCategory] = await MenuApi.getAllMenuByCategory(
      this.currentCategory
    );

    render();
  };

  const removeMenuName = async (e) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      const menuId = e.target.closest("li").dataset.menuId;
      await MenuApi.deleteMenu(this.currentCategory, menuId); // 서버에서 삭제하는 부분
      this.menu[this.currentCategory] = await MenuApi.getAllMenuByCategory(
        this.currentCategory
      ); // 변경내용을 화면에 랜더링하는 부분
      render();
    }
  };

  const soldOutMenu = async (e) => {
    const menuId = e.target.closest("li").dataset.menuId;
    await MenuApi.toggleSoldOutMenu(this.currentCategory, menuId);
    this.menu[this.currentCategory] = await MenuApi.getAllMenuByCategory(
      this.currentCategory
    );
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
    $("nav").addEventListener("click", async (e) => {
      const isCategoryButton =
        e.target.classList.contains("cafe-category-name");
      if (isCategoryButton) {
        const categoryName = e.target.dataset.categoryName;
        this.currentCategory = categoryName;
        $("#category-title").innerText = `${e.target.innerText} 메뉴관리`;
        this.menu[this.currentCategory] = await MenuApi.getAllMenuByCategory(
          this.currentCategory
        );
        render();
      }
    });
  };
}
const app = new App();
app.init();
