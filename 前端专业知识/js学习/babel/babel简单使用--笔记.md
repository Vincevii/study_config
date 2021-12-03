# 笔记

[原文](http://www.ruanyifeng.com/blog/2016/01/babel.html)

## 一. 配置文件.babelrc

### 格式：

```
{
    presets:[],
    plugins:[]
}
```

preset为官方定义规则，可以使用npm安装。

```
babel-preset-es2015     es2015转码规则 es6
babel-preset-react      react转码规则
babel-preset-stage-0    ES7不同阶段语法提案的转码规则（共有4个阶段），选装一个
babel-preset-stage-1
babel-preset-stage-2
babel-preset-stage-3
```

插件中每个访问者都有排序问题。

这意味着如果两次转译都访问相同的”程序”节点，则转译将按照 plugin 或 preset 的规则进行排序然后执行。

- Plugin 会运行在 Preset 之前。
- Plugin 会从第一个开始顺序执行。ordering is first to last.
- Preset 的顺序则刚好相反(从最后一个逆序执行)。
- babel-preset-es2015: 可以将es2015即es6的js代码编译为es5
- babel-preset-es2016: 可以将es2016即es7的js代码编译为es6
- babel-preset-es2017: 可以将es2017即es8的js代码编译为es7
- babel-preset-stage-x: 可以将处于某一阶段的js语法编译为正式版本的js代码

提案共分为五个阶段：

- stage-0: 稻草人-只是一个大胆的想法
- stage-1: 提案-初步尝试
- stage-2: 初稿-完成初步规范
- stage-3: 候选-完成规范和浏览器初步实现
- stage-4: 完成-将被添加到下一年发布

## 二. 命令行转码babel-cli

babel-cli是用于babel的命令行转码的，需要使用npm安装。

```
转码结果输出到标准输出
babel example.js

转码结果写入一个文件
--out-file 或 -o 参数指定输出文件
babel example.js --out-file compiled.js
或者
babel example.js -o compiled.js

整个目录转码
--out-dir 或 -d 参数指定输出目录
babel src --out-dir lib
或者
babel src -d lib

-s 参数生成source map文件
babel src -d lib -s

```

这样的做法比较基本，并且依赖全局的babel安装。

我们也可以把babel安装在本地目录，并且改写package.json

```
# 安装
$ npm install --save-dev babel-cli

#package.json
{
  // ...
  "devDependencies": {
    "babel-cli": "^6.0.0"
  },
  "scripts": {
    "build": "babel src -d lib"
  },
}

#转码的时候，就执行下面的命令。
npm run build
```

==还有在webpack中配置==

## 三.一些配合babel使用的工具

### 1. babel-node

babel-cli自带的es6的pepl工具，可以直接在命令行运行es6代码，不需额外安装，直接运行babel-node即可：

```
$ babel-node
> (x => x * 2)(1)
2
```

也可以直接运行ES6脚本

```
babel-node index.js
```

当然也可以在项目中使用，在本地安装 babel-cli后

```
{
  "scripts": {
    "script-name": "babel-node script.js"
  }
}
```

### 2. babel-register

此模块改写了 require 命令，使require引入的以.js、.jsx、.es和.es6为后缀名的文件块是经过babel转码的。

注意，这时只转码require的文件，而不会转码当前文件。

```
require("babel-register");
require("./main.js");
```

### 3. babel-core

此模块针对某些代码需要调用babel api进行转码的情况。

```
var babel = require('babel-core');

// 字符串转码
babel.transform('code();', options);
// => { code, map, ast }

// 文件转码（异步）
babel.transformFile('filename.js', options, function(err, result) {
  result; // => { code, map, ast }
});

// 文件转码（同步）
babel.transformFileSync('filename.js', options);
// => { code, map, ast }

// Babel AST转码
babel.transformFromAst(ast, code, options);
// => { code, map, ast }
```

配置对象options，可以参看官方文档http://babeljs.io/docs/usage/options/。

### 4. babel-polyfill

Babel默认只转换新的JavaScript句法（syntax），而不转换新的API，比如Iterator、Generator、Set、Maps、Proxy、Reflect、Symbol、Promise等全局对象，以及一些定义在全局对象上的方法（比如Object.assign）都不会转码。

举例来说，ES6在Array对象上新增了Array.from方法。Babel就不会转码这个方法。如果想让这个方法运行，必须使用babel-polyfill，为当前环境提供一个垫片。

视频：
http://ninghao.net/course/3432
