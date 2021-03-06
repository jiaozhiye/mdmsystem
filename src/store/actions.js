/**
 * @Author: jzy
 * @Date: 2017/9/19
 * @Last Modified by: jzy
 * @Last Modified time: 2017/9/19
 */
import * as types from './types'

const actions = {
    createPersonalInfo ({commit}, params){
        commit({
            type: types.PERSONAL,
            info: params
        })
    },
    createNavInfo ({commit}, params){
        commit({
            type: types.NAVINFO,
            info: params
        })
    },
    setBtnLoading ({commit}, params){
        commit({
            type: types.BUTTON_LOADING,
            info: params
        })
    },
    setLeaveRemind ({commit}, params){
        commit({
            type: types.LEAVE_REMIND,
            info: params
        })
    }
}

export default actions