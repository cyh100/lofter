// components/microblog-card/microblog0card.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        microblog: Object
    },


    observers: {
        'microblog.createTime': function (val) {
            const date = new Date(val)
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        date: ''
    },

    /**
     * 组件的方法列表
     */
    methods: {
        previewImg: function (e) {
            const data = e.target.dataset
            wx.previewImage({
                urls: data.fileidsurl,
                current: data.imgsrc
            })
        }
    }
})
