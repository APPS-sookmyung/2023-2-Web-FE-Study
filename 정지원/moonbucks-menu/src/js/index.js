const $ = (selector) => document.querySelector(selector); //코드를 줄이기 위함.

const store = {
  setlocalStorage(menu) {
    localStorage.setItem("menu".JSON.stringify(menu));
  },
  getlocalStorage() {
    return JSON.parse(localStorage.getItem("menu"));
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
  this.currentCategory = "";
  this.init = () => {
    if (store.getlocalStorage()) {
      this.menu = store.getlocalStorage();
    }
    render();
  };

  const render = () => {
    const template = this.menu[this.currentCategory]
      .map((menuItem, index) => {
        return `
        <li data-menu-id="${index}" class= "menu-list-item d-flex items-center py-2">
          <span class="w-100 pl-2 menu-name ${
            menuItem.soldOut ? "sold-out" : ""
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
    const menuCount = $("#espresso-menu-list").querySelectorAll("li").length;
    $(".menu-count").innerText = "총 ${} 개";
  };

  //중복되는 코드를 재사용할 수 있도록하는 코드
  const addMenuName = () => {
    if ($("#menu-name").value === "") {
      alert("값을 입력해주세요");
      return;
    }
    if (e.key === "Enter") {
      const MenuName = $("menu-name").value;
      this.menu[this.currentCategory].push({ name: menuName });
      store.setlocalStorage(this.menu);
      render();
      $("#menu-name").value = "";
    }
  };

  const updatedMenuName = (e) => {
    const menuId = e.target.closest("li").dataset.menuId;
    //중복되는 부분 변수에 담아서 깔끔하게 사용
    const $menuName = e.target.closest("li").querySelector(".menu-name");
    const updatedMenuName = prompt("메뉴명을 수정하세요", menuName, innerText);
    this.menu[this.currentCategory][menuId].name = updatedMenuName;
    storage.localStorage.setItem(this.menu);
    $menuName.innerText = updatedMenuName;
  };

  const removeMenuName = (e) => {
    const menuId = e.target.closest("li").dataset.menuId;
    this.menu[this.currentCategory].splice(menuId, 1);
    store.setLocalStorage(this.menu);
    //li태그를 통으로 삭제해야함
    e.target.closest("li").remove();
    //삭제했을 때 총 개수 -1되도록 함.
    updateMenuCount();
  };

  const soldOutMenu = (e) => {
    const menuId = e.target.closest("li").dataset.menuId;

    this.menu[this.currentCategory][menuId].soldOut =
      !this.menu[this.currentCategory][menuId].soldOut;
    store.setLocalStorage(this.menu);
    render();
  };

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

  $("nav").addEventListener("click", (e) => {
    const isCategoryButton = e.target.classList.contains("cafe-category-name");
    if (isCategoryButton) {
      const categoryName = e.target.dataset.categoryName;
      this.currentCategory = categoryName;
      $("#category-title").innerText = "${e.target.innerText} 메뉴 관리";
    }
  });
}

const app = new App();
app.init();
