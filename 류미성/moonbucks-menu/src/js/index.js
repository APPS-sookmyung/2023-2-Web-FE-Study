// TODO localStorage Read & Write
// - [x] localStorage에 데이터를 저장한다.
// - [x] 메뉴를 추가할 때
// - [x] 메뉴를 수정할 때
// - [x] 메뉴를 삭제할 때
// - [x] localStorage에 있는 데이터를 읽어온다.

// TODO 카테고리별 메뉴판 관리
// - [] 에스프레소 메뉴판 관리
// - [] 프라푸치노 메뉴판 관리
// - [] 블렌디드 메뉴판 관리
// - [] 티바나 메뉴판 관리
// - [] 디저트 메뉴판 관리

// TODO 페이지 접근시 최초 데이터 Read&Rendering
// - [] 페이지에 최초로 접근할 때는 localStorage에서 에스프레소 메뉴를 읽어온다.
// - [] 에스프레소 메뉴를 페이지에 그려준다.
//
// - [] 품절 상태인 경우를 보여줄 수 있게, 품절 버튼을 추가하고 sold-out class를 추가하여 상태를 변경한다.
// - [] 품절 버튼을 추가한다
// - [] 품절 버튼을 클릭하면 localStorage에 상태값이 저장된다
// - [] 품절 해당 메뉴의 상태값이 페이지에 그려진다.
//  -[] 클릭이벤트에서 가장 가까운 li태그의 class속성 값에 sold-out을 추가한다.

// TODO 서버 요청 부분
// [] 웹 서버를 띄운다
// [] 서버의 새로운 메뉴명이 추가될 수 있도록 요청한다 ( api 당 하나의 카테고리로 해서 서버에 요청하도록 )
// [] 서버에 카테고리별 메뉴리스트를 불러온다.
// [] 서버에 메뉴가 수정 될 수 있도록 요청한다.
// [] 서버에 메뉴의 품절상태를 토글될 수 있도록 요청한다.
// [] 서버에 메뉴가 삭제될 수 있도록 요청한다
//
// TODO 리팩터링 부분
// [] localStorage에 저장되는 로직은 지운다
// [] fetch 비동기 api를 사용하는 부분을 async await을 사용하여 구현한다.

// TODO 사용자 경험
// [] API 통신이 실패하는 경우에 대해 사용자
// [] 중복되는 메뉴는 추가할 수 있다.

import { $ } from "./utils/dom.js";
import store from "./store/index.js";

const BASE_URL = "http://localhost:3000/api";

// fetch('url', option)

function App() {
	this.menu = {
		espresso: [],
		frappuccino: [],
		blended: [],
		teavana: [],
		desert: [],
	};
	this.currentCategory = "espresso";

	this.init = () => {
		if (store.getLocalStorage()) {
			this.menu = store.getLocalStorage();
		}
		render();
		initEventListeners();
	};

	const render = () => {
		const template = this.menu[this.currentCategory]
			.map((menuItem, index) => {
				return `
			<li data-menu-id="${index}" class="menu-list-item d-flex items-center s py-2">
				<span class="w-100 pl-2 menu-name ${menuItem.soldOut ? "sold-out" : ""} ">${menuItem.name}</span>
				<button
					type="button" class="bg-gray-50 text-gray-500 text-sm mr-1 menu-sold-out-button"
				>
					품절
				</button>
				<button
					type="button" class="bg-gray-50 text-gray-500 text-sm mr-1 menu-edit-button"
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
		const menuCount = this.menu[this.currentCategory].length;
		$(".menu-count").innerText = `총 ${menuCount} 개`;
	};

	const addMenuName = () => {
		if ($("#menu-name").value === "") {
			alert("값을 입력해주세요.");
			return;
		}
		const MenuName = $("#menu-name").value;

		fetch(`${BASE_URL}/category/${this.currentCategory}/menu`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ name: menuName }),
		})
			.then((response) => {
				return response.json();
			})
			.then((data) => {
				console.log(data);
			});
		// this.menu[this.currentCategory].push({ name: MenuName });
		store.setLocalStorage(this.menu);
		render();
		$("#menu-name").value = "";
	};

	const updateMenuName = (e) => {
		const menuId = e.target.closest("li").dataset.menuId;
		const $menuName = e.target.closest("li").querySelector(".menu-name");
		const updatedMenuName = prompt("메뉴명을 수정하세요", $menuName.innerText); // 인자 사용 유의하기
		this.menu[this.currentCategory][menuId].name = updatedMenuName;
		store.setLocalStorage(this.menu);
		render();
	};

	const removeMenuName = (e) => {
		if (confirm("정말 삭제하시겠습니까?")) {
			const menuId = e.target.closest("li").dataset.menuId;
			this.menu[this.currentCategory].splice(menuId, 1);
			store.setLocalStorage(this.menu);
			render();
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
			if (e.target.classList.contains("menu-edit-button")) {
				updateMenuName(e);
				return;
			}

			if (e.target.classList.contains("menu-remove-button")) {
				removeMenuName(e);
				return;
			}

			if (e.target.classList.contains("menu-sold-out-button")) {
				soldOutMenu(e);
				return;
			}
		});

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

		$("nav").addEventListener("click", (e) => {
			const isCategoryButton = e.target.classList.contains("cafe-category-name");
			if (isCategoryButton) {
				const categoryName = e.target.dataset.categoryName;
				this.currentCategory = categoryName;
				$("#category-title").innerText = `${e.target.innerText} 메뉴관리`;
				render();
			}
		});
	};
}
const app = new App();
app.init();
