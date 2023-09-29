// Step1 요구사항 구현
// TODO 메뉴 추가
// [ ] 에스프레소 메뉴에 새로운 메뉴를 확인 버튼 또는 엔터키 입력으로 추가한다.
// [ ] 메뉴가 추가되고 나면, input은 빈 값으로 초기화한다.
// [ ] 사용자 입력값이 빈 값이라면 추가되지 않는다.
// [ ] 메뉴의 수정 버튼을 눌러 메뉴 이름 수정할 수 있다.
// [ ] 메뉴 수정시 브라우저에서 제공하는 prompt 인터페이스를 활용한다.
// [ ] 메뉴 삭제 버튼을 이용하여 메뉴 삭제할 수 있다.
// [ ] 메뉴 삭제시 브라우저에서 제공하는 confirm 인터페이스를 활용한다.
// [ ] 총 메뉴 갯수를 count하여 상단에 보여준다.
// 추가되는 메뉴의 아래 마크업은 <ul id="espresso-menu-list" class="mt-3 pl-0"></ul> 안에 삽입해야 한다.

const $ = (selector) => document.querySelector(selector);

function App() {
  // form 태그가 자동으로 전송되는 것을 막아줌
  $('#espresso-menu-form').addEventListener('submit', (e) => {
    e.preventDefault();
  });
  // 사용자료부터 메뉴 이름을 입력받기
  $('#espresso-menu-name').addEventListener('keypress', (e) => {
    console.log(e.key);
    if (e.key === 'Enter') {
      const espressoMenuName = $('#espresso-menu-name').value;
      const menuItemTemplate = (espressoMenuName) => {
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
      $('#espresso-menu-list').insertAdjacentHTML(
        'beforeend',
        menuItemTemplate(espressoMenuName)
      );
    }
  });
}

App();

// MEMO
// 사용자로부터 키보드 입력 이벤트 받을 때 이벤트명은 일단 그냥 keypress로 하고 넘어감
// form 태그로 인해 화면이 자동 새로고침 됨(자동으로 전송되기 때문)
// util같은 함수 만들기; js에서 html element를 가져올 때 관용적으로 "$"를 많이 사용함
// 추가되는 메뉴는 매번 똑같은 형식의 마크업으로 추가되는거니까 제공된 코드를 템플릿 변수에 함수로 담아서 사용할건데, 이름은 menuItemTemplate으로 지었음. 메뉴'하나'추가니까 Item !!
// insertadjacenthtml() 메서드 이용
