import React from 'react'
import http from '../../utils/http'
import {ERR_OK} from '../../utils/config'
import {connect} from 'react-redux'
import {createOrder} from '../../redux/exchange.redux'
import "./index.css";
@connect(
	state=>state.exchange,
	{createOrder}
)
class PurChase extends React.Component{
	constructor(props) {
		super(props)
		this.state = {
            dealMoney:'',
            dealAmount: '',
			noNeed: true,
			coinName:'',
            coinId:'',
            coinList: [],
            currentIndex: 0,
            currentWay: 0,
            dealPrice: '',
            payWays: [
                {name: '支付宝'},
                {name: '微信'},
                {name: '银行卡'}
            ],
            limit: ''
        }
        this.submit = this.submit.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }
    componentDidMount () {
        let token = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1NTkwMzI1MjUsInVzZXJfbmFtZSI6IjE1NjE3OTA3MzQwIiwianRpIjoiOWExNTc0OTItMzk3NS00ZTEzLWIwYTQtMzdlZTcyN2MwZDc4IiwiY2xpZW50X2lkIjoidXNlci1zZXJ2aWNlIiwic2NvcGUiOlsic2VydmljZSJdfQ.VcwvCGArdxnqiLvvvjuoBFsBdVgQRKpSSP6Hg46Gxnnnp8bIanvoEc6Wh4ZL6JskSf-pAY0uoiP7igPNuBUVfns-e6S5HWRAsge_AHX4glvz-ozlJjk01JpM5nem1k1QxW_cnhZ82tB7g_Q8AJ8EOhe38OmjDHrLrCqQQ3njGM2FKda9Az6nrEOzaao8tyegsO3SBIpN70cyCs8RSFepS278R-ePWYmVeCLT98J22GVzVeyisOUkLrhuNeRJqN12supbcZ81kupY60TkO5IGPo2Vo1KKkiMZM6KeEcZiqZ4wQvzNu6g7l1fna1SBctQCN1YthfRX4gkjsaKG0fgwvw'
        sessionStorage.setItem('token', token)
        this.getCoinList()
    }
	onChange(key,val){
		this.setState({
			[key]:val
		})
    }
    switchItem (item, index) {
        this.setState({
            currentIndex : index,
            coinId : item.coinId,
            coinName : item.coinName,
            dealMoney : '',
            dealAmount : ''
        })
        setTimeout(() => {
            this.getPrice()
        }, 0)
    }
    choose (index) {
        this.setState({
			currentWay:index
        })
    }
    getCoinList () {
        http.get('bottom/coin/coinlist', {
          trade: true
        }, this.noNeed).then(res => {
          if (res.code === ERR_OK) {
            this.setState({
                coinList : res.data,
                coinId : res.data[0].coinId,
                coinName : res.data[0].coinName
            })
            this.getPrice()
          }
        })
    }
    getPrice () {
        http.get('market/otcmarket/getnewprice', {
          coinId: this.state.coinId
        }, this.noNeed).then(res => {
          if (res.code === ERR_OK) {
            this.setState({
                dealPrice : res.data.cnyPrice
            })
          }
        })
    }
    getLimit () {
        http.get('bottom/config/getlimit', {}, this.noNeed).then(res => {
          if (res.code === ERR_OK) {
            this.setState({
                limit : JSON.parse(res.data.value)
            })
          }
        })
    }
    handleChange (e) {
        let { dealAmount, dealMoney } = this.state
        // 用name来区分不同的文字框输入
        if (e.target.getAttribute('name') === 'amount') {
            dealAmount = e.target.value
            if (dealAmount) {
                dealMoney = (dealAmount * this.state.dealPrice).toFixed(2)
            } else {
                dealMoney = ''
            }
        } else {
            dealMoney = e.target.value
            if (dealMoney) {
                dealAmount = (dealMoney / this.state.dealPrice).toFixed(6)
            } else {
                dealAmount = ''
            }
        }
        // 改变state值，文字框会随著更动
        this.setState({
            dealAmount: dealAmount,
            dealMoney: dealMoney
        })
    }
    submit () {
        window.scroll(0, 0)
        if (this.state.dealAmount <= 0 || this.state.dealMoney <= 0) {
          console.log('请输入购买金额')
          return
        } else if (this.state.dealMoney < 1) {
          console.log(`购买金额不得低于${this.state.limit.min}元`)
          return
        } else if (this.state.dealMoney > this.state.limit.max) {
          console.log(`今日限额${this.state.limit.max}`)
          return
        }
        let buyType = this.state.currentWay === 0 ? '1' : this.state.currentWay === 1 ? '3' : '2'
        let data = {
            dealAmount: this.state.dealAmount,
            dealPrice: this.state.dealPrice,
            dealVol: this.state.dealMoney,
            buyType: buyType,
            currencyType: this.state.coinName,
            coinId: this.state.coinId,
            unixTimestamps: new Date().getTime()
        }
        
    }
	render(){
        // const path = this.props.location.pathname
		return (
			<div className="container">
                <header>
                    {
                        this.state.coinList.map((val, index) => {
                            return <p key={index}  onClick={() => this.switchItem(val, index)}
                            className={index===this.state.currentIndex?"active":null}>{val.coinName}</p>
                        })
                    }
                </header>
                <div className="main">
                    <div className="price">
                        <p>单价</p>
                        <p><span className="money">{this.state.dealPrice}</span><span className="unit">CNY</span></p>
                    </div>
                    <div className="line"></div>
                    <div className="buy">
                        <div className="choose">
                            <p>购买数量</p>
                            <p className="input-box">
                            <input type="text" placeholder="购买数量" value={this.state.dealAmount} onChange={this.handleChange} name="amount"/>
                            <span className="coin">{this.state.coinName}</span></p>
                        </div>
                        <div className="transfer"><img src={require("../../common/image/transformation@2x.png")} alt="" /></div>
                        <div className="choose">
                            <p>价格</p>
                            <p className="input-box">
                            <input type="text" placeholder="购买金额" value={this.state.dealMoney} onChange={this.handleChange} name="money"/>
                            <span className="coin">CNY</span></p>
                        </div>
                    </div>
                    <div className="payWays">
                        {
                            this.state.payWays.map((item, index) => {
                                return <p key={index} onClick={() => this.choose(index)}
                                className={index===this.state.currentWay?"activePay":null}>{item.name}</p>
                            })
                        }
                    </div>
                    <p className="warn-text">每日限额： ￥1.00~￥2,000.00</p>
                    <button className="buyBtn" onClick={this.submit}>立即购买</button>
                    <p className="warn-text">交易手续费全免</p>
                </div>
			</div>	
		)
	}
}

export default PurChase