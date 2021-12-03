# 第一章 面向对象的js
## 1.1 动态类型语言和鸭子类型
编程语言可以分为：动态类型和静态类型

静态类型：

优点：
1. 在编译的时候就能发现类型不匹配的错误
2. 程序中明确规定了数据类型，编译器可以针对这些信息对程序优化，提高运行速度

缺点：
1. 迫使程序员依照强契约编写代码，为每个变量规定数据类型
2. 类型声明，会增加更多代码，让程序员从代码逻辑思考分散出来

动态类型：

优点：
1. 编写代码更少，更简洁

缺点：

1. 无法保证变量类型
2. 必须到运行时才能发现与类型相关的报错

js是动态类型语言，无需进行类型检测，我们可以尝试调用任何对象的任意方法，无需考虑他原本是否拥有这个方法，这建立在鸭子类型的基础上。

鸭子类型：如果他走起来像鸭子，能像鸭子一样叫那么他就是鸭子。我们只关注对象的行为，只关注HAS-A,而不是IS-A

动态类型语言中，利用鸭子类型概念，能轻松实现一个原则：“面向接口编程，而不是面向实现编程”。例如一个对象拥有push和pop方法，就可以当作一个栈；一个对象有length属性就可以当作数组使用。而在静态语言中，要实现“面向接口编程”，需要通过抽象类或者接口等，将对象向上转型。==只有当对象能被互相替换使用的时候，才能体现对象多态的价值==。

## 1.2 多态
定义：同一操作，作用在同一对象上，可以产生不同的解释和不同的执行结果。换句话说，给不同对象发送同一个消息，这些对象会根据这个消息分别给出不同反馈。

 ### 1.2.1 1.2.2
```
有两只动物，一只鸡一只鸭，主人发出“叫”的命令时，鸡发出gegege叫声，鸭发出gagaga叫声

var make sound = function(animal) {
    animal.sound()
}

var Duck = function(){}
Duck.prototype.sound = function(){console.log("gagaga")}

var Chicken = function(){}
Chicken.prototype.sound = function(){console.log("gegege")}

makeSound(new Duck())
makeSound(new Chicken())
```
 多态的思想在于将：“做什么”和“谁去做，以及怎么做”分离。把不变的部分隔离出来，把可变的部分封装起来，这给予我们扩展程序的能力，程序看起来是可生长的。也符合开放-封闭原则。
 
 ### 1.2.3 & 1.2.4
 当java要实现上面同样的逻辑时，我们定义了duck类，然后定义chicken类后，必须把duck类和chicken类==向上转型==，他们对象的类型都要隐藏在超类animal身后。这时，duck类和chicken类就可以替换使用，就能实现多态。
 
java还会通过继承来使对象表现出多态

### 1.2.5 js的多态
js的多态，它在编译的时候没有类型检查过程，变量的类型在运行期是可变的，因此js 的多态是与生俱来的。

### 1.2.6 多态在面向对象中作用
多态最根本的作用是通过==把过程化的条件分支语句，转化为对象的多态性，从而消除这些条件分支语句==

```
导演喊action
面对同一个消息
道具撒雪花
演员说台词
照明打灯光

只需要发一条消息，各个对象就知道自己做什么，而不是需要导演过程化一个一个通知
```
```
var renderMap = function(map) {
    if(map.show instansof Function) {
        map.show()
    }
}
var googleMap = {
    show: function(){}
}

var baiduMap = = {
    show: function(){}
}

renderMap(googleMap)
renderMap(baiduMap)
```
## 1.3 封装
封装目的是将信息隐藏，封装是指封装数据和封装实现。这里我们还讨论包括封装类型和封装变化。

### 1.3.1 封装数据
1. js没有关键字去实现数据的封装，没法提供不同的访问权限。在js里面我们通过作用域来实现。
1. es6中除了let外，一般我们通过函数来创建作用域
2. es6还可以通过symbol创建私有属性

```
var obj = (function(){
    var __name = '111'
    return {
        getName: function(){
            return __name
        }
    }
})()

obj.getName() // '111'
obj.__name // undefined
```
### 1.3.2 封装实现
1. 定义：封装还包含隐藏实现细节，使对象内部实现隐藏，使外部对象不关心它内部实现。
2. 作用：使对象之间的耦合变得松散，对象之间只通过API来通信

### 1.3.3 封装类型
1. 封装类型是静态语言的重要封装方式，但是js封装类型的能力

### 1.3.4 封装变化
==封装最重要的层面体现为封装变化==

1. “找到变化并进行封装”
2. 通过封装变化的方式，把系统中稳定不变的部分和容易变化的部分隔离开来

## 1.4 原型模式和基于原型继承的JS对象系统
- 在作者进行js面向对象系统设计时，使用了原型模式。
- 在以类为中心的面向对象编程语言中，对象总是需要从类里面创建出来，但是在原型模式中，类不是必需的。
- 原型模式不单是一种设计模式，也被称为一种泛编程模式

### 1.4.1 使用克隆的原型模式
- 原型模式与类模式对比：
    - 一般情况创建对象：找到一个类，然后通过类创建对象
    - 原型模式创建对象：不关心对象的类型，而是找到一个对象，然后通过克隆来创建一个一模一样的对象
- es5提供 Object.creat方法来进行对象的克隆


```
// clone 兼容处理
Object.creat = Object.create || function(obj) {
    let F = function() {}

    F.prototype = obj

    return new F()
}

let a = function() {
    this.color = 'blue'
    this.width = 44
}

let obj = new a()
a.color = 'red'
a.width = 55

var cloneObj = Object.create(obj)
```
结合笔记原型，原型链看看：http://note.youdao.com/noteshare?id=d3862934c33596ed81cbd3c40c3ca36e&sub=AFFD76E132F44E5599CEEBF2798D4A1B

### 1.4.2 克隆是创建对象的手段
- 原型模式的目的不是需要得到一个一模一样的对象，而是提供一种便捷的方式去创建某个类型的对象，克隆只是一种手段。
- js中，创建对象十分容易，不存在类型耦合问题。从设计模式角度讲，原型模式意义不是很大。但是js是基于原型模式去设计对象系统的。这里称为原型变成泛型比较合适。

### 1.4.4 原型变成泛型规则
- 所有数据都是对象
- 要得到一个对象，不是实例化类，而是找到一个对象作为原型，然后克隆他
- 对象会记住他的原型
- 如果一个对象无法响应某个请求，那么会把这个请求委托给他的原型

下面内容结合笔记原型，原型链看看：http://note.youdao.com/noteshare?id=d3862934c33596ed81cbd3c40c3ca36e&sub=AFFD76E132F44E5599CEEBF2798D4A1B

### 1.4.5 js中的原型继承
#### 所有数据都是对象
- js有两套类型机制：基本类型与对象类型
- 基本类型：undefined，string，boolean，object，function，number
- js绝大部分数据都是对象，都来源于一个根对象Object
- 可以通过getPrototypeOf 查看对象的原型

#### 要得到一个对象，不是实例化类，而是找到一个对象作为原型，然后克隆他
- js的函数可以当作普通的函数调用，也可以当作==函数构造器==来创建对象使用
- 显式调用new Object() 和 var a = {}，都会在Object.protoType上面克隆一个对象出来

#### 对象会记住它的原型
- 可以通过__proto__属性来指向它的构造器的原型对象

#### 如果一个对象无法响应某个请求，那么会把这个请求委托给他的原型

### 原型系统的未来
es6带来了class的新语法，但是底层还是通过原型机制来创建对象

# 第二章 this、call、apply
这章可以结合：http://note.youdao.com/noteshare?id=b2ba9e95c73a17623bb78c0922c38ece&sub=6C9EA8508DA44932B404C310BE1BD06C
## 2.1 this
js中this总是指向一个对象，具体指向是在运行时基于函数的执行环境动态绑定的

### 2.1.1 this的指向
this指向大致分为以下四种：
- 作为对象的方法调用
- 作为普通函数调用
- 构造器调用
- call或者apply调用

####  1. 作为对象的方法调用
此时this指向该对象

####  2. 作为普通函数调用
在普通函数中，this指向全局对象，window

```
window.name = '111'

var obj = {
    name: '222'
    getName: function() {
        return this.name
    }
}

let getName = obj.getName

getName();// 111 this指向window，因为此时为普通函数调用
obj.getName() // 222
```

####  3. 构造器调用
- 构造函数与普通函数表现基本一致
- 区别是当使用new去调用构造函数时，此时能生成一个对象
- 构造函数内的this，就指向这个对象了

```
let a = function() { 
    this.name = 111 
}

let b = new a();

b.name; // 111
```
#### 4. call或者apply调用
call和apply可以动态传入函数的this。具体例子可看上方链接

### 2.1.2 丢失的this
==当为普通函数调用，this会指向全局window==，此时可以使用call和apply修正

## 2.2 call和apply
### 2.2.1 call和apply的区别
1. apply接受两个参数，第一个参数指定了函数内部this对象的指向，第二个参数为一个带下标的集合（数组或类数组），apply把集合中的元素作为参数传递给被调用的函数


```
var func = function(a, b ,c){
    console.log(a + b + c)
}

func.apply(null, [1,2,3]);//6
```
2. call接受的参数不固定，第一个参数指定了函数内部this对象的指向，后面的参数每个参数会被依次传入
```
var func = function(a, b ,c){
    console.log(a + b + c)
}

func.call(null, 1,2,3);//6
```
3. 当我们传入的第一个参数为null时，此时this会指向默认的宿主对象，浏览器中就是window了

### 2.2.2 call和apply的用途
#### 1. 改变this的指向

```
document.getElementById('vince').onclick = function(){
    alert(this.id) // 此时为对象内指向vince这个节点
    let callback = function(){
        alert(this.id)
    }
    callback() ;// 此时为普通函数调用，this为window，所以为undefined
}

// 可以把this缓存为vince这个节点
// 也可以使用call

document.getElementById('vince').onclick = function(){
    alert(this.id) // 此时为对象内指向vince这个节点
    let callback = function(){
        alert(this.id)
    }
    callback.call(this) ;// 此this被修改为指向vince节点了
}
```
#### 2. bind
bind方法的作用是把this与对应参数传入，然后返回一个新的函数；bind是可以通过call和apply实现的：


```
Function.protoType.bind = function(context){
    var self = context; // 保存原函数
    return function() {
        return self.apply(context,arguments);// 执行新函数的时候，会把之前传入的context当作新函数体的this
    }
}

// 复杂实现可以
Function.prototype.bind = function(){
    var self = this;    // 保存原函数
	var	context = [].shift.call(arguments); // 保存需要绑定的this的上下文
	var	args = [].slice.call(arguments); // 剩余的参数转成数组

    return function() {
        return self.apply(context, [].concat.call(args, [].slice.call(arguments)))
        // 执行新的函数的时候会把之前传入的context当作新函数的this
        // 并且合并两次传入的参数
    }
}

var aa = {
    name: 111
}

var func = function (a,b){
	alert(this.name)    // 111
	alert([a,b]) // 1,3
}.bind(aa,1)

func(3)

```
上面的shift，slice，concat之所以要用call，是因为arguments是对象没有对应的数组方法



#### 3. 借用其他对象的方法
- 借用构造函数


```
var a = function(name) {
    this.name = name
}

var b = function() {
    a.apply(this, arguments);  // 这里类似于继承了a
}

b.prototype.getName = function() {
    return this.name
}

let bb = new b(111)
bb.getName() // 111

```


- arguments对象

arguments对象虽然有长度和下标，但是实际上不是对象，没有对应的对象方法。通过call和apply可以把arguments对象转换为数组使用，类似上方代码。


```
// 例如借用push
(function(){
    Array.prototype.push.call(arguments,3)
    console.log(arguments) // 123
})(1,2))

```

对于任意对象：本身可以存取属性且length属性可读写，可以使用类似的方法

# 第三章闭包和高阶函数
## 3.1 闭包
### 3.1.1 作用域
- 带上var为局部作用域，仅在函数内部生效，不带则为全局变量

### 3.1.2 变量的生命周期
- 全局变量的作用域是永久的，除非主动销毁
- 函数内部声明的变量，退出函数时，这些变量就会随着结束而销毁


```
var fun = function() {
    var a = 1
    
    return function() {
        a++
        alert(a)
    }
}

var f = fun();
f() // 2
f() // 3
f() // 4
```

- 此时a变量没有被销毁，是因为var f = fun()时，f返回了一个匿名函数的引用，可以访问到fun()被调用时产生的环境，局部变量a则是一直在这个环境里面。==由于局部变量所在的环境能被外界访问，那么局部变量就有了不被销毁的理由==。
- 这里产生了一个闭包结构，局部变量的生命被延续

### 闭包的作用
#### 封装变量
- 把一些不需要暴露到外部的全局变量，封装为“私有变量” // 缓存作用

```
// 没有使用闭包，使用全局变量缓存
let a = {}

var mult = function(){
    var args = Array.prototype.join.call(arguments, ',')
    
    if(a[args]) {
        return a[args]
    }
    
    var b = 1
    for(var i = 0, l = arguments.length; i < l; i++) {
        b = b*arguments[i]
    }
    
    return a[args] = b
}

```
```
使用闭包进行缓存
var mult = (function(){
    var a = {}
    return function(){
        var args = Array.prototype.join.call(arguments, ',')
        
        if(a[args]) {
        return a[args]
    }
    
    var b = 1
    for(var i = 0, l = arguments.length; i < l; i++) {
        b = b*arguments[i]
    }
    
    return a[args] = b
})()

```
#### 延续变量生命周期
用img标签进行数据上报时容易丢失，丢失原因是由于img为局部变量，当report函数调用结束后，img局部变量会被销毁，此时还没有发出http请求
```
var report = function(src) {
    var img = new Image()
    img.src = src
}
```
可以把img变量封闭起来解决
```
var report = (function(){
    var imgs = []
    return function(src){
        var img = new Image()
        imgs.push(img)
        img.src = src
    }
})()
```
### 3.1.4闭包和面向对象设计
- 过程与数据的结合，是形容面向对象中的“对象”使用的表达
- 对象以方法的形式包含过程
- 闭包在过程中以环境的形式包含了数据
- 通常面向对象思想能实现的功能，用闭包也一样能实现

### 3.1.5用闭包实现命令模式
- 命令模式意图：把请求封装为对象，从而分离请求的发起者和请求的接受者（执行者）之间的耦合关系。
- 在命令执行前，可以预先往命令对象植入命令的接受者


例子：略，见后文

### 3.1.6 闭包与内存管理
- 使用闭包是我们主动将一些变量封闭，因为后续需要使用，如果把这些变量放到全局作用域，内存消耗是一致的
- 如果需要回收这些变量，可以手动设置为null
- 重点：使用闭包的同时比较容易形成循环引用，如果闭包作用域链中保存了dom节点，很可能就造成内存泄漏
    - 浏览器中，是基于引用计数策略的垃圾回收机制，如果两个对象存在循环引用就无法回收，此时只需要设置为null则可以回收

## 3.2 高阶函数
高阶函数满足下列条件之一
- 函数可以作为参数传递
- 函数可以作为返回值输出

### 3.2.1 函数作为参数传递
常用的例子：
1. 回调函数
2. Array.prototype.sort

### 3.2.2 函数作为返回值输出
- 判断数据类型
```
var type = {}

for(var i =0,type; type = ['String', 'Array', 'Number'][i++];){
    (function(type){
        Type['is' + type] = function(obj){
            return Object.prototype.toString.call(obj) === '[Object ' + type + ']' ;
        }
    })(type)
}

Type.isArray([])

```
### 3.2.3 高阶函数实现AOP
- AOP（面向切面编程）
- 主要作用是把一些跟核心业务逻辑模块无关的功能抽离出来，这些与业务逻辑无关的的通常包括（日志统计，安全控制，异常处理）
- 抽离这些功能后，再以“动态织入”的方式参入业务逻辑中
- js中实现AOP是指把一个函数“动态织入”到另外一个函数中
```
Function.prototype.before = function(bFn) {
    var _self = this // 保存原函数的引用,此时this指向原函数fn
    
    return function() {
        bFn.apply(this, arguments) // 执行新函数，修正this
        return _self.apply(this, arguments) // 执行原函数
    }
}

Function.prototype.after = function(aFn) {
    var _self = this // 保存原函数的引用
    
    return function() {
       var ret = _self.apply(this, arguments) // 执行原函数
       aFn.apply(this, arguments)
       
       return ret
    }
}

var func = function(){
    console.log(2)
}

func = func.before(function(){
    console.log(1)
}).after(function(){
    console.log(3)
})

func()
```
上述也叫装饰者模式

### 3.2.4 高阶函数的其他应用
#### 1. currying 
- currying又称部分求值，先接受一些参数，先不进行计算，而是返回一个函数，刚才传入的参数保存在闭包中，等待真正需要求值时，再进行求值

```
var cost = (function() {
    var args = []
    
    return function(){
        if(arguments.length == 0) {
            var money = 0 
            
            for(var i = 1; i<args.length; i++) {
                money+=args[i]
            }
            return money
        }else{
            [].push.apply(args,arguments)
        }
    }
})()

cost(100)
cost(100)
cost(100) // 仅保存，未求值

cost() // 300 
```

#### 2. uncurrying
#### 3. 函数节流
#### 4. 分时函数
#### 5. 惰性加载函数
```
var addEvent = function(elem, type ,handler) {
    if(window.addEventListener) {
        addEvent = function(elem, type ,handler) {
            elem.addEventListener(type ,handler, false)
        }
    }else if(window.attachEvent) {
        addEvent = function(elem, type ,handler) {
            elem.attachEvent('on'+type,handler, false)
        }
    }
    
    addEvent(elem, type ,handler)
}

这样重写addEvent，可以减少if分支执行，并且等需要用到时再执行无需提前加载
```


# 4 单例模式
定义：一个类仅有一个实例，并提供一个访问他的全局节点
## 4.1 实现单例模式
- 重点：用一个变量标志当前是否已经为某个类创建过对象，如果是则下一次获取该类的时候，直接返回之前创建的对象

```

```









