AMD 是 RequireJS 在推广过程中对模块定义的规范化产出。

CMD 是 SeaJS 在推广过程中对模块定义的规范化产出。

1. 对于依赖的模块，AMD 是提前执行，CMD 是延迟执行。不过 RequireJS 从 2.0 开始，也改成可以延迟执行（根据写法不同，处理方式不同）。CMD 推崇 as lazy as possible.
2. CMD 推崇依赖就近，AMD 推崇依赖前置
3. AMD 的 API 默认是一个当多个用，CMD 的 API 严格区分，推崇职责单一。

cmd:[https://github.com/seajs/seajs/issues/242](https://github.com/seajs/seajs/issues/242)

amd:[https://github.com/amdjs/amdjs-api/wiki/AMD](https://github.com/amdjs/amdjs-api/wiki/AMD)

资料：[https://zhuanlan.zhihu.com/p/27644026](https://zhuanlan.zhihu.com/p/27644026)

CommonJS模块规范

1. 模块定义 -- module exports
2. 模块引用 -- require
3. 模块标识

1.1 定义

1. CommonJs只有唯一出口为module.exports对象，把所有变量与方法都会放到这个对象中
2. module变量就是整个模块，module变量有个属性为exports，这个属性是exports变量引用的，最后导出的是module.exports而不是exports对象
3. 可以导出的写法：
   1. module.exports = {}
   2. exports.a = ‘’
4. 注意，如果直接给exports赋值对象，这时exports的内存指向就改变了，无法继续指向module.exports

1.2 引用

1. 直接require('路径')，即可完成引用，需要把这个引用赋值给一个变量承接：
   1. let a = require('./index.js')

1.3 模块标识

1. 模块标识，帮助系统在require时根据传入的参数找到对应模块的
2. 主要类型;
   1. 驼峰试的命名字符串 -- require('testMoudle') 从node_modules中寻找
   2. 以 . 或 ../ 开头的是相对路径
   3. 绝对路径引入

1.4 nodeJs的支持

1. node对CommonJS的实现分为以下三点：

   1. 路径分析
   2. 文件定位
   3. 模块编译
2. 路径分析：路径分析会分析requir时传入的参数，在node里面会有以下几种情况
3. node自带的核心模块
4. 直接跳过路径分析和文件定位
5. 绝对路径，相对路径
6. 直接能得出相对位置
7. node_modules中的模块
8. 会从引入的那一层文件开始往上查找
9. 文件定位：找到路径后，还需要确定文件类型，找到具体的文件定位
10. 找目录下的package.json，得到main字段
11. 如果main字段中的文件忽略了扩展，会依次补充js，node，json尝试
12. 弱不存在上面的情况，则默认加载这个目录下的index.js，index.node，index.json文件

ES6 Modules模块规范

2.1 定义

语言层面，声明式的代码集合

1. 直接抛出：
   1. export const a = 132
   2. export let b = () => {}
2. default抛出：
3. export default c = () => {}
4. export {  c as default  }

2.2 引用

1. 直接引入

   1. import { a,b,c} from 'xxxx'
   2. 也可以起别名：import { a as a1,b as b1,c as c1} from 'xxxx'
2. 全部引入
3. import { * as test } from 'xxx'
4. default引入
5. import default as test from 'xxx'
6. import test from 'xxx'

2.3 模块聚合

1. 当已有模块test1和test2，需要把两个模块聚合然后抛出：

export {a} from 'test1'

export * from 'test2'

2. 注意：
   1. 这样的方式，不会将数据添加到该聚合模块的作用域，无法在该模块中使用a
   2. 如果出现同名，则此时会冲突

ES6 Modules与commonJS对比

1. commonJS是运行时（动态），es6 Modules是编译时的（静态）
2. commonJS是值的拷贝，es6 Modules是值的引用
