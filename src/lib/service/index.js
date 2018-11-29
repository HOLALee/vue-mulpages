/*引入axios-hk模块*/
import axios from '@/lib/axios-hk'
import CONSTANT from '@/lib/Constant'
import util from '@/lib/util'

export default {
  /**
   * queryDict
   * @param ddId  字典id
   * @param callback 
   */
  queryDict (ddId,callback) {
    let localData = localStorage.getItem(ddId)
    if(localData){
      // 如果已经有对应字典缓存数据
      if(typeof callback == 'function'){
        callback(JSON.parse(localData))
      }
    }else{
      // 没有缓存数据，从接口获取字典
      axios.get('/queryDict/1.0', {
        ddId: ddId
      }).then((res)=>{
        if(res.result[0].code == 0){
          let data = res.data
          let list = []
          for(var i = 0, l = data.length; i < l; i++){
            list.push({ value: data[i].DD_ITEM, text: data[i].DD_ITEM_NAME})
          }
          if(typeof callback == 'function'){
            callback(list)
            // 缓存字典
            localStorage.setItem(ddId,JSON.stringify(list))
          }else{
            alert('获取系统数据字典失败')
          }
        }
      })
    }    
  },
}