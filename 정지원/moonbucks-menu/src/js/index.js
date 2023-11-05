import { $ } from "//utils/dom.js";
import store from "./store/index.js";

const BASE_URL = "http://localhost:3000/api";

const MenuApi = {
  async getAllMenuByCategory(category) {
    const response = await fetch("${BASE_URL}/category/${category}/menu");
    return response.json();
  },
  async createMenu(category, name) {
    const response = await fetch("${BASE_URL}/category/${category}/menu", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", //주고받는 컨텐츠 타입을 정의할 수 있는데 대부분 json 사용
      },
      body: JSON.stringify({ name }), //사용자가 입력한 값을 넣어서 서버에 요청
    });
    if (resopnse.ok) {
      console.error("에러가 발생했습니다.");
    }
  },
  async updateMenu(category, name, menuId) {
    const response = await fetch(
      "${BASE_URL}/category/${category}/menu/${menuId}",
      {
        method: "PUT", //생성할 땐 PUT을 사용한다는 것만 알아두기
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      }
    );
    if (resopnse.ok) {
      console.error("에러가 발생했습니다.");
    }
    return response.json();
  },
  async toggleSoldOutMenu(category, menuId) {
    const response = await fetch(
      "${BASE_URL}/category/${category}/menu/${menuId}/soldout",
      {
        method: "PUT",
      }
    );
    if (resopnse.ok) {
      console.error("에러가 발생했습니다.");
    }
  },
  async deleteMenu(category, menuId) {
    const response = await fetch(
      "${BASE_URL}/category/${category}/menu/${menuId}",
      {
        method: "DELETE",
      }
    );
    if (resopnse.ok) {
      console.error("에러가 발생했습니다.");
    }
  },
};

function App() {
  //상태 - 메뉴명
  this.menu = {
    espresso: [],
    frappuccino: [],
    blended: [],
    tevana: [],
    desert: [],
  };
  this.currentCategory = "espresso";

  this.init = async () => {
    this.menu[this.currentCategory] = await MenuApi.getAllMenuByCategory(
      currentCategory
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
        }" class= "menu-list-item d-flex items-center py-2">
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

    // 추가되는 메뉴의 마크업을 espresso-menu-list에 삽입. beforeend여야 메뉴가 삽입되는 순서대로 저장됨.
    $("#menu-list").innerHTML = template;
    // li 개수를 카운팅해서 총 개수 구하기
    updateMenuCount();
  };

  const updateMenuCount = () => {
    const menuCount = this.menu[this.currentCategory].length;
    $(".menu-count").innerText = "총 ${menuCount} 개";
  };

  //중복되는 코드를 재사용할 수 있도록하는 코드
  const addMenuName = async () => {
    if ($("#menu-name").value === "") {
      alert("값을 입력해주세요");
      return;
    }
    const MenuName = $("menu-name").value;
    await MenuApi.createMenu(this.currentCategory, menuName);
    this.menu[this.currentCategory] = await MenuApi.getAllMenuByCategory(
      //여기서는 this가 App 안에서 사용되기 때문에 this.currentCategory로 불러옴
      this.currentCategory
    );
    render();
    $("menu-name").value = "";
  };

  const updatedMenuName = async (e) => {
    const menuId = e.target.closest("li").dataset.menuId;
    //중복되는 부분 변수에 담아서 깔끔하게 사용
    const $menuName = e.target.closest("li").querySelector(".menu-name");
    const updatedMenuName = prompt("메뉴명을 수정하세요", menuName, innerText);
    await MenuApi.updateMenu(this.currentCategory, updatedMenuName, menuId);
    //this로 App()의 category를 계속 가져올 수 있음
    this.menu[this.currentCategory] = await MenuApi.getAllMenuByCategory(
      this.currentCategory
    );
    render();
  };

  const removeMenuName = async (e) => {
    const menuId = e.target.closest("li").dataset.menuId;
    await MenuApi.deleteMenu(this.currentCategory, menuId);
    this.menu[this.currentCategory] = await MenuApi.getAllMenuByCategory(
      this.currentCategory
    );
    render();
    //삭제했을 때 총 개수 -1되도록 함.
  };

  const soldOutMenu = async (e) => {
    const menuId = e.target.closest("li").dataset.menuId;
    await MenuApi.toggleSoldOutMenu(this.currentCategory, this.menuId);
    this.menu[this.currentCategory] = await MenuApi.getAllMenuByCategory(
      this.currentCategory
    );
    render();
  };

  const initEventListeners = () => {
    //메뉴의 수정 버튼 클릭 이벤트를 받고, 메뉴 수정하는 모달창(prompt)이 뜬다
    //모달창에서 신규메뉴명을 입력 받고, 확인버튼을 누르면 메유가 수정된다.
    $("#menu-list").addEventListener("click", (e) => {
      if (e.target.classList.contains("menu-edit-button")) {
        updatedMenuName(e);
        return;
      }

      //메뉴 삭제 버튼 클릭 이벤트를 받고, 메뉴 삭제 confirm 모달창이 뜬다
      if (e.target.classList.contains("menu-remove-button")) {
        removeMenuName(e);
        return;
      }

      if (e.target.classList.contains("menu-sold-out-button")) {
        soldOutMenu(e);
        return;
      }
    });

    //form태그가 자동으로 전송되는 걸 막아준다.(사용자가 입력하 값이 잘 출력되도록 함)
    $("menu-form") //element 찾기
      .addEventListener("submit", (e) => {
        e.preventDefault();
      });

    $("#menu-submit-button").addEventListener("click", addMenuName);

    //메뉴 이름 입력받고 엔터키 입력으로 추가한다.
    $("menu-name") //element 찾기
      .addEventListener("keypress", (e) => {
        //사용자가 keypress에 입력한 값 받기
        //빈 값을 입력헀을 때 저장되지 않고 alert메세지 뜨도록 하기
        if (e.key !== "Enter") {
          return;
        }
        addMenuName();
      });

    $("nav").addEventListener("click", async (e) => {
      //async는 함수가 시작하는 부분 앞에 작성
      const isCategoryButton =
        e.target.classList.contains("cafe-category-name");
      if (isCategoryButton) {
        const categoryName = e.target.dataset.categoryName;
        this.currentCategory = categoryName;
        $("#category-title").innerText = "${e.target.innerText} 메뉴 관리";
        //데이터 불러오는 로직을 추가해야 새로고침해도 리스트가 남아있음
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
