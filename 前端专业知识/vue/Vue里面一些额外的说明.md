# Vue: Class`<Component>`

在init.js里面，initMixin的形参定义成为了这个，这里其实是flow.js的语法，与ts很像大致描述了这里的 **形参是Component类的实例** ，这里主要讲一下在vue里面Component类具体定义的内容，主要是Component类里面挂载的所有与变量的断言。其实从这里就能大致看出Vue上面挂载的内容：

1. 静态量：cid,options,extend,superOptions,extendOptions,sealedOptions,super,directive,component,filter,FunctionalRenderContext
2. 公用属性：$el, $data,$props，$options,$parent,$root,$children,$refs,$slots,$scopedSlots,$vnode,$attrs,$listeners,$isServer
3. 公用方法：$mount,$forceUpdate,$destroy,$set,$delete,$watch,$on,$once,$off,$emit,$nextTick,$createElement
4. 私有属性：不一一列举
5. 私有方法，生命周期：_mount,_update
6. SSR用到的相关
