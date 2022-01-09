# Diff算法实现

[引用](https://mp.weixin.qq.com/s/PHvmhzuimOlpw1SWeSyHuw)

# 虚拟Dom

真实dom

```
<ul class="list">
    <li>a</li>
    <li>b</li>
    <li>c</li>
</ul>
```

虚拟dom

```
let vnode = h('ul.list', [
  h('li','a'),
  h('li','b'),
  h('li','c'),
])

console.log(vnode)
```

控制台输出的虚拟dom

![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/H8M5QJDxMHrBPOs1OFIWuxw354WxNWGLfDQbT3YnicB8GCBnDpF4K3uCL9yt7F05tKuwS1kxMIrAkLcCic7zK2Dw/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

> vue中利用h函数生成虚拟dom

## 为什么使用虚拟dom

- MVVM框架解决视图和状态同步问题
- 模板引擎可以简化视图操作,没办法跟踪状态，虚拟DOM跟踪状态变化
- 跨平台使用
  - 浏览器平台渲染DOM
  - 服务端渲染SSR(Nuxt.js/Next.js),前端是vue向,后者是react向
  - 原生应用(Weex/React Native)
  - 小程序(mpvue/uni-app)等
- 真实DOM的属性很多，创建DOM节点开销很大，虚拟DOM只是普通JavaScript对象，描述属性并不需要很多，创建开销很小
- 复杂视图情况下提升渲染性能(操作dom性能消耗大,减少操作dom的范围可以提升性能)

## 虚拟dom不一定带来性能提升

当dom树相对简单时，例如只有单节点情况，此时虚拟dom反而加重了性能消耗

```
// 不使用虚拟dom，直接创建新的dom_b即可 
dom_a -> dom_b
// 使用虚拟dom，需要先创建虚拟dom，然后diff，再创建dom_b
dom_a -> 创建虚拟dom，diff发现区别 -> dom_b
```

当虚拟dom复杂时，此时虚拟dom就意义较大

```
// 不使用虚拟dom，需要把整个真实dom重新渲染 
dom_a -> dom_b
// 使用虚拟dom，需要先创建虚拟dom，然后diff，找出最小的需要更新的节点，触发节点dom更新
dom_a -> 创建虚拟dom，diff发现区别 -> dom_b
```

> 虚拟dom库：Snabbdom (https://github.com/snabbdom/snabbdom)
> vue2.x版本修改的虚拟dom库，最快的虚拟dom库之一
> 体积小，可拓展，ts开发

## Diff算法

Diff 的对象是虚拟DOM（virtual dom），更新真实 DOM 是 Diff 算法的结果。

### snabbdom的核心

- init()设置模块.创建patch()函数
- 使用h()函数创建JavaScript对象(Vnode)描述真实DOM
- patch()比较新旧两个Vnode
- 把变化的内容更新到真实DOM树

#### init

init函数时设置模块,然后创建patch()函数

```
import {init} from 'snabbdom/build/package/init.js'
import {h} from 'snabbdom/build/package/h.js'

// 1.导入模块
import {styleModule} from "snabbdom/build/package/modules/style";
import {eventListenersModule} from "snabbdom/build/package/modules/eventListeners";

// 2.注册模块
const patch = init([
  styleModule,
  eventListenersModule
])

// 3.使用h()函数的第二个参数传入模块中使用的数据(对象)
let vnode = h('div', [
  h('h1', {style: {backgroundColor: 'red'}}, 'Hello world'),
  h('p', {on: {click: eventHandler}}, 'Hello P')
])

function eventHandler() {
  alert('疼,别摸我')
}

const app = document.querySelector('#app')

patch(app,vnode)
```

- 当init使用了导入的模块就能够在h函数中用这些模块提供的api去创建虚拟DOM(Vnode)对象;
- 在上文中就使用了样式模块以及事件模块让创建的这个虚拟DOM具备***样式属性***以及***事件属性***，最终通过patch函数对比两个虚拟dom(会先把app转换成虚拟dom)，更新视图；

init源码部分
```
// src/package/init.ts
/* 第一参数就是各个模块
   第二参数就是DOMAPI,可以把DOM转换成别的平台的API,
也就是说支持跨平台使用,当不传的时候默认是htmlDOMApi,见下文
   init是一个高阶函数,一个函数返回另外一个函数,可以缓存modules,与domApi两个参数,那么以后直接只传oldValue跟newValue(vnode)就可以了*/
    export function init (modules: Array<Partial<Module>>, domApi?: DOMAPI) {

    ...

    return function patch (oldVnode: VNode | Element, vnode: VNode): VNode {}
}
```
#### h函数
h函数根据入参的不同，生成一个vnode函数,然后vnode函数再生成一个Vnode对象(虚拟DOM对象)
```
// h函数
export function h (sel: string): VNode
export function h (sel: string, data: VNodeData | null): VNode
export function h (sel: string, children: VNodeChildren): VNode
export function h (sel: string, data: VNodeData | null, children: VNodeChildren): VNode
export function h (sel: any, b?: any, c?: any): VNode {
  var data: VNodeData = {}
  var children: any
  var text: any
  var i: number
    ...
  return vnode(sel, data, children, text, undefined) //最终返回一个vnode函数
};
```
```
export function vnode (sel: string | undefined,
  data: any | undefined,
  children: Array<VNode | string> | undefined,
  text: string | undefined,
  elm: Element | Text | undefined): VNode {
  const key = data === undefined ? undefined : data.key
  return { sel, data, children, text, elm, key } //最终生成Vnode对象
}
```
> h函数中，涉及到了函数的重载（根据入参个数与类型的不同，会执行不一样的返回）js中没有重载，ts中底层依靠代码调整实现重载

#### patch函数（重点）
- pactch(oldVnode,newVnode)
- 把新节点中变化的内容渲染到真实DOM,最后返回新节点作下一次处理的旧节点(核心)
- 对比新旧VNode是否相同节点(节点的key和sel相同)
  - 如果不是相同节点,删除之前的内容,重新渲染
  - 如果是相同节点,再判断新的VNode是否有text,如果有并且和oldVnode的text不同直接更新文本内容(patchVnode)
- 如果新的VNode有children,判断子节点是否有变化(updateChildren,最麻烦,最难实现)

源码
```
return function patch(oldVnode: VNode | Element, vnode: VNode): VNode {    
    let i: number, elm: Node, parent: Node
    const insertedVnodeQueue: VNodeQueue = []
    // cbs.pre就是所有模块的pre钩子函数集合
    for (i = 0; i < cbs.pre.length; ++i) cbs.pre[i]()
    // isVnode函数时判断oldVnode是否是一个虚拟DOM对象
    if (!isVnode(oldVnode)) {
        // 若不是即把Element转换成一个虚拟DOM对象
        oldVnode = emptyNodeAt(oldVnode)
    }
    // sameVnode函数用于判断两个虚拟DOM是否是相同的,源码见补充1;
    if (sameVnode(oldVnode, vnode)) {
        // 相同则运行patchVnode对比两个节点,关于patchVnode后面会重点说明(核心)
        patchVnode(oldVnode, vnode, insertedVnodeQueue)
    } else {
        elm = oldVnode.elm! // !是ts的一种写法代码oldVnode.elm肯定有值
        // parentNode就是获取父元素
        parent = api.parentNode(elm) as Node

        // createElm是用于创建一个dom元素插入到vnode中(新的虚拟DOM)
        createElm(vnode, insertedVnodeQueue)

        if (parent !== null) {
            // 把dom元素插入到父元素中,并且把旧的dom删除
            api.insertBefore(parent, vnode.elm!, api.nextSibling(elm))// 把新创建的元素放在旧的dom后面
            removeVnodes(parent, [oldVnode], 0, 0)
        }
    }

    for (i = 0; i < insertedVnodeQueue.length; ++i) {
        insertedVnodeQueue[i].data!.hook!.insert!(insertedVnodeQueue[i])
    }
    for (i = 0; i < cbs.post.length; ++i) cbs.post[i]()
    return vnode
}
```
> sameNode函数
```
function sameVnode(vnode1: VNode, vnode2: VNode): boolean { 通过key和sel选择器判断是否是相同节点
    return vnode1.key === vnode2.key && vnode1.sel === vnode2.sel
}
```
> patchNode函数
- 一阶段触发prepatch函数以及update函数(都会触发prepatch函数,两者不完全相同才会触发update函数)
- 第二阶段,真正对比新旧vnode差异的地方
- 第三阶段,触发postpatch函数更新节点
```
function patchVnode(oldVnode: VNode, vnode: VNode, insertedVnodeQueue: VNodeQueue) {
    const hook = vnode.data?.hook
    hook?.prepatch?.(oldVnode, vnode)
    const elm = vnode.elm = oldVnode.elm!
    const oldCh = oldVnode.children as VNode[]
    const ch = vnode.children as VNode[]
    if (oldVnode === vnode) return
    if (vnode.data !== undefined) {
        for (let i = 0; i < cbs.update.length; ++i) cbs.update[i](oldVnode, vnode)
        vnode.data.hook?.update?.(oldVnode, vnode)
    }
    if (isUndef(vnode.text)) { // 新节点的text属性是undefined
        if (isDef(oldCh) && isDef(ch)) { // 当新旧节点都存在子节点
            if (oldCh !== ch) updateChildren(elm, oldCh, ch, insertedVnodeQueue) //并且他们的子节点不相同执行updateChildren函数,后续会重点说明(核心)
        } else if (isDef(ch)) { // 只有新节点有子节点
            // 当旧节点有text属性就会把''赋予给真实dom的text属性
            if (isDef(oldVnode.text)) api.setTextContent(elm, '') 
            // 并且把新节点的所有子节点插入到真实dom中
            addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue)
        } else if (isDef(oldCh)) { // 清除真实dom的所有子节点
            removeVnodes(elm, oldCh, 0, oldCh.length - 1)
        } else if (isDef(oldVnode.text)) { // 把''赋予给真实dom的text属性
            api.setTextContent(elm, '')
        }
    } else if (oldVnode.text !== vnode.text) { //若旧节点的text与新节点的text不相同
        if (isDef(oldCh)) { // 若旧节点有子节点,就把所有的子节点删除
            removeVnodes(elm, oldCh, 0, oldCh.length - 1)
        }
        api.setTextContent(elm, vnode.text!) // 把新节点的text赋予给真实dom
    }
    hook?.postpatch?.(oldVnode, vnode) // 更新视图
}
```
![分析导图](https://mmbiz.qpic.cn/sz_mmbiz_png/H8M5QJDxMHrBPOs1OFIWuxw354WxNWGLHNVic3kCtibTYFxoJKuJxNsibX6CrbylKsKXUUoWAwAXfyxSCapNOJJUw/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

> 传统的diff算法

会运行n1(dom1的节点数)*n2(dom2的节点数)次方去对比,找到差异的部分再去更新
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/H8M5QJDxMHrBPOs1OFIWuxw354WxNWGLskFaGFxm1An1LMPCcD7CeVLs3tyrVjzibiaDoLBrP38qQk78NewUP40Q/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

> snabbdom的diff算法优化

DOM操作时候很少会跨级别操作节点，只比较同级别的节点

![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/H8M5QJDxMHrBPOs1OFIWuxw354WxNWGLhTt5D51vDv7tKQJxPMIoJBiaZVnGVEyulmeDO6XoaOgg0wcAcfib0huw/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

> updateChildren(核中核:判断子节点的差异)


