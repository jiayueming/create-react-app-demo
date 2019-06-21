import React from 'react'
export default function countDown(Comp){
	return class WrapperComp extends React.Component{
		constructor(props){
			super(props)
			this.state = {
                M: '',
                S: ''
            }
            this.countdown = this.countdown.bind(this)
            this.calcuTime = this.calcuTime.bind(this)
		}
		handleChange(key,val){
			this.setState({
				[key]:val
			})
        }
        calcuTime (second) {
            let H = parseInt(second / 3600).toString() // 小时
            let M = (parseInt(second / 60) % 60).toString()
            let S = (parseInt(second % 60)).toString()
            this.H = H
            this.setState({
                M: M.length < 2 ? '0' + M : M,
                S: S.length < 2 ? '0' + S : S
            })
        }
        countdown (allTime) {
            this.calcuTime(allTime)
            let timer = setInterval(() => {
              if (allTime <= 0) {
                clearInterval(timer)
                return
              }
              allTime--
              this.calcuTime(allTime)
            }, 1000)
            if (allTime <= 0) {
              clearInterval(timer)
            }
        }
		render(){
			return <Comp countdown={this.countdown} state={this.state} {...this.props}></Comp>
		}
	}
}