import axios from '@/utils/myaxios.js'
export const getAllGoodsList = (obj) => {
  return axios({
    method: 'get',
    url: 'goods',
    params: obj
  })
}
