// import axios from 'axios'

// axios.defaults.baseURL = 'http://localhost:8888/api/private/v1'
// axios.interceptors.request.use(function (config) {
//   var token = localStorage.getItem('itcast_pro_token')
//   config.headers['Authorization'] = token

//   return config
// }, function (error) {
//   return Promise.reject(error)
// })
import axios from '@/utils/myaxios.js'

export const userlogin = (data) => {
  return axios({
    url: 'login',
    method: 'post',
    data: data
  })
}

export const getAllList = (params) => {
  return axios({
    url: 'users',
    params: params
  })
}
export const addUser = (data) => {
  return axios({
    method: 'post',
    url: 'users',
    data
  })
}
export const editUser = (data) => {
  return axios({
    method: 'put',
    url: `users/${data.id}`,
    data
  })
}
export const deleteUser = (id) => {
  return axios({
    method: 'delete',
    url: `users/${id}`
  })
}
export const updateUserStatus = (id, type) => {
  return axios({
    method: 'put',
    url: `users/${id}/state/${type}`
  })
}
export const grantUserRole = (id, rid) => {
  return axios({
    method: 'put',
    url: `users/${id}/role`,
    data: {
      rid: rid
    }
  })
}
