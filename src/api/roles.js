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

export const getAllRoleList = () => {
  return axios({
    url: 'roles'
  })
}

export const deleteRightById = (roleid, rightid) => {
  return axios({
    method: 'delete',
    url: `roles/${roleid}/rights/${rightid}`
  })
}

export const grantRightByRoleId = (roleid, rids) => {
  return axios({
    method: 'post',
    url: `roles/${roleid}/rights`,
    data: {
      rids: rids
    }
  })
}
export const addRole = (roleobj) => {
  return axios({
    method: 'post',
    url: 'roles',
    data: roleobj
  })
}
