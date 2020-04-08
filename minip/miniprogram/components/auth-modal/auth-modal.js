// components/login/login-modal.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        showAuthModal: Boolean
    },

    /**
     * 组件的初始数据
     */
    data: {

    },

    /**
     * 组件的方法列表
     */
    methods: {
        getUserInfoHandler: function (event) {
            const userInfo = event.detail.userInfo
            if (userInfo) {
                this.setData({
                    showAuthModal: false
                })
                this.triggerEvent('getUserInfoSucc', userInfo)
            } else {
                this.triggerEvent('getUserInfoFail')
            }
        }
    }
})
