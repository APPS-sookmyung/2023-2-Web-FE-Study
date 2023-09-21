const $ = (selector) => document.querySelector(selector);

function App(){
    const updateMenuCount= ()=> $(".menu-count").innerText = `총 ${$("#espresso-menu-list").querySelectorAll(".menu-list-item").length}개`
    const addMenuName = () => {
        if (!$("#espresso-menu-name").value){
            alert("값을 입력해주세요.");
            return;
        }
        const espressoMenuName = $("#espresso-menu-name").value;
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
        $("#espresso-menu-list").insertAdjacentHTML("beforeend",menuItemTemplate(espressoMenuName));
        $("#espresso-menu-name").value = "";
        //const menuCount= li 갯수를 카운팅해서
        updateMenuCount();
    }
    const updateMenuName = (e) => {
        const $menuName = e.target.closest("li").querySelector(".menu-name");
        const changedMenu = prompt("메뉴명을 수정하세요",$menuName.innerText);
        $menuName.innerText = changedMenu;
    }
    const removeMenuName = (e) => {
        if (confirm("정말로 삭제하시겠습니까?")){
            e.target.parentElement.remove()
            updateMenuCount()
        }
    }

    $("#espresso-menu-list").addEventListener("click",(e)=>{
        if (e.target.classList.contains("menu-edit-button")){
            updateMenuName(e);
        }
        if (e.target.classList.contains("menu-remove-button")){
            removeMenuName(e);
        }
    })
    $("#espresso-menu-form")
        .addEventListener("submit",(e)=>{
            e.preventDefault();
        })

    
    $("#espresso-menu-submit-button")
        .addEventListener("click", addMenuName); // addMenuName()아님

    $("#espresso-menu-name")
        .addEventListener("keypress",(e)=>{
            if (e.key !== "Enter"){
                return;
            }
            addMenuName();
        })
}
App();
