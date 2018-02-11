/**
 * @Author: jzy
 * @Date: 2017/9/19
 * @Last Modified by: jzy
 * @Last Modified time: 2017/9/19
 */
const getters = {
    getPersonalInfo (state){
        return state.personalInfo
    },
    getNavInfo (state){
        return state.navInfo
    },
    getNavActive (state){
        return state.defaultActive
    }
}

export default getters