// pages/microblog/microblog.js

let keyword = ''

Page({

    data: {
        microblogArr: [],   // 博客列表按事件逆序展示的数据
        searchArr: [],      // 搜索返回的列表数据
        isAuthorized: true  // 控制bottom-modal是否显示,假设初始为授权状态
    },

    onLoad: function (options) {
        this.getMicroblog()
    },

    onPullDownRefresh: function () {
        if (this.data.searchArr.length) {
            this.setData({
                searchArr: []
            })
            this.searchMicroblog(keyword)
        } else {
            this.setData({
                microblogArr: []
            })
            this.getMicroblog()
        }
    },

    onReachBottom: function () {
        this.getMicroblog()
    },

    _showModal: function () {
        // 获取用户信息
        wx.getSetting({
            success: (res) => {
                // 获取用户信息成功，调用getUserInfoSucc跳转到博客编辑页面
                if (res.authSetting['scope.userInfo']) {
                    wx.getUserInfo({
                        success: (res) => {
                            this.getUserInfoSucc({
                                detail: res.userInfo
                            })
                        }
                    })
                } else {
                    this.setData({
                        isAuthorized: false
                    })
                }
            }
        })
    },

    // 用户允许授权，跳转到博客编辑页面
    getUserInfoSucc(option) {
        const detail = option.detail
        wx.navigateTo({
            url: `/pages/edit-microblog/edit-microblog?nickName=${detail.nickName}&avatarUrl=${detail.avatarUrl}`
        })
    },

    // 用户拒绝授权，弹出授权提示框
    getUserInfoFail: function () {
        wx.showModal({
            title: '未授权',
            content: '该功能需要授权才可使用',
        })
    },

    // 调用microblog云函数，获取microblog表中的数据
    getMicroblog() {
        wx.showLoading({
            title: '博客列表加载中',
        })
        wx.cloud.callFunction({
            name: 'microblog',
            data: {
                $url: 'microblog',
                start: this.data.microblogArr.length,
                count: 10
            }
        }).then(res => {
            wx.hideLoading()
            wx.stopPullDownRefresh()
            this.setData({
                microblogArr: this.data.microblogArr.concat(res.result.data)
            })
        }).catch(err => {
            console.error(err)
        })
    },

    //点击微博卡片。跳转至详情页
    goToDetail(e) {
        const microblogId = e.currentTarget.dataset.microblogid
        wx.navigateTo({
            url: `/pages/microblog-detail/microblog-detail?microblogId=${microblogId}`
        })
    },

    onSearch(event) {
        keyword = event.detail.keyword
        this.searchMicroblog(keyword)
    },

    oncancelSearch() {
        this.setData({
            searchArr: []
        })
    },

    searchMicroblog(keyword) {
        wx.showLoading({
            title: '搜索中',
        })
        wx.cloud.callFunction({
            name: 'microblog',
            data: {
                $url: 'search',
                keyword,
                start: this.data.searchArr.length,
                count: 10
            }
        }).then(res => {
            wx.hideLoading()
            wx.stopPullDownRefresh()
            if (res.result.data.length === 0) {
                if (this.data.searchArr.length > 0) {
                    wx.showModal({
                        title: '未查询到新的微博',
                        showCancel: true
                    })
                } else {
                    wx.showModal({
                        title: '未查询到相关微博',
                        showCancel: true
                    })
                }
            } else {
                this.setData({
                    searchArr: this.data.searchArr.concat(res.result.data)
                })
            }
        }).catch(err => {
            console.error(err)
        })
    }
})