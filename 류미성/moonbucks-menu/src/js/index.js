// TODO localStorage Read & Write
// - [] localStorage에 데이터를 저장한다.
// - [] localStorage에 있는 데이터를 읽어온다.

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

// -> 요구사항을 상세하게 분석하고, 어떤것을 구현해야 되는지를 정리하면서 눈으로 확인하기

const $ = (selector) => document.querySelector(selector);

const store = {
	setLocalStorage(menu) {
		localStorage.setItem("menu", JSON.stringify(menu));
	},
	getLocalStorage() {
		localStorage.getItem("menu");
	},
};

function App() {
	// 상태는 변하는 데이터, 이 앱에서 변하는 것이 무엇인가 - 메뉴명 (갯수 X)
	// 메뉴명이 배열이 담겨있고, 배열의 길이를 알면 갯수를 알 수 있음. (-> 갯수는 업데이트만 하고 저장하지 않아도 되는 대상).
	// 최소한의 데이터만 관리리해야할 데이터가 무엇인지 항상 고민하기. 안그러면 코드가 복잡해질 수 있음 따라서 메뉴명만 관리하기
	this.menu = [];

	const updateMenuCount = () => {
		const menuCount = $("#espresso-menu-list").querySelectorAll("li").length;
		$(".menu-count").innerText = `총 ${menuCount} 개`;
	};

	//재사용하는 부분을 한곳에 모아줌
	const addMenuName = () => {
		if ($("#espresso-menu-name").value === "") {
			alert("값을 입력해주세요.");
			return;
		}
		const espressoMenuName = $("#espresso-menu-name").value;
		this.menu.push({ name: espressoMenuName });
		store.setLocalStorage(this.menu);
		const template = this.menu
			.map((item) => {
				return `
				<li class="menu-list-item d-flex items-center py-2">
					<span class="w-100 pl-2 menu-name">${item.menu}</span>
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
		// map method를 통해 메뉴를 순회하면서 html 화면 넣는 마크업을 한다. 순회하면서 리턴한 값을 새로운 배열로 만들어준다.
		// ["<li>~</<li>", "<li>~</<li>"]와 같은 형태로 반복적으로 출력 -> template 생성;

		$("#espresso-menu-list").innerHTML = template;
		updateMenuCount();
		$("#espresso-menu-name").value = "";
	};

	const updateMenuName = (e) => {
		const $menuName = e.target.closest("li").querySelector(".menu-name");
		// e.target 중 가장 가까운 li 찾음. 이너텍스트로 텍스트 가져오기
		const updatedMenuName = prompt("메뉴명을 수정하세요", $menuName.innerText); // 인자 사용 유의하기
		$menuName.innerText = updatedMenuName; //e를 변수로 활용
	};

	const removeMenuName = (e) => {
		if (confirm("정말 삭제하시겠습니까?")) {
			e.target.closest("li").remove();
			updateMenuCount(e);
		}
	};

	$("#espresso-menu-list").addEventListener("click", (e) => {
		//if 로 올바른(수정) 버튼인지 ( class 로 구분 )
		if (e.target.classList.contains("menu-edit-button")) {
			updateMenuName(e); //리팩터링
		}

		if (e.target.classList.contains("menu-remove-button")) {
			removeMenuName(e); //리팩터링
		}
	});

	//form태그가 자동으로 전송되는걸 막아준다.
	$("#espresso-menu-form").addEventListener("submit", (e) => {
		e.preventDefault();
	});

	$("#espresso-menu-submit-button").addEventListener("click", addMenuName);

	// 메뉴의 이름을 입력받는건
	$("#espresso-menu-name").addEventListener("keypress", (e) => {
		if (e.key !== "Enter") {
			// 처음에 엔터를 눌러도 alert 안뜨게
			return;
		}
		addMenuName();
	});
}

const app = new App();
