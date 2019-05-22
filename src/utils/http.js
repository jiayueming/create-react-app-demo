import axios from 'axios'
axios.defaults.baseURL = 'https://trade.cryptool.net:8088/'
axios.defaults.headers.common['time'] = new Date().getTime()

axios.interceptors.request.use(config => {
  return config
}, error => {
  return Promise.reject(error)
})

axios.interceptors.response.use(response => response, error => Promise.resolve(error.response))
axios.defaults.withCredentials = false
function checkStatus (response) {
  if (response.status === 200 || response.status === 304) {
    return response.data
  }
  return {
    code: -404,
    message: response.statusText,
    data: response.statusText
  }
}

function checkCode (res) {
  if (res.code !== 200 && res.message) {
  }
  return res
}

export default {
  post (url, data, noNeed) {
    let _header = {}
    if (noNeed) {
      _header = {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json'
      }
    } else {
      _header = {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
      }
    }
    return axios({
      method: 'post',
      url,
      data: data,
      timeout: 30000,
      headers: _header
    }).then(checkStatus).then(checkCode)
  },
  get (url, params, noNeed) {
    let _header = {}
    if (noNeed) {
      _header = {
        'X-Requested-With': 'XMLHttpRequest'
      }
    } else {
      _header = {
        'X-Requested-With': 'XMLHttpRequest',
        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
      }
    }
    return axios({
      method: 'get',
      url,
      params,
      timeout: 30000,
      headers: _header
    }).then(checkStatus).then(checkCode)
  }
}
