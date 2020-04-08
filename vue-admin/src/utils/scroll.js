const scroll = {
  isEnd: false,

  end() {
    this.isEnd = true
  },

  start(callback) {
    let timer
    !this.isEnd && callback && window.addEventListener('scroll', () => {
      if (timer) {
        clearTimeout(timer)
      }
      // 函数防抖
      timer = setTimeout(() => {
        // 浏览器向上滚动的高度
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
        // 文档的真实高度
        const scrollHeight = document.documentElement.scrollHeight
        // 浏览器窗口（文档）的可视高度
        const clientHeight = document.documentElement.clientHeight

        if (scrollHeight <= scrollTop + clientHeight + 50) {
          window.scrollTo(0, scrollTop - 100)
          // 请求数据
          callback()
        }
      }, 300)
    })
  }
}

export default scroll
