import http from '../utils/http'
const ORDER_ID = 'ORDER_ID'
const REFRESH_PRICE = 'REFRESH_PRICE'
const PROPERTY_LIST = 'PROPERTY_LIST'
const initState = {
	orderId: '',
	isRefresh: false,
	propertyList: []
}

export function exchange(state=initState, action){
	switch(action.type){
		case ORDER_ID:
			return {...state,orderId:action.payload.orderId}
		case REFRESH_PRICE:
			return {...state,isRefresh:action.payload.isRefresh}
		case PROPERTY_LIST:
			console.log(action.payload)
			return {...state,propertyList:action.payload.propertyList}	
		default:
			return state
	}
}
function saveOrderId(orderId){
	return {type: ORDER_ID, payload:{orderId}}
}
function refreshPrice(isRefresh){
	return {type: REFRESH_PRICE, payload:{isRefresh}}
}
// {}和没有的区别
function propertyList(propertyList){
	return {type: PROPERTY_LIST, payload:{propertyList}}
}
// actions
export function saveList(data) {
	return dispatch=>{
		dispatch(propertyList(data))
		dispatch(refreshPrice(true))
	}

}
export function createOrder(data){
	return async dispatch=>{
        http.post('exchange-trade-server/order/createOrder', data).then(res => {
          if (res.code === 200) {
						dispatch(saveOrderId(res.data.data))
						this.props.history.push('/pay')
					} else if (res.code === -1) {
						dispatch(saveOrderId('270'))
					} else if (res.code === -8) {
						dispatch(refreshPrice(true))
          } else if (res.code === -10) {
            console.log('去登陆', res.code)
          }
        })
	}
}