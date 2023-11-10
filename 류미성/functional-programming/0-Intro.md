# 순수 함수 vs 순수 함수가 아닌 함수

- 순수함수

  - 조건

    - 동일한 인자가 들어갈 경우 항상 같은 값이 나와야 한다.
    - 부수적인 효과가 일어나면 안 된다.
    - return 값으로만 소통한다.
    - 순수함수는 평가 시점이 중요하지 않다.만약 순수함수가 아니라면 동일한 인자를 넣어도 다른 값이 나오는 경우 어떠한 시점에서 함수를 평가할지가 굉장히 중요한데 순수함수는 동일한 인자를 넣으면 항상 같은 값이 나오기 때문에 굳이 평가시점을 따질 필요가 없다.

    ```jsx
    // 순수함수
    function add(a, b) {
    	return a + b;
    }

    console.log(add(10, 5));
    console.log(add(10, 5));
    console.log(add(10, 5));
    ```

- 순수함수가 아닌 함수

  - 22를 리턴할때도 있고, 32를 리턴할때도 있음
  - 평가시점이 중요 → 평가 전후에 따라 값이 달라지기 때문 (로직이 정해지기도 함)

  ```jsx
  // 순수함수가 아닌 경우
  let c = 10;
  function add2(a, b) {
  	return a + b + c;
  }

  console.log(add2(5, 5)); // 20

  c = 15;
  console.log(add2(5, 5)); //25
  ```

- 부수적인 효과

  - 부수적인 효과가 일어난다.
  - 부수적인 효과 -> 함수에서 외부의 변수의 값을 변경하거나 들어온 인자의 값을 변화시키는 경우
  - return 값도 없고 마찬가지로 외부의 값을 함수 내부에서 변경하는 부수효과가 일어난다.

  ```jsx
  let obj1 = { val: 10 };
  function add4(obj, b) {
  	obj.val += b;
  }
  console.log(obj1.val); //10
  add4(obj1, 20);
  console.log(obj1.val); //30
  ```

  <br />

# 일급함수

: 함수를 값으로 담을수 있다. 변수에 함수를 값으로 넣을수 있다. 그러므로 인자로 함수를 전달할수도 있다. 원하는 시점에서 함수를 평가(실행)할수 있다.

- 언제나 정의할수있고, 들고다닐수 있고, 인자로 보낼수 있고, 원하는 시점에 들고다니다가 원하는 시점에 평가할 수 있음

  - 함수를 값으로 다룰수 있음
    ```jsx
    const f1 = function (a) {
    	return a * a;
    };
    console.log(f1); //ƒ (a) { return a * a; }
    ```
  - 함수를 인자로 전달 할 수 있음
    ```jsx
    const f2 = function () {
    	return 5;
    };
    const f1 = function (f) {
    	return f();
    };
    f1(f2);
    ```
  - 함수를 리턴할 수도 있다.

    ```jsx
    function add_maker(a) {
    	return function (b) {
    		return a + b;
    	};
    }
    let add10 = add_maker(10);
    //add10 의 값은 add_maker 리턴함수인 function(b) {return a+b}
    //또한 클로저이다. add_maker 에서 인자로 10을 넘겨주고 종료되지만 리턴함수가 10을 기억하고 있다.
    //그래서 결괏값이 30이 나오는것

    console.log(add10(20)); //30

    let add5 = add_maker(5);
    let add15 = add_maker(15);

    console.log(add5(10)); //15
    console.log(add15(10)); //25

    console.log(add10(20)); //30
    ```

- 언제평가해도 상관없는 순수함수들을 많이 만들고, 순수함수들을 값으로 들고다니면서 필요한시점마다 평가하면서 다양한 로직으로 만들어나가는 것이 함수형 프로그래밍

  ```jsx
  function f3(f) {
  	return f();
  }

  console.log(
  	f3(function () {
  		return 10;
  	})
  );

  console.log(
  	f3(function () {
  		return 20;
  	})
  );
  ```

- add_maker (일급함수 + closure)

  ```jsx
  function add_maker(a) {
  	return function (b) {
  		return a + b;
  	};
  }

  var add10 = add_maker(10);

  console.log(add10(20));
  ```

- 함수형 프로그래밍

  - 비동기가 일어나는 시점이나 동시성이 필요한 시점에서 함수가 실행하는 시점에서 함수를 값으로 다루다가 원하는 시점에 평가를 하는 등의 코드 형태를 띠면서 프로그래밍 하는 것

  ```jsx
  function f4(f1, f2, f3) {
  	return f3(f1() + f2());
  }

  console.log(
  	f4(
  		function () {
  			return 2;
  		},
  		function () {
  			return 1;
  		},
  		function (a) {
  			return a * a;
  		}
  	)
  );
  ```

  ![요즘 개발 이야기](img/image.png)

- 함수의 정의

  ![함수형 프로그래밍](img/image-1.png)

- 객체지향 vs 함수형

  - 객체가 먼저 나오면 객체지향 프로그래밍
    - 데이터를 디자인하고, 데이터에 맞는 method를 만드는 식
  - 함수가 먼저 나오면 함수형 프로그래밍

    - 함수를 만들고 함수에 맞게 데이터세트를 구성

    ```jsx
    // 데이터(객체) 기준
    duck.moveLeft();
    duck.moveRight();
    dog.moveLeft();
    dog.moveRight();

    // 함수기준
    moveLeft(dog);
    moveRight(duck);
    moveLeft({ x: 5, y: 2 });
    moveRight(dog);
    ```

### 함수형 프로그래밍을 어떻게 하는가? → 앞으로의 학습 내용
