/**
 * @Author: jzy
 * @Date: 2017/9/19
 * @Last Modified by: jzy
 * @Last Modified time: 2017/9/19
 */
import * as types from './types'

const mutations = {
    [types.NAVINFO](state, payload){
        state.navInfo = payload.info
    },
    [types.NAVACTIVE](state, payload){
        state.defaultActive = payload.info
    }
}

export default mutations