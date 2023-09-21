const $ = (selector) => document.querySelector(selector);

function App() {

    //수정버튼 구현 (위로 위임하는 기능) => 모달창 ( promt 로 구현 )
    $("#espresso-menu-list").addEventListener("click", (e)=> {

    //if 로 올바른(수정) 버튼인지 ( class 로 구분 )
    if(e.target.classList.contains("menu-edit-button")) {
      const $menuName=e.target.closest("li").querySelector(".menu-name");
      // e.target 중 가장 가까운 li 찾음 ,, 이너텍스트로 텍스트 가져오기
      const updatedMenuName=prompt("메뉴명을 수정하세요", $menuName.innerText);// 인자 사용 유의하기
      $menuName.innerText = updatedMenuName;
    }

  });


   //form태그가 자동으로 전송되는걸 막아준다.
   $("#espresso-menu-form").addEventListener("submit", (e) => {
      e.preventDefault();
   });

   //재사용하는 부분
   const addMenuName= ()=> {
    if ($("#espresso-menu-name").value === "") {
      alert("값을 입력해주세요.");
      return; // 뒷부분(엔터가 실행되지 않도록)
    }
    const espressoMenuName = $("#espresso-menu-name").value;
    const menuItemTemplate = (espressoMenuName) => {
            return `
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
        </li>`;
         };
         $("#espresso-menu-list").insertAdjacentHTML("beforeend", menuItemTemplate(espressoMenuName));
         const menuCount = $("#espresso-menu-list").querySelectorAll("li").length
         $(".menu-count").innerText = `총 ${menuCount} 개`
         $("#espresso-menu-name").value = "";

   }

   $("#espresso-menu-submit-button").addEventListener("click", () => {
    addMenuName();
   });

   // 메뉴의 이름을 입력받는건
   $("#espresso-menu-name").addEventListener("keypress", (e) => {
    if (e.key !== "Enter") { // 처음에 엔터를 눌러도 alert 안뜨게 
      return;
    }
    addMenuName();
   });


}

App();