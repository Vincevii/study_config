# 一、参考阅读思路

1. http://hcysun.me/2017/03/03/Vue%E6%BA%90%E7%A0%81%E5%AD%A6%E4%B9%A0/
2. https://jiongks.name/blog/vue-code-review/

# 二、2.6.12版本目录架构

1. https://www.processon.com/view/link/6097dc2be401fd45926e6d80
2. ![image](http://assets.processon.com/chart_image/6097a84be0b34d254ceca8d1.png)

# 三、源码顺序分析

## Vue构建函数

一般来说，npm包的入口是package.json里面的main属性，但是我们能发现main属性的入口是一个构建过的vue.runtime.common.js，这个明显不利于我们的阅读：

```
 "main": "dist/vue.runtime.common.js",
```

此时我们可以详细看script属性，因为script属性定义了这个npm包所有的构建操作，所以从这里开始我们是能寻找到构建的入口文件：

```
"scripts": {
    "dev": "rollup -w -c scripts/config.js --environment TARGET:web-full-dev",
    "dev:cjs": "rollup -w -c scripts/config.js --environment TARGET:web-runtime-cjs-dev",
    "dev:esm": "rollup -w -c scripts/config.js --environment TARGET:web-runtime-esm",
    "dev:ssr": "rollup -w -c scripts/config.js --environment TARGET:web-server-renderer",
    "dev:compiler": "rollup -w -c scripts/config.js --environment TARGET:web-compiler ",
    "dev:weex": "rollup -w -c scripts/config.js --environment TARGET:weex-framework",
    "dev:weex:factory": "rollup -w -c scripts/config.js --environment TARGET:weex-factory",
    "dev:weex:compiler": "rollup -w -c scripts/config.js --environment TARGET:weex-compiler ",
    "build": "node scripts/build.js",
    "build:ssr": "npm run build -- web-runtime-cjs,web-server-renderer",
    "build:weex": "npm run build -- weex",
  }
```

从上面的命令我们得知，==scripts/config.js==就是基本所有构建的入口配置了，打开这个文件，我们发现这个文件其实就是一个构建的路由器，根据入参来选择具体的构建执行文件，并且决定对应的输出格式（commonjs，esmodules。。），输出目录，构建模式（development，production），以其中一个为例：

```
'web-runtime-cjs-dev': {
    entry: resolve('web/entry-runtime.js'),         -- 入口
    dest: resolve('dist/vue.runtime.common.dev.js'),-- 输出
    format: 'cjs',                                  -- 输出格式 commonjs
    env: 'development',                             -- 构建模式
    banner
  },
```

这里涉及几个入口，从命名上看基本上是是否带编译器和渲染器的区别，这里列出几个常用的：

1. web/entry-runtime.js
2. web/entry-runtime-with-compiler.js
3. web/entry-server-renderer.js
4. web/entry-server-basic-renderer.js

我们先以最简单的**web/entry-runtime.js**开始：

```
import Vue from './runtime/index'

export default Vue
```

这个文件里面只有简单引用抛出代码，因此我们找到了 ==./runtime/index==

runtime/index的代码里面代码量相对来说比较多，但是其实起到的是一个汇总入口的作用这里后续会讲到，但是这里我们发现:

```
import Vue from 'core/index'
```

这里开始有Vue的引入了，因此我们找到 ==core/index==：

```
import Vue from './instance/index'
```

最后我们找到了Vue初始化的最终文件：==./instance/index==

```
import { initMixin } from './init'
import { stateMixin } from './state'
import { renderMixin } from './render'
import { eventsMixin } from './events'
import { lifecycleMixin } from './lifecycle'
import { warn } from '../util/index'

function Vue (options) {
  if (process.env.NODE_ENV !== 'production' &&
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword')
  }
  this._init(options)
}

initMixin(Vue)
stateMixin(Vue)
eventsMixin(Vue)
lifecycleMixin(Vue)
renderMixin(Vue)

export default Vue
```

这个文件逻辑比较简单:

1. 定义Vue的构造函数
2. 分别从 init.js，state.js，render.js，events.js，lifecycle.js导出对应的方法， 并且对VUE的原型prototype上挂载方法和属性

下面来具体看下这五个js分别处理了什么：

### init.js

1. 首先定义了Vue是Component类的实例，Component中定义的属性与方法的断言可以看这里：http://note.youdao.com/noteshare?id=71a39b1de1fda3d66f73d8d5fb2eda9b&sub=F083434D02F748008C03286981DF01C9
2.
