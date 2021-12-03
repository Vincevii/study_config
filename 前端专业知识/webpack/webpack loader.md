[资料](https://mp.weixin.qq.com/s/rKmR2m15hIczGCOPHBOzAg)

# 一、loader 本质

- webpack中可以按顺序配置多个loader
- loader本质是导出函数的 JavaScript 模块。所导出的函数，可用于实现内容转换，函数支持以下3个参数

```
/**
 * @param {string|Buffer} content 源文件的内容
 * @param {object} [map] 可以被 https://github.com/mozilla/source-map 使用的 SourceMap 数据
 * @param {any} [meta] meta 数据，可以是任何内容
 */
function webpackLoader(content, map, meta) {
  // 你的webpack loader代码
}
module.exports = webpackLoader;
```

# 二、Normal Loader 和 Pitching Loader 是什么

## 2.1 Normal Loader

- loader本质是导出函数的js模块，而该模块导出的函数就是normal loader
- 每个loader里面可能含有，normal loader 和 piching loader，**是loader的组成部分**
- 而webpack loader分类不同，webpack loader有4类：**pre 前置、post 后置、normal 普通和 inline 行内**
- 其中 pre 和 post loader，可以通过 rule 对象的 enforce 属性来指定:

```
// webpack.config.js
const path = require("path");

module.exports = {
  module: {
    rules: [
      {
        test: /\.txt$/i,
        use: ["a-loader"],
        enforce: "post", // post loader
      },
      {
        test: /\.txt$/i,
        use: ["b-loader"], // normal loader
      },
      {
        test: /\.txt$/i,
        use: ["c-loader"],
        enforce: "pre", // pre loader
      },
    ],
  },
};
```

> loader执行顺序是根据配置数组，由右往左对数据进行处理
> ![image](https://mmbiz.qpic.cn/mmbiz_jpg/jQmwTIFl1V3rpicHwnh14qyy1ibuR63aDhcshnvoAeCCJHawaH9zKfNP41pqJZhfSuy4S2G2cUakwjqTj93GMRKQ/640?wx_fmt=jpeg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

## 2.2 Pitching Loader

我们可以在导出的函数上添加一个 pitch 属性，它的值也是一个函数。该函数被称为 Pitching Loader，它支持 3 个参数：

```
/**
 * @remainingRequest 剩余请求
 * @precedingRequest 前置请求
 * @data 数据对象
 */
function (remainingRequest, precedingRequest, data) {
 // some code
};
```

其中 data 参数，可以用于数据传递。即在 pitch 函数中往 data 对象上添加数据，之后在 normal 函数中通过 this.data 的方式读取已添加的数据

piching loader示例：

```
function aLoader(content, map, meta) {
  // 省略部分代码
}

aLoader.pitch = function (remainingRequest, precedingRequest, data) {
  console.log("开始执行aLoader Pitching Loader");
  console.log(remainingRequest, precedingRequest, data)
};

module.exports = aLoader;
```

> pitching loader比所有normal loader先执行，即数组中如果有三个不一样的loader，则会先执行三个loader里面的不同pitching loader

> pitching loader的执行顺序是 从左到右
> ![image](https://mmbiz.qpic.cn/mmbiz_jpg/jQmwTIFl1V3rpicHwnh14qyy1ibuR63aDhdIfETkv9H3FADCFFrwhHIsB8icibyk0Frhzv6W4ICibdCBOpoCOmXfxvg/640?wx_fmt=jpeg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

其实当某个 Pitching Loader 返回非 undefined 值时，就会实现熔断效果：

```
bLoader.pitch = function (remainingRequest, precedingRequest, data) {
  console.log("开始执行bLoader Pitching Loader");
  return "bLoader Pitching Loader->";
};
```

此时会出现这种情况：
![image](https://mmbiz.qpic.cn/mmbiz_jpg/jQmwTIFl1V3rpicHwnh14qyy1ibuR63aDhdUv3W5Q5HJfacvZ6Re4ia1qJduNQPHD0tutJGzlAEYbMEAA1APPugxQ/640?wx_fmt=jpeg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1o)

# 三、loader如何被运行

## 3.1 loader运行核心流程

- loader的运行机制是由模块，loader-runner提供
- 在 runLoaders 函数中，会先从 options 配置对象上获取 loaders 信息，然后调用 createLoaderObject 函数创建 Loader 对象，调用该方法后会返回包含 normal、pitch、raw 和 data 等属性的对象

```
// loader-runner/lib/LoaderRunner.js
exports.runLoaders = function runLoaders(options, callback) {
  // read options
 var resource = options.resource || "";
 var loaders = options.loaders || [];
 var loaderContext = options.context || {}; // Loader上下文对象
 var processResource = options.processResource || ((readResource, context, 
    resource, callback) => {
  context.addDependency(resource);
  readResource(resource, callback);
 }).bind(null, options.readResource || readFile);

 // prepare loader objects
 loaders = loaders.map(createLoaderObject);
  loaderContext.context = contextDirectory;
 loaderContext.loaderIndex = 0;
 loaderContext.loaders = loaders;
  
  // 省略大部分代码
 var processOptions = {
  resourceBuffer: null,
  processResource: processResource
 };
  // 迭代PitchingLoaders
 iteratePitchingLoaders(processOptions, loaderContext, function(err, result) {
  // ...
 });
};
```

在创建完 Loader 对象及初始化 loaderContext 对象之后，就会调用 iteratePitchingLoaders 函数开始迭代 Pitching Loader

![image](https://mmbiz.qpic.cn/mmbiz_jpg/jQmwTIFl1V3rpicHwnh14qyy1ibuR63aDh8ZF8miarnSTSgiaxnFnWxpNLBjGugp0Tm0awOBKQ1m1x0sEvvjuWWLFQ/640?wx_fmt=jpeg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

看完上面的流程图和调用堆栈图，接下来我们来分析一下流程图中相关函数的核心代码。

## 3.2 iteratePitchingLoaders

```
// loader-runner/lib/LoaderRunner.js
function iteratePitchingLoaders(options, loaderContext, callback) {
 // abort after last loader
 if(loaderContext.loaderIndex >= loaderContext.loaders.length)
    // 在processResource函数内，会调用iterateNormalLoaders函数
    // 开始执行normal loader
  return processResource(options, loaderContext, callback);

  // 首次执行时，loaderContext.loaderIndex的值为0
 var currentLoaderObject = loaderContext.loaders[loaderContext.loaderIndex];

 // 如果当前loader对象的pitch函数已经被执行过了，则执行下一个loader的pitch函数
 if(currentLoaderObject.pitchExecuted) {
  loaderContext.loaderIndex++;
  return iteratePitchingLoaders(options, loaderContext, callback);
 }

 // 加载loader模块
 loadLoader(currentLoaderObject, function(err) {
    if(err) {
   loaderContext.cacheable(false);
   return callback(err);
  }
    // 获取当前loader对象上的pitch函数
  var fn = currentLoaderObject.pitch;
    // 标识loader对象已经被iteratePitchingLoaders函数处理过
  currentLoaderObject.pitchExecuted = true;
  if(!fn) return iteratePitchingLoaders(options, loaderContext, callback);

    // 开始执行pitch函数
  runSyncOrAsync(fn,loaderContext, ...);
  // 省略部分代码
 });
}
```

在 iteratePitchingLoaders 函数内部，会从最左边的 loader 对象开始处理，然后调用 loadLoader 函数开始加载 loader 模块。

在 loadLoader 函数内部，会根据 loader 的类型，使用不同的加载方式。对于我们当前的项目来说，会通过 require(loader.path) 的方式来加载 loader 模块。具体的代码如下所示：

```
// loader-runner/lib/loadLoader.js
module.exports = function loadLoader(loader, callback) {
 if(loader.type === "module") {
  try {
    if(url === undefined) url = require("url");
   var loaderUrl = url.pathToFileURL(loader.path);
   var modulePromise = eval("import(" + JSON.stringify(loaderUrl.toString()) + ")");
   modulePromise.then(function(module) {
    handleResult(loader, module, callback);
   }, callback);
   return;
  } catch(e) {
   callback(e);
  }
 } else {
  try {
   var module = require(loader.path);
  } catch(e) {
   // 省略相关代码
  }
    // 处理已加载的模块
  return handleResult(loader, module, callback);
 }
};
```

在成功加载 loader 模块之后，都会调用 handleResult 函数来处理已加载的模块。该函数的作用是，获取模块中的导出函数及该函数上 pitch 和 raw 属性的值并赋值给对应 loader 对象的相应属性：

```
// loader-runner/lib/loadLoader.js
function handleResult(loader, module, callback) {
 if(typeof module !== "function" && typeof module !== "object") {
  return callback(new LoaderLoadingError(
   "Module '" + loader.path + "' is not a loader (export function or es6 module)"
  ));
 }
 loader.normal = typeof module === "function" ? module : module.default;
 loader.pitch = module.pitch;
 loader.raw = module.raw;
 if(typeof loader.normal !== "function" && typeof loader.pitch !== "function") {
  return callback(new LoaderLoadingError(
   "Module '" + loader.path + "' is not a loader (must have normal or pitch function)"
  ));
 }
 callback();
}
```

在处理完已加载的 loader 模块之后，就会继续调用传入的 callback 回调函数。在该回调函数内，会先在当前的 loader 对象上获取 pitch 函数，然后调用 runSyncOrAsync 函数来执行 pitch 函数。对于我们的项目来说，就会开始执行 aLoader.pitch 函数。

# 四、pitching loader的熔断机制如何实现

```
// loader-runner/lib/LoaderRunner.js
function iteratePitchingLoaders(options, loaderContext, callback) {
 // 省略部分代码
 loadLoader(currentLoaderObject, function(err) {
  var fn = currentLoaderObject.pitch;
    // 标识当前loader已经被处理过
  currentLoaderObject.pitchExecuted = true;
    // 若当前loader对象上未定义pitch函数，则处理下一个loader对象
  if(!fn) return iteratePitchingLoaders(options, loaderContext, callback);

    // 执行loader模块中定义的pitch函数
  runSyncOrAsync(
   fn,
   loaderContext, [loaderContext.remainingRequest, 
        loaderContext.previousRequest, currentLoaderObject.data = {}],
   function(err) {
    if(err) return callback(err);
    var args = Array.prototype.slice.call(arguments, 1);
    var hasArg = args.some(function(value) {
     return value !== undefined;
    });
    if(hasArg) {
     loaderContext.loaderIndex--;
     iterateNormalLoaders(options, loaderContext, args, callback);
    } else {
     iteratePitchingLoaders(options, loaderContext, callback);
    }
   }
  );
 });
}
```

- 在以上代码中，runSyncOrAsync 函数的回调函数内部，会根据当前 loader 对象 pitch 函数的返回值是否为 undefined 来执行不同的处理逻辑。
- 如果 pitch 函数返回了非 undefined 的值，则会出现熔断。即跳过后续的执行流程，开始执行上一个 loader 对象上的 normal loader 函数。
- 具体的实现方式也很简单，就是 loaderIndex 的值减 1，然后调用 iterateNormalLoaders 函数来实现。
- 而如果 pitch 函数返回 undefined，则继续调用 iteratePitchingLoaders 函数来处理下一个未处理 loader 对象。

# 五、Normal Loader 函数是如何被运行的

```
// loader-runner/lib/LoaderRunner.js
function iterateNormalLoaders(options, loaderContext, args, callback) {
 if(loaderContext.loaderIndex < 0)
  return callback(null, args);

 var currentLoaderObject = loaderContext.loaders[loaderContext.loaderIndex];

 // normal loader的执行顺序是从右到左
 if(currentLoaderObject.normalExecuted) {
  loaderContext.loaderIndex--;
  return iterateNormalLoaders(options, loaderContext, args, callback);
 }

  // 获取当前loader对象上的normal函数
 var fn = currentLoaderObject.normal;
  // 标识loader对象已经被iterateNormalLoaders函数处理过
 currentLoaderObject.normalExecuted = true;
 if(!fn) { // 当前loader对象未定义normal函数，则继续处理前一个loader对象
  return iterateNormalLoaders(options, loaderContext, args, callback);
 }

 convertArgs(args, currentLoaderObject.raw);

 runSyncOrAsync(fn, loaderContext, args, function(err) {
  if(err) return callback(err);

  var args = Array.prototype.slice.call(arguments, 1);
  iterateNormalLoaders(options, loaderContext, args, callback);
 });
}
```

- 在 loader-runner 模块内部会通过调用 iterateNormalLoaders 函数，来执行已加载 loader 对象上的 normal loader 函数。
- 与 iteratePitchingLoaders 函数一样，在 iterateNormalLoaders 函数内部也是通过调用 runSyncOrAsync 函数来执行 fn 函数。
- 不过在调用 normal loader 函数前，会先调用 convertArgs 函数对参数进行处理。

convertArgs 函数会根据 raw 属性来对 args[0]（文件的内容）进行处理，该函数的具体实现如下所示：

```
// loader-runner/lib/LoaderRunner.js
function convertArgs(args, raw) {
 if(!raw && Buffer.isBuffer(args[0]))
  args[0] = utf8BufferToString(args[0]);
 else if(raw && typeof args[0] === "string")
  args[0] = Buffer.from(args[0], "utf-8");
}

// 把buffer对象转换为utf-8格式的字符串
function utf8BufferToString(buf) {
 var str = buf.toString("utf-8");
 if(str.charCodeAt(0) === 0xFEFF) {
  return str.substr(1);
 } else {
  return str;
 }
}
```

# 六、Loader 函数体中的 this.callback 和 this.async 方法是哪里来的？

Loader 可以分为同步 Loader 和异步 Loader，对于同步 Loader 来说，我们可以通过 return 语句或 this.callback 的方式来同步地返回转换后的结果。只是相比 return 语句，this.callback 方法则更灵活，因为它允许传递多个参数。

sync-loader.js

```
module.exports = function(source) {
 return source + "-simple";
};
```

sync-loader-with-multiple-results.js

```
module.exports = function (source, map, meta) {
  this.callback(null, source + "-simple", map, meta);
  return; // 当调用 callback() 函数时，总是返回 undefined
};
```

需要注意的是 this.callback 方法支持 4 个参数，每个参数的具体作用如下所示：

```
this.callback(
  err: Error | null,    // 错误信息
  content: string | Buffer,    // content信息
  sourceMap?: SourceMap,    // sourceMap
  meta?: any    // 会被 webpack 忽略，可以是任何东西
);
```

而对于异步 loader，我们需要调用 this.async 方法来获取 callback 函数：

```
module.exports = function(source) {
 var callback = this.async();
 setTimeout(function() {
  callback(null, source + "-async-simple");
 }, 50);
};
```

那么以上示例中，this.callback 和 this.async 方法是哪里来的呢？带着这个问题，我们来从 loader-runner 模块的源码中，一探究竟。

```
// loader-runner/lib/LoaderRunner.js
function runSyncOrAsync(fn, context, args, callback) {
 var isSync = true; // 默认是同步类型
 var isDone = false; // 是否已完成
 var isError = false; // internal error
 var reportedError = false;
  
 context.async = function async() {
  if(isDone) {
   if(reportedError) return; // ignore
   throw new Error("async(): The callback was already called.");
  }
  isSync = false;
  return innerCallback;
 };
}
```

在前面我们已经介绍过 runSyncOrAsync 函数的作用，该函数用于执行 Loader 模块中设置的 Normal Loader 或 Pitching Loader 函数。在 runSyncOrAsync 函数内部，最终会通过 fn.apply(context, args) 的方式调用 Loader 函数。即会通过 apply 方法设置 Loader 函数的执行上下文。

此外，由以上代码可知，当调用 this.async 方法之后，会先设置 isSync 的值为 false，然后返回 innerCallback 函数。其实该函数与 this.callback 都是指向同一个函数。

this.callback

```
// loader-runner/lib/LoaderRunner.js
function runSyncOrAsync(fn, context, args, callback) {
  // 省略部分代码
 var innerCallback = context.callback = function() {
  if(isDone) {
   if(reportedError) return; // ignore
   throw new Error("callback(): The callback was already called.");
  }
  isDone = true;
  isSync = false;
  try {
   callback.apply(null, arguments);
  } catch(e) {
   isError = true;
   throw e;
  }
 };
}
```

如果在 Loader 函数中，是通过 return 语句来返回处理结果的话，那么 isSync 值仍为 true，将会执行以下相应的处理逻辑：

```
// loader-runner/lib/LoaderRunner.js
function runSyncOrAsync(fn, context, args, callback) {
  // 省略部分代码
 try {
  var result = (function LOADER_EXECUTION() {
   return fn.apply(context, args);
  }());
  if(isSync) { // 使用return语句返回处理结果
   isDone = true;
   if(result === undefined)
    return callback();
   if(result && typeof result === "object" && typeof result.then === "function") {
    return result.then(function(r) {
     callback(null, r);
    }, callback);
   }
   return callback(null, result);
  }
 } catch(e) {
    // 省略异常处理代码
 }
}
```

通过观察以上代码，我们可以知道在 Loader 函数中，可以使用 return 语句直接返回 Promise 对象，比如这种方式：

```
module.exports = function(source) {
 return Promise.resolve(source + "-promise-simple");
};
```

# 七、Loader 最终的返回结果是如何被处理的？

```
// webpack/lib/NormalModule.js（Webpack 版本：5.45.1）
build(options, compilation, resolver, fs, callback) {
    // 省略部分代码
  return this.doBuild(options, compilation, resolver, fs, err => {
   // if we have an error mark module as failed and exit
   if (err) {
    this.markModuleAsErrored(err);
    this._initBuildHash(compilation);
    return callback();
   }

      // 省略部分代码
   let result;
   try {
    result = this.parser.parse(this._ast || this._source.source(), {
     current: this,
     module: this,
     compilation: compilation,
     options: options
    });
   } catch (e) {
    handleParseError(e);
    return;
   }
   handleParseResult(result);
  });
}
```

由以上代码可知，在 this.doBuild 方法的回调函数中，会使用 JavascriptParser 解析器对返回的内容进行解析操作，而底层是通过 acorn 这个第三方库来实现 JavaScript 代码的解析。而解析后的结果，会继续调用 handleParseResult 函数进行进一步处理。
