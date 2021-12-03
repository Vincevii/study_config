# 引言

在2018年组内的架构升级上，大面积用到vue语法，在使用的时候大部分人包括我在内也只是知道vue是mvvm模式，是数据驱动视图变化的开发模式。这几天看到一篇文章后大受启发，在那篇文章的框架简单的探讨一下到底vue是怎么实现数据驱动。

来源文章：[https://www.zcfy.cc/article/the-best-explanation-of-javascript-reactivity](https://www.zcfy.cc/article/the-best-explanation-of-javascript-reactivity)

# 问题的开端

看到下面的vue实现，没接触过vue的人一定觉得很神奇vue的数据响应系统：

```
<div id="app">
    <div>单价: {{price}}</div>
    <div>数量: {{num}}</div>
    <div>总价: {{price * num}}</div>
    <div>折扣后金额: ${{totalPriceDiscount}}</div>
</div>
<script src="https://cdn.jsdelivr.net/npm/vue@2.5.21/dist/vue.js"></script>
<script>
    var vm = new Vue({
        el:"#app",
        data:{
            price: 5,
            num: 10
        },
        computed:{
            totalPriceDiscount() {
                return this.price * this.num * 0.8
            }
        }
    });
</script>
```

Vue知道，当价格发生变化的时候，它做了三件事：

1. 页面上单价变了；
2. 总价重新计算，并且更新页面；
3. 折扣后金额重新计算，并且页面；

这时候我们会迷惑，为什么vue会知道当价格发生变化的时候，vue会知道需要更新什么？它是怎么跟踪所有内容的呢？

# 我们以前是怎么做的？

```
let price = 5;
let num = 10;
let total = price * num;    //50

price = 20;
console.log('total:'total);

```

上面这个毫无意外打印的是:

```
 50 
```

而在Vue里面我们希望，每当价格或者数量更新的时候，总价总会更新。我们要的结果是：

```
200
```

很明显这段js代码并不能做到这种效果，这时我们需要加入更多的逻辑。

## 问题一：

我们需要保存计算公式，并且在数量或者价格有变化的时候重新运行。

## 解决方案：

首先我们要把要计算的公式保存起来，然后再在需要的时候（价格或数量更新的时候）再次运行它：

```
let price = 5;
let num = 10;
let total = 0;
let target = null;

target = () => { total = price * num }  //我们存储下来的计算公式

record();  //这个我们将会稍后定义
target();
```
