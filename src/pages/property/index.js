import React from 'react'
import {ERR_OK} from '../../utils/config'
import http from '../../utils/http'
import {connect} from 'react-redux'
import {saveList} from '../../redux/exchange.redux'
import {withRouter} from 'react-router-dom'
import Children from '../../components/children/index'
import "./index.css"
@withRouter
@connect(
	state=>state.exchange,
	{saveList}
)
class Property extends React.PureComponent{
    constructor(props) {
		super(props)
		this.state = {
            account: false,
            totalValue: '',
            valueUnit: '',
            info: '',
            list: []
        }
        this.go = this.go.bind(this)
    }
    componentDidMount () {
        this.getData()
    }
    go () {
        this.props.history.push('/propertyDetail')
    }
    getMsg (msg) {
        console.log('msg', msg)
    }
    getData () {
        http.get('capital/capitalaccount/balance').then(res => {
          if (res.code === ERR_OK) {
            let totalValue = res.data.totalValue
            if (totalValue) {
                this.setState({
                    totalValue : res.data.totalValue
                })
            } else {
                this.setState({
                    totalValue : '0.00'
                }) 
            }
            this.setState({
                valueUnit : res.data.valueUnit,
                list : res.data.list
            })
            this.props.saveList(res.data.list)
          }
        })
    }
	render(){
		return (
            <div className="property-container">
                <div className="property">
                    <p className="font-gray">总资产折合(CNY)</p>
                    <p className="totalProperty">{this.state.totalValue}</p>
                    {
                        this.state.list.map((item, index) => {
                            return <p key={index}>
                                <span className="coinName">{item.coinName}</span>
                                <span className="font-gray">{item.amount}≈{item.value}CNY</span>
                            </p>
                        })
                    }
                    <p className="check" onClick={this.go}>查看资产</p>
                </div>
                <Children title="静静地看" getMsg={(msg) => {this.getMsg(msg)}}></Children>
            </div>
		)
	}
}

export default Property