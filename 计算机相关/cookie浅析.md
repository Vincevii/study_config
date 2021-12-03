# 记录cookie

由于在weex开发中发现，在安卓环境下，我们在CGI层设置的COOKIE，发现安卓并没有把我们设置的cookie往下带。然后在跟安卓沟通的时候，发现对于cookie的定义大家都十分模糊，因此借此机会认真的查了下cookie相关资料，并且记录下来。我们先从H5浏览器入手了解。

# 我们看到的cookie

我们以乐疯抢为例，打开控制器看看我们记录了什么

![image](http://cimg1.fenqile.com/ibanner/M00/01/94/wicJAFlxoq6ANW-eAAEZPAeMcRE936.png)

从这里看到，乐疯抢hui.m.fenqile.com这个域底下我们有这么多个不同的cookie，我们重点关注我们种下的 ***ei*** 这个cookie，我们设置了他的domain为 ***.feniql.com***，path为 ***/***,有效期是 ***session***,这个四个属性我们下面会详细解释。

然后看此页面的随意一个请求的请求头：

![image](http://cimg1.fenqile.com/ibanner/M00/01/95/wycJAFlxpBeAcHRnAACO6-TAgsU167.png)

我们发现，在我们刚才的 ***ei***在请求头中也被带上了，这个请求最终会发送到我们的服务器上面去，而服务器就能从接受到的request header中获取到 ***ei***

上面两张图，我们展示了cookie基本的通信流程：设置cookie -> cookie被带进请求头 -> 服务器端接受到cookie。接下来，我们可以思考以下几个问题：

1. 什么数据适合放在 cookie
2. 如何设置 cookie，在哪里设置 cookie
3. cookie 如何自动添加到 request header里面
4. cookie 如何增删查改

我们需要带着这几个问题往下阅读。

# cookie是怎么工作的

*document.cookie*
---------------

在js中我们可以直接调用document.cookie得到一个字符串，获取当前浏览器的cookie，形式是以键值对存在的：

![image](http://cimg1.fenqile.com/ibanner/M00/01/AD/wScJAFlxtN-AWW2WAABFcqnyf5E789.png)

这时候我们发现我们的 ***ei***为啥不见了，具体原因请跳转httponly属性见分晓。

*cookie属性*
----------

每个cookie都有一定的属性，如什么时候失效，要发送到哪个域名，哪个路径等等。这些属性是通过cookie选项来设置的，cookie选项包括：expires、domain、path、secure、HttpOnly。在设置任一个cookie时都可以设置相关的这些属性，当然也可以不设置，这时会使用这些属性的默认值。在设置这些属性时，属性之间由一个分号和一个空格隔开。代码示例如下：

> "key=name; expires=Thu, 30 Feb 2018 04:18:00 GMT; domain=.fenqile.com; path=/; secure; HttpOnly"

expires
-------

***expires*** 选项用来设置“cookie 什么时间内有效”。***expires*** 其实是cookie失效日期，***expires*** 必须是 GMT 格式的时间（可以通过 new Date().toGMTString()或者 new Date().toUTCString() 来获得）。

如expires=Thu, 25 Feb 2016 04:18:00 GMT表示cookie讲在2016年2月25日4:18分之后失效，对于失效的cookie浏览器会清空。如果没有设置该选项，则默认有效期为session，即会话cookie。这种cookie在浏览器关闭后就没有了。

domain和path
------------

***domain*** 是域名，***path***是路径，两者加起来组成了 URL ，一起来限制 cookie 能被哪些 URL 访问。

假如，我们把cookie 的***domain*** 设置成为了 fenqile.com, ***path*** 设置成了'/'，若请求的 URL （不包括 XML 请求），域名为 fenqile.com或其子域名（hui.m.fenqile.com , m.fenqile.com 等），且路径为"/"或其子路径（/main/index.html ; /category 等），则浏览器就会自动把符合上述条件的cookie带到请求头上面。

> 特别说明：
>
> 1. 发生跨域xhr请求时，即使请求URL的域名和路径都满足 cookie 的 domain 和 path，默认情况下cookie也不会自动被添加到请求头部中。具体原因请看下文。

secure
------

***secure*** 选项用来设置cookie只在确保安全的请求中才会发送。当请求是HTTPS或者其他安全协议时，包含 secure 选项的 cookie 才能被发送至服务器。

默认情况下，cookie不会带***secure*** 选项(即为空)。所以默认情况下，不管是HTTPS协议还是HTTP协议的请求，cookie 都会被发送至服务端。但要注意一点，***secure*** 选项只是限定了在安全情况下才可以传输给服务端，但并不代表你不能看到这个 cookie。

下面我们设置一个 secure类型的 cookie：

document.cookie = "name=huang; secure";
之后你就能在控制台中看到这个 cookie 了。

如下图所示：

```
document.cookie = "vince=666; secure";
```

这时我们在控制台就能看到我们设置的cookie：

![image](http://cimg1.fenqile.com/ibanner/M00/01/95/wicJAFlxwuWAQdr2AABj-gIdVcc212.png)

> 这里有个坑需要注意下：
> 如果想在客户端即网页中通过 js 去设置secure类型的 cookie，必须保证网页是https协议的。在http协议的网页中是无法设置secure类型cookie的。

httpOnly
--------

这个选项用来设置cookie是否能通过 js 去访问。默认情况下，cookie不会带httpOnly选项(即为空)，所以默认情况下，客户端是可以通过js代码去访问（包括读取、修改、删除等）这个cookie的。当cookie带httpOnly选项时，客户端则无法通过js代码去访问（包括读取、修改、删除等）这个cookie。

在客户端是不能通过js代码去设置一个httpOnly类型的cookie的，这种类型的cookie只能通过服务端来设置。

这时我们可以看回我们 ***ei*** 的图：
![image](http://cimg1.fenqile.com/ibanner/M00/01/94/wicJAFlxoq6ANW-eAAEZPAeMcRE936.png)

我们发现在http属性那里，有一个√，因此我们在js里面获取不到此cookie。

这个属性是为了安全性存在的，因为有可能网站会被xss攻击，插入一段获取当前用户所有cookie的js，并且发送到攻击者的服务器，这样攻击者就有可能获取被攻击者的所有登录态信息等。

# 如何设置cookie

知道了cookie的格式，cookie的属性选项，接下来我们就可以设置cookie了。首先得明确一点：cookie既可以由服务端来设置，也可以由客户端来设置。

*服务器端设置cookie*
------------------

不管你是请求一个资源文件（如 html/js/css/图片），还是发送一个ajax请求，服务端都会返回response。而response header中有一项叫set-cookie，是服务端专门用来设置cookie的。如下图所示，服务端返回的response header中有5个set-cookie字段，每个字段对应一个cookie（注意不能将多个cookie放在一个set-cookie字段中），set-cookie字段的值就是普通的字符串，每个cookie还设置了相关属性选项。

我们weex的乐疯抢中，由于weex内部并不能设置cookie，因此我们选择了在服务器端设置cookie，下图就是我们设置 ***ei*** 成功后的response信息:

![image](http://cimg1.fenqile.com/ibanner/M00/01/96/wicJAFlxxeKAGMZSAABA8Fz2fRs404.png)

> 注意：
>
> 一个set-Cookie字段只能设置一个cookie，当你要想设置多个 >cookie，需要添加同样多的set-Cookie字段。
> 服务端可以设置cookie 的所有选项：expires、domain、path、secure、HttpOnly

*客户端设置cookie（H5）*
----------------------

上文已经展示过新增cookie的写法了，而且我们也有自己设置cookie组件，H5端的设置我就不多赘述了。

需要注意的一点是，在客户端中设置的cookie，是无法设置HttpOnly属性的。

# 如何修改、删除

*修改 cookie*
-----------

要想修改一个cookie，只需要重新赋值就行，旧的值会被新的值覆盖。但要注意一点，在设置新cookie时，path/domain这几个选项一定要旧cookie 保持一样。否则不会修改旧值，而是添加了一个新的 cookie。

*删除 cookie*
-----------

删除一个cookie 也挺简单，也是重新赋值，只要将这个新cookie的expires 选项设置为一个过去的时间点就行了。但同样要注意，path/domain/这几个选项一定要旧cookie 保持一样。

# 跨域请求中 cookie

之前在介绍 XHR 的一篇文章里面提过：默认情况下，在发生跨域时，cookie 作为一种 credential 信息是不会被传送到服务端的。必须要进行额外设置才可以。

可以参考一下外部文章[你真的会使用XMLHttpRequest吗？：](https://segmentfault.com/a/1190000004322487#articleHeader13)

# 其他补充

1. 什么时候 cookie 会被覆盖： name/domain/path 这3个字段都相同的时候；
2. 关于domain的补充说明（参考1/参考2）：

   1. 如果显式设置了 domain，则设置成什么，浏览器就存成什么；但如果没有显式设置，则浏览器会自动取 url 的 host 作为 domain 值；
   2. 新的规范中，显式设置 domain 时，如果 value 最前面带点，则浏览器处理时会将这个点去掉，所以最后浏览器存的就是没有点的（注意：但目前大多数浏览器并未全部这么实现）
   3. 前面带点‘.’和不带点‘.’有啥区别：
      带点：任何 subdomain 都可以访问，包括父 domain
      不带点：只有完全一样的域名才能访问，subdomain 不能（但在 IE 下比较特殊，它支持 subdomain 访问）
