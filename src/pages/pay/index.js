import React from 'react'
import http from '../../utils/http'
import {ERR_OK} from '../../utils/config'
import "./index.css";
class Pay extends React.Component{
	constructor(props) {
		super(props)
		this.state = {
            showBank: 'none',
            showWx: 'none',
            showAli: 'none',
            M: '',
            S: ''
        }
        this.calcuTime = this.calcuTime.bind(this)
        this.countdown = this.countdown.bind(this)
    }
    componentDidMount () {
        this.getPrice()
    }
    calcuTime (second) {
        let M = (parseInt(second / 60) % 60).toString()
        let S = (parseInt(second % 60)).toString()
        this.setState({
          M: M,
          S: S
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
    getPrice () {
        http.get('exchange-trade-server/order/info', {
            Id: '270'
          }).then(res => {
            if (res.code === ERR_OK) {
                this.setState({
                    buyType: res.data.buyType,
                    OrderId: res.data.orderId,
                    currencyType: res.data.currencyType,
                    payeer: res.data.payeer,
                    payeerAccount: res.data.payeerAccount,
                    dealPrice: res.data.dealPrice,
                    dealAmount: res.data.dealAmount,
                    dealVol: res.data.dealVol,
                    bankName: res.data.bankName                   
                })
                if (this.state.buyType === '1') {
                    this.setState({
                        showAli: true
                    })
                } else if (this.state.buyType === '2') {
                    this.setState({
                        showBank: true
                    })
                } else {
                    this.setState({
                        showWx: true
                    })
                }
                if (res.data.expireTime === -2) {
                    this.setState({
                        expireTime: -2,
                        M: '00',
                        S: '00'
                    })
                } else {
                    this.setState({
                        expireTime: res.data.expireTime,
                        M: '00',
                        S: '00'
                    })
                    this.countdown(res.data.expireTime)
                }
            }
        })
    }
	render(){
		return (
            <div className="pay-container">
                <p className="title">请付款</p>
                <p className="pay-warn">请在{this.state.M + ':' +this.state.S}内用本人支付宝账号付款给商家</p>
                <div className="main">
                    <div className="top">
                        <div className="top-left">
                            <p>请向以下账户付款</p>
                            <p><span className="num-font">{this.state.dealVol}</span><span className="unit">CNY</span></p>
                        </div>
                        <div className="top-right">
                            <p><span className="mr15">交易单价</span><span>{this.state.dealPrice}CNY/{this.state.currencyType}</span></p>
                            <p><span className="mr15">交易数量</span><span>{this.state.dealAmount}{this.state.currencyType}</span></p>
                        </div>
                    </div>
                    <div className="bottom">
                        <p>
                            <span>单号</span>
                            <span>{this.state.orderId}</span>
                        </p>
                        <p className="mb40">
                            <span>购买币种</span>
                            <span>{this.state.currencyType}</span>
                        </p>
                        <p>
                            <span>收款人</span>
                            <span>{this.state.payeer}</span>
                        </p>
                        <div style={{display: this.state.showAli}}>
                            <p>
                                <span>支付宝账号</span>
                                <span>{this.state.payeerAccount}</span>
                            </p>
                            <p>
                                <span>收款二维码</span>
                                <span className="code"></span>
                            </p>
                        </div>
                        <div style={{display: this.state.showBank}}>
                            <p>
                                <span>银行卡信息</span>
                                <span>{this.state.bankName}</span>
                            </p>
                            <p>
                                <span>银行卡卡号</span>
                                <span>{this.state.payeerAccount}</span>
                            </p>
                        </div>
                        <div style={{display: this.state.showWx}}>
                            <p>
                                <span>微信账号</span>
                                <span>{this.state.payeerAccount}</span>
                            </p>
                            <p>
                                <span>收款二维码</span>
                                <span className="code"></span>
                            </p>
                        </div>
                    </div>
                    <div className="btn-box">
                        <button>取消订单</button>
                        <button>完成付款</button>
                    </div>
                </div>
            </div>
        )
	}
}

export default Pay