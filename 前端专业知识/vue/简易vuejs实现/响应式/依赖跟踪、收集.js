
// 依赖跟踪/收集
window.Dep = class Dep {
    constructor(){
        this.subscribers = new Set()
    }

    depend () {
        if (activeUpdate) {
            // 注册当前active update 作为订阅者
            this.subscribers.add(activeUpdate)
        }
    }

    notify () {
        // 通知所有订阅者
        this.subscribers.forEach(sub => sub())
    }
}
let dep = new Dep()
let activeUpdate

function autorun (update) {
    // 这个wrapupdate的作用是，当update方法执行时，我们的依赖类能访问这个activeupdate
    function wrappedUpdate () {
        activeUpdate = wrappedUpdate
        update()
        activeUpdate = null
    }

    wrappedUpdate()
}

autorun(() => {
    dep.depend()
})

