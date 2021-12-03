# **函数调用中的this**

###### 原文链接：[英文](https://rainsoft.io/gentle-explanation-of-this-in-javascript/) [中文](http://zcfy.cc/article/gentle-explanation-of-this-keyword-in-javascript-901.html)

## **一.概述**

##### 1. 在JS中， this是当前执行函数的上下文，js拥有四种不同的函数调用方式：

> - 函数调用
> - 方法调用
> - 构造函数调用
> - 隐式调用

##### 2.每种方法都定义了自己上下文，同时strict模式表现也会有所不同。

##### 3.术语介绍

> - 函数调用中的上下文是指this在函数中的值
> - 函数调用是指 eg:parseInt('12')，这是parseInt的函数调用
> - 作用域是函数内可用的变量，对象以及函数的集合

## **二.函数调用**

##### 1.函数调用定义

以一个函数开头后面跟()的表达式，是函数调用

```
var a = {
    vince: function(){
        console.log('132')
    }
}

function vincewu(){
    console.log('123')
}

vincewu();              //函数调用
parseInt('213');        //函数调用
a.vince();              //方法调用
['12','12'].join(',');  //方法调用
```

注意IIFE（立即调用函数），也是函数调用

```
var message = (function vince(){
    console.log(this === window)    //true
})();
massage;
```

##### 2.函数调用中的this

```
this在函数调用中，是一个全局对象
```

函数调用中的上下文是全局对象，而全局对象由执行环境决定，在浏览器中全局对象是window对象

```
function vince(){
    console.log(this === window)    //true
    this.number = 10;
}

vince();
console.log(window.number);  //10
```

当处于所有函数作用域以外时（最上层作用域），this也指向全局对象

```
console.log(this === window);   //true
```

##### 3.strict模式下的函数调用的this

- strict模式下，函数调用的this是undefined
- strict模式下，会影响内部作用域起作用
- 不同js脚本中，strict模式和非strict模式下，上下文不一样

```
function strict_mod(){
    'use strict'
    console.log(this === undefined);    //true
  
    function se_strict_mod(){
  
        console.log(this === undefined)     //true
    }
    se_strict_mod();
}

function non_strict(){

    console.log(this === window)        //true
}

strict_mod();
non_strict();
```

##### 4.陷阱

- 内部函数中的this与外部函数中的this不一样
- 记住函数调用的this永远是全局对象

```
var vince = {

    a : 1,
    b : 2,
    sum : function(){
      
        (function helloVince() {
        console.log(this.a + this.b);
        })();   //NaN
  
        return this.a + this.b; //3
    }
}
vince.sum();//由于内部函数helloVince上下文this指向全局函数，因此报错

```

```
var vince = {

    a : 1,
    b : 2,
    sum : function(){
      
        console.log(this.a + this.b);
      
        function helloVince() {
            console.log(this.a + this.b);
        };   //NaN
  
        return helloVince.call(this); //3  使用call把内部函数this指向vince
    }
}
vince.sum();
helloVince();

```

## **三.方法调用**

- 当表达式以属性的形式执行时，是方法调用

```
({ten : function(){ return 10; }}).ten();//方法调用
[1,1,1].join(','); //方法调用

var ten = function(){
    return 10;
}
ten();//函数调用

parseInt('16.9649')//函数调用
```

##### 1.方法调用中的this

- 方法调用中，this指向对象本身

```
var vince = {
  
    helloVince: function(){
  
        console.log(this === vince); //true
        console.log('hello vince')
    }

}
vince.helloVince();

```

##### 2.方法调用中的陷阱（不要从对象中分离方法）

```
var vince = {
    a: 1,
    b:3,
    sum : function(){
        console.log(this.a + this.b)
    }
}

vince.sum();//4
var errorFunction = vince.sum;//错误做法
errorFunction();//他的上下文是全局对象

//要分离方法，需要把原对象的上下文绑定进去
var correctFunction = errorFunction.bind(vince);
correctFunction();//4

```

## **四.构造函数调用**

- 当new标识符紧跟着一个函数对象时被调用，即构造函数调用

```
function judgeFruit(name, isfruit){
    this.name = name ? name : 'apple';
    this.isfruit = isfruit ? isfruit : false;
};
judgeFruit.prototype.judge = function(){

    this.isfruit = true;
}

var pear = new judgeFruit('pear', true);
var pineapple = new judgeFruit();
pineapple.judge();

var vegetable = new judgeFruit('vegetable');
```

##### 1.构造函数中的this

- 构造函数中的this指向新对象

```
function originObject(){
    console.log(this instanceof originObject);
}

var newObject = new originObject();

```

##### 2.陷阱 （忽略new）

```
function Vehicle(type, wheelsCount) {
  this.type = type;
  this.wheelsCount = wheelsCount;
  return this;
}
// Function invocation
var car = Vehicle('Car', 4);
car.type;       // => 'Car'
car.wheelsCount // => 4
car === window  // => true

```

上面看似没问题的新建了car对象，实际上从最后一句code可以看出，实际上忽略new，只是为全局对象window添加属性，并没有成功新建一个对象。

## **五.隐式调用中的this**

- 使用.call() .apply()调用函数
- .call 和 .apply()的区别只有入参第二个参数格式，第一个参数就是this

```
var rabbit = {name : 'rabbit'};
var lion = {name : 'lion'};

var callName = function(num){
    console.log(this.name);
    console.log(num)
}

callName.call(rabbit, 100);//call的第二个参数是","分割的散点
callName.apply(lion, [100]);//apply的第二个参数是数组

```

## **六.绑定函数**

- 绑定函数是与对象绑定的函数
- 通常使用.bind()创建
- .bind()返回的是新的函数，只是this已经提前被设置
- .bind()第一个入参是执行的上下文，第二个参数是生成函数的入参
- .bind()生成的函数上下文不能被.call() .apply() 或者重新绑定改变，只能通过绑定函数的构造函数调用方法改变（不推荐，因为构造函数调用用的是常规函数而不是绑定函数）

```
var sayName = function(name){
    console.log(this + " " + name)
}

var vince = sayName.bind('hello');//vince这个绑定函数的this已经设置成'hello'
vince('vince');//hello vince

var lily = sayName.bind('hello', 'lily');//lily的name默认是lily
lily();//hello lily
lily('hhhh');//hello lily 无法更改name
```

```
var num = function(){console.log(this) }
var one = num.bind(1);
one();// 1
one.call(20);// 1
one.apply(30);// 1
one.bind(100)();// 1

new one();//Objecet .bind()生成的函数上下文不能被.call() .apply() 或者重新绑定改变，只能通过绑定函数的构造函数调用方法改变（不推荐，

```

## **七.箭头函数**

看起来太不优雅了，实用性不强，就不总结了，详情可以点开原链接。
