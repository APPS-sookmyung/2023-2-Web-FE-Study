import { $ } from "./dom.js";
import store from "./store.js";


function App(){
    //상태: 변할 수 있는 데이터, 이 앱에서 변하는 것이 무엇인가, 변해서 관리해야 함
    // - 갯수, 메뉴명
    this.menu ={
        espresso:[],
        frappuccino:[],
        blended:[],
        teavana:[],
        desert:[],
    };
    this.currentCategory = 'espresso';
    this.init = () =>{
        if (store.getLocalStorage()){
            this.menu = store.getLocalStorage();
        }
        render();
        initEventListeners();
    }
    //상태 초기화 이유: 
    //1. 상태가 어떤 데이터 형태가 들어오는지몰라서 this.menu.push를 바로 할 수 없음
    // 2. 협업할 때 이 상태는 어떤 데이터 형태로 들어오는지 확실 히 알 수 없음
    const render = ()=>{
        const template = this.menu[this.currentCategory].map((item, index) =>{
            //data- :data 속성을 저장하고 싶을때의 표준 속성
            return `<li data-menu-id='${index}' class="menu-list-item d-flex items-center py-2">
            <span class="${item.soldOut ? "sold-out":""} w-100 pl-2 menu-name">${item.name}</span>
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
          </li>`;}).join("");
        $("#menu-list").innerHTML = template;
        updateMenuCount();
    }
        

    const updateMenuCount= ()=> $(".menu-count").innerText = `총 ${this.menu[this.currentCategory].length}개`
    const addMenuName = () => {
        if (!$("#menu-name").value){
            alert("값을 입력해주세요.");
            return;
        }
        const menuName = $("#menu-name").value;
        this.menu[this.currentCategory].push({ name: menuName });
        store.setLocalStorage(this.menu);
        // template = [<li></li>, <li></li>, <li></li>...] -> <li></li><li></li><li></li>
        render();
        $("#menu-name").value = "";
        //const menuCount= li 갯수를 카운팅해서
    }
    const updateMenuName = (e) => {
        const menuId = e.target.closest("li").dataset.menuId
        const $menuName = e.target.closest("li").querySelector(".menu-name");
        const changedMenu = prompt("메뉴명을 수정하세요",$menuName.innerText);
        this.menu[this.currentCategory][menuId].name = changedMenu;
        store.setLocalStorage(this.menu)
        render();
    }
    const removeMenuName = (e) => {
        if (confirm("정말로 삭제하시겠습니까?")){
            const menuId = e.target.closest("li").dataset.menuId
            this.menu[this.currentCategory].splice(menuId, 1);
            store.setLocalStorage(this.menu);
            render();
            
        }
    }
    const soldOutMenu = (e) =>{
        const menuId = e.target.closest("li").dataset.menuId;
        this.menu[this.currentCategory][menuId].soldOut = 
        !this.menu[this.currentCategory][menuId].soldOut;
        store.setLocalStorage(this.menu)
        render();
    }

    const initEventListeners = () => {
        $("#menu-list").addEventListener("click",(e)=>{
            if (e.target.classList.contains("menu-edit-button")){
                updateMenuName(e);
                return
            }
            if (e.target.classList.contains("menu-remove-button")){
                removeMenuName(e);
                return
            }
            if (e.target.classList.contains("menu-sold-out-button")){
                soldOutMenu(e);
                return
            }
        })
        $("#menu-form")
            .addEventListener("submit",(e)=>{
                e.preventDefault();
            })
    
        
        $("#menu-submit-button")
            .addEventListener("click", addMenuName); // addMenuName()아님
    
        $("#menu-name")
            .addEventListener("keypress",(e)=>{
                if (e.key !== "Enter"){
                    return;
                }
                addMenuName();
            })
        $("nav").addEventListener("click",(e)=>{
            const isCategoryButton = e.target.classList.contains("cafe-category-name");
            if (isCategoryButton){
                const categoryName = e.target.dataset.categoryName
                this.currentCategory = categoryName;
                render();
                $("#category-title").innerText = `${e.target.innerText} 메뉴 관리`;
                $(".input-label").innerText = `${categoryName} 메뉴 이름`;
            }
        })
    }
    
}
const app = new App();
//그냥 함수는 하나밖에 안 존재함
//new하면 하나의 함수를 모델로 새로운 객체들이 여러개 만들어질 수 있다는 뜻이다.
//채팅방 여러개 띄울 수 있는 앱 -> 채팅방 하나하나가 instance이다.
//상태를 다룰 수 있어야 interactive web application을 만들 수 있음 -> 동적 페이지
app.init();
