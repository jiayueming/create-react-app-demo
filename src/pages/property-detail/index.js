import React from 'react'
import {connect} from 'react-redux'
import "./index.css"
@connect(
	state=>state.exchange,
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
    }
	render(){
        console.log('===页面redener了', this.props.propertyList)
		return (
            <div className="property-container">
                <p>查看资产详情页面</p>
                {
                    this.props.propertyList.map((item, index) => {
                        return <div key={index}>
                            <p className="name">币种名称：{item.coinName}</p>
                            <p className="amount">数量{item.amount}</p>
                            <p>价值：{item.value}</p>
                            <p>
                                <span>可用：{item.freeAmount}</span>
                                <span>冻结: {item.freezedAmount}</span>
                            </p>
                        </div>
                    })
                }
            </div>
		)
	}
}

export default Property