const store = {
  // localstorage 관련 메서드를 가지고 있는 객체
  setLocalStorage(menu) {
    localStorage.setItem("menu", JSON.stringify(menu)); // 로컬 스토리지는 문자열로만 저장할 수 있음. 따라서 JSON 객체변환 메서드 사용하기
  },
  getLocalStorage() {
    return JSON.parse(localStorage.getItem("menu"));
  },
};

export default store;
