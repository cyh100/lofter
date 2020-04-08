// pages/musiclist/musiclist.js

Page({

    data: {
        musiclist: [],
        listInfo: {}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        wx.showLoading({
            title: '加载歌曲列表',
        })
        wx.cloud.callFunction({
            name: 'music',
            data: {
                $url: 'musiclist',
                playlistId: options.playlistId
            }
        }).then(res => {
            const playlist = JSON.parse(res.result).playlist
            const {
                tracks,
                name,
                coverImgUrl,
                creator,
                description,
                commentCount,
                shareCount
            } = playlist
            this.setData({
                musiclist: tracks,
                listInfo: {
                    coverImgUrl,
                    name,
                    description: description,
                    commentCount,
                    shareCount,
                    creator: creator.nickname,
                    avatarUrl: creator.avatarUrl
                }
            })
            wx.hideLoading()
            wx.setNavigationBarTitle({
                title: this.data.listInfo.name
            })


            /*
                当前歌曲列表.
                待播放歌单中的歌曲时，把歌曲追加到最近播放的播放列表中
             */
            wx.setStorageSync('musiclist', tracks)

        })
    }
})