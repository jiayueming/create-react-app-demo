export const timeMixin = {
    constructor(props) {
      super(props)
      this.state = {
        H: '',
        M: '',
        S: ''
      }
      this.calcuTime = this.calcuTime.bind(this)
      this.countdown = this.countdown.bind(this)
    },
    calcuTime (second) {
      let H = parseInt(second / 3600).toString() // 小时
      let M = (parseInt(second / 60) % 60).toString()
      let S = (parseInt(second % 60)).toString()
      this.setState({
        H: H,
        M: M,
        S: S
      })
    },
    countdown (allTime) {
      this.calcuTime(allTime)
      this.state.timer = setInterval(() => {
        if (allTime <= 0) {
          clearInterval(this.timer)
          return
        }
        allTime--
        this.calcuTime(allTime)
      }, 1000)
      if (allTime <= 0) {
        clearInterval(this.state.timer)
      }
    }
}