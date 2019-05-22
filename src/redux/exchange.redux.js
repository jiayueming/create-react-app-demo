import axios from 'axios'
import io from 'socket.io-client'
import http from '../utils/http'
const socket = io('ws://localhost:9093')
// 获取聊天列表
const MSG_LIST = 'MSG_LIST'
// 读取信息
const MSG_RECV = 'MSG_RECV'
// 标识已读
const MSG_READ = 'MSG_READ'

const ORDER_ID = 'ORDER_ID'
const initState = {
	chatmsg:[],
	users:{},
  unread:0,
  orderId: ''
}

export function chat(state=initState, action){
	switch(action.type){
        case ORDER_ID:
            return {...state,orderId:action.payload.orderId}
		case MSG_LIST:
			return {...state,users:action.payload.users, chatmsg:action.payload.msgs,unread:action.payload.msgs.filter(v=>!v.read&&v.to==action.payload.userid).length}
		case MSG_RECV:
			const n = action.payload.to==action.userid?1:0
			return {...state,chatmsg:[...state.chatmsg,action.payload],unread:state.unread+n}
		case MSG_READ:
			const {from, num} = action.payload
			return {...state, chatmsg:state.chatmsg.map(v=>({...v,read:from==v.from?true:v.read})), unread:state.unread-num}
		default:
			return state
	}
}
function msgList(msgs, users, userid){
	return {type:MSG_LIST,payload:{msgs,users,userid}}
}
function msgRecv(msg,userid){
	return {userid, type:MSG_RECV, payload:msg}
}
function msgRead({from,userid,num}){
	return {type: MSG_READ, payload:{from,userid,num}}
}
function saveOrderId({orderId}){
	return {type: ORDER_ID, payload:{orderId}}
}
export function readMsg(from){
	return (dispatch,getState)=>{
		axios.post('/user/readmsg',{from})
			.then(res=>{
				const userid = getState().user._id
				if (res.status==200 && res.data.code==0) {
					dispatch(msgRead({userid,from,num:res.data.num}))
				}
			})
	}
}
export function recvMsg(){
	return (dispatch, getState)=>{
		socket.on('recvmsg',function(data){
			console.log('recvmsg',data)
			const userid = getState().user._id
			dispatch(msgRecv(data, userid))
		})
	}
}
export function sendMsg({from ,to ,msg}){
	return dispatch=>{
		socket.emit('sendmsg',{from ,to ,msg})
	}
	
}
export function getMsgList(){
	return (dispatch,getState)=>{
		axios.get('/user/getmsglist')
			.then(res=>{
				if (res.status==200 && res.data.code==0) {
					const userid = getState().user._id
					dispatch(msgList(res.data.msgs, res.data.users,userid))
				}
			})
	}
}
export function createOrder(){
	return async dispatch=>{
        let buyType = this.state.currentWay === 0 ? '1' : this.state.currentWay === 1 ? '3' : '2'
        http.post('exchange-trade-server/order/createOrder', {
          dealAmount: this.state.dealAmount,
          dealPrice: this.state.dealPrice,
          dealVol: this.state.dealMoney,
          buyType: buyType,
          currencyType: this.state.coinName,
          coinId: this.state.coinId,
          unixTimestamps: new Date().getTime()
        }).then(res => {
          if (res.code === ERR_OK) {
            dispatch(saveOrderId(res.data.data))
          } else if (res.code === -8) {
            this.getPrice()
          } else if (res.code === -10) {
            console.log('去登陆', res.code)
          }
        })
	}
}