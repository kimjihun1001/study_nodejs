// array, object
// function

var f = ()=>console.log('Hi');
f();

var a = [f];
a[0]();

var o = {
    func: f
}
o.func();