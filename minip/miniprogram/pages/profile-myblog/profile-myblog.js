// miniprogram/pages/profile-myblog/profile-myblog.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        blogList: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this._getMyBolg()
    },

    _getMyBolg() {
        wx.cloud.callFunction({
            name: 'microblog',
            data: {
                '$url': 'myblog',
                start: this.data.blogList.length,
                count: 10
            }
        }).then(res => {
            wx.stopPullDownRefresh()
            this.setData({
                blogList: this.data.blogList.concat(res.result.data)
            })
        })
    },

    deleteBlog(event) {
        const index = event.target.dataset.index
        const { _id, fileIdsUrl } = this.data.blogList[index]

        const _this = this
        wx.showModal({
            title: '提示',
            content: '确定要删除这条微博么？',
            success (res) {
                if (res.confirm) {
                    wx.cloud.callFunction({
                        name: 'microblog',
                        data: {
                            '$url': 'deleteById',
                            _id,
                            fileIdsUrl
                        }
                    }).then(res => {
                        if(res.result.stats.removed > 0) {
                            wx.showModal({
                              title: '提示',
                              content: '删除成功'
                            })
                            _this.data.blogList.splice(index, 1)
                            _this.setData({
                                blogList: _this.data.blogList
                            })
                        } else {
                            wx.showModal({
                                title: '提示',
                                content: '删除失败'
                              })
                        }
                    })
                }
            }
        })
    },


    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        this.setData({
            blogList: []
        })
        this._getMyBolg()
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        this._getMyBolg()
    }

})