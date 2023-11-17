function _filter(users, predi) {
	let new_list = [];
	_each(list, function (val) {
		if (predi(val)) {
			new_list.push(val);
		}
	});
	// for (let i = 0; i < users.length; i++) {
	// 	if (predi(users[i])) {
	// 		// if (function (user) {return user.age >= 30;}(users[i])) {
	// 		new_list.push(users[i]);
	// 	}
	// }
	return new_list;
}

function _map(list, mapper) {
	let new_list = [];
	_each(list, function (val) {
		new_list.push(mapper(val));
	});
	// for (let i = 0; i < list.length; i++) {
	// 	new_list.push(mapper(list[i]));
	// } -> 선언적인 코드 표현이 되고 더 단순해지고 오류를 내지 않고 실수가 줄어들고
	// 보다 내가 정확하게 코딩을 했다라는 그런 어떤 확신을 더 쉽게 느낄 수 있도록
	// 코드가 좋아지고 정확하게 코딩을 했다라는 그런 어떤 확신을 더 쉽게 느낄 수 있도록 코드가 좋아지고 있음
	return new_list;
}

function _each(list, iter) {
	for (let i = 0; i < list.length; i++) {
		iter(list[i]);
	}
	return list;
}
