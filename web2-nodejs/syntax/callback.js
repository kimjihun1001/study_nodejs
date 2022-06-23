function a(){
    console.log('A');
}

// 이름이 없는 함수: 익명 함수
// 이름이 없으면 호출할 수 없다
// 앞에다가 변수 할당. 그럼 이 함수 이름은 b가 된다
// JS에서는 "함수가 값이다"
var b = function(){
    console.log('B');
}
a();
b();

function slowfunc(callback){
    callback();
}

slowfunc(b);