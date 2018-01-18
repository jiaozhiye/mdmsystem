/**
 * @Author: jzy
 * @Date: 2017/9/19
 * @Last Modified by: jzy
 * @Last Modified time: 2017/9/19
 */
import * as types from './types'

const actions = {
    createNavInfo ({commit}, params){
        commit({
            type: types.NAVINFO,
            info: params
        })
    },
    changeNavtActive ({commit}, params){
        commit({
            type: types.NAVACTIVE,
            info: params
        })
    }
}

export default actions