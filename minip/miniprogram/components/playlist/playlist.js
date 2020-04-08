// components/playlist/playlist.js
Component({
    /* 组件的属性列表 */
    properties: {
        playlist: {
            type: Object
        }
    },

    data: {
        _count: ''
    },

    lifetimes: {
        attached: function () {
            this.setData({
                "_count": this._convertPlayCount(this.properties.playlist.playCount)
            })
        }
    },

    methods: {
        _convertPlayCount (num) {
            let convertNum
            if (num < 10000) {
                convertNum = parseInt(num).toString()
            }
            if (num >= 10000 && num < 100000000) {
                convertNum = parseInt(num / 10000) + "万"
            }
            if (num >= 100000000) {
                convertNum = parseInt(num / 100000000) + "亿"
            }
            return convertNum
        },

        goToMusiclist () {
            wx.navigateTo({
                url: `../musiclist/musiclist?playlistId=${this.properties.playlist.id}`,
            })

            
            /*
                当前所在歌单.
                待后期播放歌单中的歌曲时，把歌单追加到最近播放的歌单列表中
             */
            wx.setStorageSync('playlist', this.properties.playlist)
        }
    }
})
