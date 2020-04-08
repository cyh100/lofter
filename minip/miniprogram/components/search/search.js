let keyword = ''

Component({
    /**
     * 组件的属性列表
     */
    properties: {

    },

    /**
     * 组件的初始数据
     */
    data: {
        value: ''
    },

    /**
     * 组件的方法列表
     */
    methods: {
        onInput(event) {
            keyword = event.detail.value.trim()
        },

        onSearch() {
            if (keyword == '') {
                wx.showModal({
                    title: '搜索内容不能为空',
                    showCancel: true
                })
            } else {
                this.triggerEvent('search', {
                    keyword
                })
            }
        },

        onCancel() {
            console.log('cancel')
            this.setData({
                value: ''
            })
            this.triggerEvent('cancelsearch')
        }
    }
})
