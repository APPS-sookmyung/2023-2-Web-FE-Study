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
			console.error("에러가 발생했습니다.");
		}
	},

	async updateMenu(category, name, menuId) {
		const response = await fetch(`${BASE_URL}/category/${category}/menu/${menuId}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ name }),
		});
		if (!response.ok) {
			console.error("에러가 발생했습니다.");
		}
		return response.json();
	},

	async toggleSoldOutMenu(category, menuId) {
		const response = await fetch(`${BASE_URL}/category/${category}/menu/${menuId}/soldout`, {
			method: "PUT",
		});
		if (!response.ok) {
			console.error("에러가 발생했습니다.");
		}
	},

	async deleteMenu(category, menuId) {
		const response = await fetch(`${BASE_URL}/category/${category}/menu/${menuId}/`, {
			method: "DELETE",
		});
		if (!response.ok) {
			console.error("에러가 발생했습니다.");
		}
	},
};

function App() {
	this.menu = {
		espresso: [],
		frappuccino: [],
		blended: [],
		teavana: [],
		desert: [],
	};
	this.currentCategory = "espresso";
	this.init = async () => {
		this.menu[this.currentCategory] = await MenuApi.getAllMenuByCategory(this.currentCategory);
		render();
		initEventListeners();
	};

	const render = () => {
		const template = this.menu[this.currentCategory]
			.map((menuItem, index) => {
				return `
				<li data-menu-id="${menuItem.id}" class="menu-list-item d-flex items-center py-2">
				<span class="w-100 pl-2 menu-name ${menuItem.isSoldOut ? "sold-out" : ""} ">${menuItem.name}</span>
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
		this.menu[this.currentCategory] = await MenuApi.getAllMenuByCategory(this.currentCategory);
		render();
		$("#menu-name").value = "";
	};

	const updateMenuName = async (e) => {
		const menuId = e.target.closest("li").dataset.menuId;
		const $menuName = e.target.closest("li").querySelector(".menu-name");
		const updatedMenuName = prompt("메뉴명을 수정하세요", $menuName.innerText);
		await MenuApi.updateMenu(this.currentCategory, updatedMenuName, menuId);
		this.menu[this.currentCategory] = await MenuApi.getAllMenuByCategory(this.currentCategory);
		render();
	};

	const removeMenuName = async (e) => {
		if (confirm("정말 삭제하시겠습니까?")) {
			const menuId = e.target.closest("li").dataset.menuId;
			await MenuApi.deleteMenu(this.currentCategory, menuId);
			this.menu[this.currentCategory] = await MenuApi.getAllMenuByCategory(this.currentCategory);
			render();
		}
	};

	const soldOutMenu = async (e) => {
		const menuId = e.target.closest("li").dataset.menuId;
		await MenuApi.toggleSoldOutMenu(this.currentCategory, menuId);
		this.menu[this.currentCategory] = await MenuApi.getAllMenuByCategory(this.currentCategory);
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
		$("#menu-name").addEventListener("keypress", (e) => {
			if (e.key !== "Enter") {
				return;
			}
			addMenuName();
		});

		//메뉴판 관리하기
		$("nav").addEventListener("click", async (e) => {
			const isCategoryButton = e.target.classList.contains("cafe-category-name");
			if (isCategoryButton) {
				const categoryName = e.target.dataset.categoryName;
				this.currentCategory = categoryName;
				$("#category-title").innerText = `${e.target.innerText} 메뉴관리`;
				this.menu[this.currentCategory] = await MenuApi.getAllMenuByCategory(this.currentCategory);
				render();
			}
		});
	};
}
const app = new App();
app.init();
