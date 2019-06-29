import axios from '@/utils/myaxios.js'
export const getAllGoodsList = (obj) => {
  return axios({
    method: 'get',
    url: 'goods',
    params: obj
  })
}
export const addGoodsInfo = (data) => {
  return axios({
    method: 'post',
    url: 'goods',
    data
  })
}
