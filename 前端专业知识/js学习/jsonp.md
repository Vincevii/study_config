jsonp是干嘛的：由于浏览器的同源策略这个机制，不同源之间是不能请求的Json的，什么叫不同源？域名不同呗。那么这个时候jsonp就是用来跨域请求json的。

jsonp原理：那么既然存在同源策略这个机制，那么是不是不能请求别的页面的json呢？当然不是啦，jsonp完美解决了这个问题。由于script属性的src是可以请求到别的源的资源的，利用这一点可以间接获取到别的源的json数据，但是请求回来的是js，而不是json，所以格式是有所不同的。

怎么用呢：$("#getJsonpByJquery").click(function () {

```
$.ajax({

    url: 'http://localhost:2701/home/somejsonp',

    dataType: "jsonp",

    jsonp: "callback",

    success: function (data) {

        console.log(data)

    }

   })

           })
```

上面是jq的方法,注意的是为什么格式是不同呢，是因为script加载后，会立刻马上把相应当js去执行的，所以如果是正常的json格式就会报错，只能通过带callback函数来规避这个问题

例如：

![]()![]()
