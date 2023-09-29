function App() {
  // form 태그가 자동으로 전송되는 것을 막아줌
  document
    .querySelector('#espresso-menu-form')
    .addEventListener('submit', (e) => {
      e.preventDefault();
    });
  // 사용자료부터 메뉴 이름을 입력받기
  document
    .querySelector('#espresso-menu-name')
    .addEventListener('keypress', (e) => {
      console.log(e.key);
      if (e.key === 'Enter') {
        console.log(document.querySelector('#espresso-menu-name').value);
      }
    });
}

App();

// MEMO
// 사용자로부터 키보드 입력 이벤트 받을 때 이벤트명은 일단 그냥 keypress로 하고 넘어감
// form 태그로 인해 화면이 자동 새로고침 됨(자동으로 전송되기 때문)
