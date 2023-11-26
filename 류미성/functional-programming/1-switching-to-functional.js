let users = [
	{ id: 1, name: "ID", age: 36 },
	{ id: 2, name: "BJ", age: 32 },
	{ id: 3, name: "JM", age: 32 },
	{ id: 4, name: "PJ", age: 27 },
	{ id: 5, name: "HA", age: 25 },
	{ id: 6, name: "JE", age: 26 },
	{ id: 7, name: "JI", age: 31 },
	{ id: 8, name: "MP", age: 23 },
];

// 1. 명령형 코드
// 1. 30세 이상인 users를 거른다
let temp_users = [];
for (let i = 0; i < users.length; i++) {
	if (users[i].age >= 30) {
		temp_users.push(users[i]);
	}
}
console.log(temp_users);

// 2. 30세 이상인 users의 names를 수집한다
let names = [];
for (let i = 0; i < users.length; i++) {
	if (users[i].age >= 30) {
		temp_users.push(temp_users[i].name); //앞서 1번에서 30세 이상의 users에서 이름만 추출
	}
}
console.log(names);

// 3. 30세 미만인 users를 거른다
let temp_users = [];
for (let i = 0; i < users.length; i++) {
	if (users[i].age < 30) {
		temp_users.push(users[i]);
	}
}
console.log(temp_users);

// 4. 30세 미만인 users의 ages를 수집한다
let ages = [];
for (let i = 0; i < users.length; i++) {
	if (users[i].age < 30) {
		temp_users.push(temp_users[i].age); //앞서 3번에서 30세 미만의 users에서 나이만 추출
	}
}
console.log(ages);

// 2. _filter, _map으로 리팩토링 (명령어 코드에서 조건부는 다르고 대부분의 코드들은 동일)
// 이 필터와 같은 함수를 응용형 함수라고 한다.
// 응용형 함수는 함수가 함수를 받아서 원하는 시점에 해당하는 함수가 알고 있는 인자를 적용하는 식으로 프로그래밍 하는 것이
// 응용형 함수 그리고 응용형 프로그래밍 또 혹은 적용형 프로그래밍이라고 한다
// 이러한 필터 함수를 고차 함수는 함수를 인자로 받거나 함수를 리턴하거나 함수 안에서 함수를 인자로 받은 함수를 실행하는 함수 등을 이제 고차 함수라고 한다.
function _filter(users, predi) {
	let new_list = [];
	for (let i = 0; i < users.length; i++) {
		if (predi(users[i])) {
			// if (function (user) {return user.age >= 30;}(users[i])) {
			new_list.push(users[i]);
		}
	}
	return new_list;
}

function _map(list, mapper) {
	let new_list = [];
	for (let i = 0; i < list.length; i++) {
		new_list.push(mapper(list[i].name));
	}
	return new_list;
}

let over_30 = _filter(users, function (user) {
	return user.age >= 30;
});

let names = _filter(over_30, function (user) {
	return user.name;
});

let under_30 = _filter(users, function (user) {
	return user.age < 30;
});

let ages = _filter(under_30, function (user) {
	return user.age;
});
