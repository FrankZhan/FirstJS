let f = function () {
    let len = arguments.length;
    console.log(len);
    let result = true;
    for (let i in arguments) {
        result = result && arguments[i];
    }
    console.log(result);
};
var p1 = true;
var p2 = false;
var p3 = true;
var a = 'f(p1, p2, p3)';
eval(a)