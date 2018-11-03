
function checkname(value) {
    //判断命名是否合法：字母和数字且首字母不为数字
    var Regx = /^[A-Za-z0-9]*$/;
    if (Regx.test(value) && !(value[0]>='0'&&value[0]<='9')) {
        return true;
    } else {
        return false;
    }
}
function isSymbol(char) {
    //判断char是否是运算符 ¬,∧,∨,→,⊕,↔, ',', (, )
    //0, 1当特殊变量使用
    return char==='¬' || char==='∧' || char==='∨' || char==='→' || char==='⊕' || char==='↔' || char==='(' || char===')' || char===',';
}
function output(str) {
    //输出
    if(str==null){
        str = '字符串为空';
    }
    console.log(str);
}
function test() {
    // ¬
    var sentence = '((q ⊕ r)⊕s)↔(q ⊕ r ⊕s(q,p))P'
    sentence = sentence.replace(/\s+/g, '');    // 去除空格
    var myStack = [];
    console.log('start name')
    //遍历字符串，检查变量名
    var flag=false;
    var tmp='';
    for(var j=0; j<sentence.length ; j++) {
        if (isSymbol(sentence[j]) || j===sentence.length-1) {
            if (flag) {
                flag = false;
                if ((tmp == "0") || tmp == '1' || checkname(tmp)) {
                    myStack.push(tmp);
                } else {
                    output(sentence.slice(0, j) + '?\n 命名错误')
                    return
                }
            }
            myStack.push(sentence[j]);
        } else {
            if (!flag) {
                flag = true;
                tmp = '';
            }
            tmp += sentence[j];
        }
    }

    console.log('start symbol');
    console.log(myStack);
    //匹配运算符
    var numL = 0, numR=0; // 左括号和右括号数目
    for(var j=0; j<myStack.length; j++){
        if(!isSymbol(myStack[j])){      //变量、函数、0、1必须和运算符挨着。而且 P¬ 和 )P 情况为错误
            if((j-1>=0 && myStack[j-1]===')') || (j+1<myStack.length && myStack[j+1]==='¬')){
                output(sentence + '\n' + myStack[j] + '前不能有 ) ，后不能有 ¬ ');
                return
            }
        }else if(myStack[j] === '('){   //左括号计数
            numL++;
        }else if(myStack[j] === ')'){   //右括号匹配
            numR++;
            if(numR>numL){
                output(sentence + '\n括号不匹配');
                return
            }
            if(myStack[j-1]==='('){
                output(sentence + '\n空括号');
                return
            }
        }else if(myStack[j]==='¬'){     // !运算符后面必须是变量、函数、0、1或者括号
            if(j+1>=myStack.length){
                output(sentence + '\n¬后面不能为空')
                return
            }
            if(isSymbol(myStack[j+1]) && myStack[j+1]!=='('){
                output(sentence + '\n¬ 后面不能是运算符');
                return
            }
        }else {     //二元运算符 ∧,∨,→,⊕,↔, ','; 二元运算符前后必须是变量、常量、函数或者括号
            if((isSymbol(myStack[j-1]) && myStack[j-1]!==')') || (isSymbol(myStack[j+1]) && myStack[j+1]!=='(')){
                output(sentence + '\n' + myStack[j] + '必须连接两个个运算元素');
                return;
            }
        }
    }
    if(numR!==numL){        //左括号多余
        output(sentence + '\n括号不匹配');
        return
    }
    output('No problem');
}
function RightArrow(p, q) {
    // → 的映射函数
    var result = [1, 0, 1, 1];
    var tmp = '' + p + q;
    return result[parseInt(tmp, 2)]
}
function DoubleArrow(p, q) {
    // ↔ 的映射函数
    var result = [1, 0, 0, 1];
    var tmp = '' + p + q;
    return result[parseInt(tmp, 2)]
}
function XOR(p, q ) {
    // 异或函数
    var result = [0, 1, 1, 0];
    var tmp = '' + p + q;
    return result[parseInt(tmp, 2)]
}
function creatFunc() {
    var b = [];
    var a1 = 2, s='0110';
    b[0]= function () {
        var num = a1;
        var result = [];
        var str = '';
        for(var i=0; i<s.length; i++){
            result.push(s[i]-'0');
        }
        for(var i=0; i<num; i++){
            str += arguments[i];
        }
        console.log(result[parseInt(str, 2)]);
    }
    b[0](1, 1);
}
function checkFunc() {
    //定义函数
    var map_func = [];
    var func = [];
    var sentence = '#f 2 01101';
    var tmp_stack = sentence.slice(1, sentence.length).split(' ');
    for(var i=0; i<tmp_stack.length; i+=3){
        if(tmp_stack[i] === '%'){
            break;
        }else{
            var num_arg = tmp_stack[i+1] - '0';     // 2
            var value_func = tmp_stack[i+2];              // '0110'
            if(checkname(tmp_stack[i])){
                output(sentence + '\n' + tmp_stack[i] + '命名错误');
                return;
            }
            if(i+2>=tmp_stack.length){
                output(sentence + '\n' + tmp_stack[i] + '定义说明不全');
                return;
            }
            if(value_func.length !== 2**num_arg){
                output(sentence + '\n' + '函数值数目不正确');
                return;
            }
            for(var j=0; j<value_func.length; j++){
                if(value_func[j]!=='0' && value_func[j]!=='1'){
                    output(sentence + '\n' + '函数值仅为0或1');
                    return;
                }
            }
            if(tmp_stack[i] in map_func){
                output(sentence + '\n' + '函数重复定义');
                return;
            }
            // 参数无误，定义函数
            map_func[tmp_stack[i]] = NumOfFunc++;     // i: 'f', i+1: '2', i+2: '0110'
            func[NumOfFunc-1] = function () {
                //使用参数、值定义逻辑连接词
                //num: 参数数量， result: 保存值的数组， str：参数相连组成的二进制字符串
                var num = num_arg;
                var result = [];
                var str = '';
                for(var i=0; i<s.length; i++){
                    result.push(value_func[i]-'0');
                }
                for(var i=0; i<num; i++){
                    str += arguments[i];
                }
                return result[parseInt(str, 2)];    // 把二进制字符串转换为数字，映射为函数值
            }
        }
    }
}

function delShuZu() {
    var a = '#  f  2 00d f fd ';
    var b = a.split(' ');
    console.log(b);
    for(var i = b.length-1; i>=0; i--){
        if(b[i]===' ' || b[i]===''){
            b.splice(i, 1);
        }
    }
    console.log(b);
}
function nestFunc() {
    f1();
    for(var i =0; i<5; i++){
        if(i%2 == 0){
            function f1() {
                output( 'i%2==0');
            }
            f1();
        }else {
            f1();
            function f2() {
                output(i + 'i%2!=0');
            }
            f2();
        }
        output('out: ');
        f1();
    }
    output('over');
    f1();
}

function findBackInMain(index) {
    //替换 →,⊕,↔ 时，后向查找运算符前的元素的位置。 返回的是该插入元素的位置
    var result = index+1;
    if(main_stack[result]==='(' || main_stack[result+1]==='('){     //如果运算符后面是 括号 或者 函数
        var numL = 0, numR = 0;
        for(var i = result; i<=main_stack.length; i++){
            if(main_stack[i]==='('){
                numL++;
            }
            if(main_stack[i]===')'){
                numR++;
            }
            if(numL===numR){
                result = i;
                break;
            }
        }
    }
    return result+1;       //插入位置在后向元素后面
}

//遍历各种可能性
function toBinStr(num, src) {
    // 把数字src转换为长度为num的二进制字符串
    var str = src.toString(2);
    var tmp = num - str.length;
    for(var i = 0; i<tmp; i++){
        str = '0'+str;
    }
    return str;
}

console.log(toBinStr(10, 9))