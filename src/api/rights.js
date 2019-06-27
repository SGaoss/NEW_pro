// import axios from 'axios'
// // 设置基准路径
// axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'

// axios.interceptors.request.use(function (config) {
//   var token = localStorage.getItem('itcast_pro_token')
//   if (token) {
//     config.headers['Authorization'] = token
//   }

//   return config
// }, function (error) {
//   return Promise.reject(error)
// })

import axios from '@/utils/myaxios.js'

export const getAllRightsList = (type) => {
  return axios({
    url: `rights/${type}`

  })
}

export const getLeftMenu = () => {
  return axios({
    url: 'menus'
  })
}
