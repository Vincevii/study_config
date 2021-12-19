
let activeUpdate
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

function observe (obj) {
    Object.keys(obj).forEach(key => {
        let value = obj.key
        let dep = new Dep()
        Object.defineProperty(obj, 'key', {
            get: function () {
                dep.depend()
                return value
            },
            set: function (newValue) {
                let isChanged = value !== newValue
                if(isChanged) {
                    dep.notify()
                    value = newValue
                }
            }
        })
    })
    
}

function autorun (update) {
    // 这个wrapupdate的作用是，当update方法执行时，我们的依赖类能访问这个activeupdate
    function wrappedUpdate () {
        activeUpdate = wrappedUpdate
        update()
        activeUpdate = null
    }

    wrappedUpdate()
}


const state = {
    count: 0
}

observe(state)

autorun(() => {
    console.log(state.count)
})

state.count++