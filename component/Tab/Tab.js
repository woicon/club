Component({
    properties: {
        tabArray: { // 属性名
            type: Array, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
            value: {}, // 属性初始值（可选），如果未指定则会根据类型选择一个
            observer: function (newVal, oldVal, changedPath) {
     
            }
        },
        myProperty2: String // 简化的定义方式
    },

    /**
     * 组件的初始数据
     */
    data: {

    },
    methods: {
        toggleTab:function(){

        },
    }
})