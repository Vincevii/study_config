// 响应式
let realValue
const obj = {foo: 123}


let convert = obj => {
    Object.keys(obj).forEach(key => {
        let value = obj.key
        Object.defineProperty(obj, 'key', {
            get: function () {
                console.log(`getting key "${key}": ${value}'`)
                return value
            },
            set: function (newValue) {
                console.log(`setting key "${key}"to${newValue}'`)
                value = newValue
            }
        })
    })
    
}


convert(obj)
obj.foo //log 'getting key "foo": 123'
obj.foo = 234 // log setting key "foo" to 234
obj.foo // og 'getting key "foo": 234'