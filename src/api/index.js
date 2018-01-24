import axios from 'axios'
import qs from 'qs'
import common from 'common/js/common'

console.log(common.env)

const instance = axios.create({
    baseURL: common.serverUrl,
    timeout: 4000,
    paramsSerializer: function(params){
        // 序列化 get 请求参数 -> a: [1, 2] => a=1&a=2
        return qs.stringify(params, {arrayFormat: 'repeat'})
    },
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
})

/**
 * 向后台请求数据的 API 接口
 */

// 获取导航菜单
export const getMenuInfo = () => instance.get('/mgr/menu')

// 获取部门信息列表
export const getDeptInfo = () => instance.get('/mgr/dept/tree')

// 删除部门记录
export const delDeptRecord = params => instance.get('/mgr/dept/deleteByid', {params})

// 保存部门信息
export const saveDeptInfo = params => instance.get('/mgr/dept/save', {params})

// 根据ID获取部门信息
export const getDeptRecord = params => instance.get('/mgr/dept/showById', {params})

// 更新部门信息
export const updateDeptRecord = params => instance.get('/mgr/dept/updateById', {params})

// 部门搜索
export const searchDeptInfo = params => instance.get('/mgr/dept/query', {params})

// 获取职务信息(搜索)
export const getJobInfo = () => instance.get('/mgr/job/showJobs')

// 获取部门信息(搜索)
export const getDeptList = () => instance.get('/mgr/dept/toWebSearch')

// 获取员工信息列表(分页)
export const getEmployInfo = params => instance.get('/mgr/staff/query', {params})

// 删除员工记录
export const delEmployRecord = params => instance.get('/mgr/staff/deleteById', {params})

// 保存员工信息
export const saveEmployRecord = params => instance.get('/mgr/staff/add', {params})

// 更新员工信息
export const updateEmployRecord = params => instance.get('/mgr/staff/updateById', {params})

// 根据ID获取员工信息
export const getEmployRecord = params => instance.get('/mgr/staff/showById', {params})

// 获取职务列表信息
export const getPowerInfo = () => instance.get('/mgr/job/list')

// 删除职务信息记录
export const delPowerRecord = params => instance.get('/mgr/job/deleteById', {params})

// 保存职务信息
export const savePowerRecord = params => instance.post('', params)

// 获取职务权限列表
export const getPowerList = () => instance.get('/mgr/job/showResource')

// 根据ID获取职务信息
export const getPowerRecord = params => instance.get('', {params})

// 更新职务信息
export const updatePowerRecord = params => instance.post('', params)

// 获取门店信息
export const getStoreInfo = params => instance.get('/mgr/store/query', {params})

// 删除门店记录
export const delStoreRecord = params => instance.get('/mgr/store/stop', {params})







