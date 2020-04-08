// pages/music/music.js
const MAX_LIMIT = 12

Page({

    /* 页面的初始数据 */
    data: {
        swiperImgUrls: [{
                id: '001',
                url: 'https://p1.music.126.net/uEZ-zMcv8IpitM1DG7_9dA==/109951164866606239.jpg?imageView&quality=89',
            }, {
                id: '002',
                url: 'https://p1.music.126.net/gbNsEHM-uebtFFGluauGCA==/109951164866438499.jpg?imageView&quality=89',
            }, {
                id: '003',
                url: 'https://p1.music.126.net/w1efKBNZtGRWanUD2DAZRw==/109951164864991810.jpg?imageView&quality=89',
            },
            {
                id: '004',
                url: 'https://p1.music.126.net/kOJ1luZYKTMsixxhp0RneQ==/109951164867843915.jpg?imageView&quality=89',
            }
        ],
        playlist: []
    },

    /* 生命周期函数--监听页面加载 */
    onLoad: function(options) {
        this._getPlaylist()
    },

    /* 页面相关事件处理函数--监听用户下拉动作 */
    onPullDownRefresh: function() {
        this.setData({
            playlist: []
        })
        this._getPlaylist()
    },

    /* 页面上拉触底事件的处理函数 */
    onReachBottom: function() {
        this._getPlaylist()
    },

    /* 用户点击右上角分享 */
    onShareAppMessage: function() {

    },

    _getPlaylist() {
        wx.showLoading({
            title: '歌单加载ing',
        })
        wx.cloud.callFunction({
            name: 'music',
            data: {
                $url: 'playlist',
                start: this.data.playlist.length,
                count: MAX_LIMIT
            }
        }).then(res => {
            this.setData({
                playlist: this.data.playlist.concat(res.result.data)
            })
            wx.hideLoading()
            wx.stopPullDownRefresh()
        })
    }

})