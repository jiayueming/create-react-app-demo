import React from 'react'
import {withRouter} from 'react-router-dom'
import PropTypes from 'prop-types'
@withRouter
class Children extends React.PureComponent{
    constructor(props) {
		super(props)
		this.state = {
            list: []
        }
    }
    msg () {
        let messge ='我是嘉悦名。。。。。'
        this.props.getMsg(messge)
    }
	render(){
		return (
            <div className="child-container">
               <h1>这是子组件{this.props.title}</h1>
               <button onClick={() => this.props.getMsg('jiayueming的component')}>点击给父组件传值</button>
            </div>
		)
	}
}
Children.propTypes = {
    title: PropTypes.string
}
export default Children