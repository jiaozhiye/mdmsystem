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

// 保存门店信息
export const saveStoreRecord = params => instance.post('/mgr/store/add', params)

// 根据ID获取门店信息
export const getStoreRecord = params => instance.get('/mgr/store/showById', {params})

// 更新门店信息
export const updateStoreRecord = params => instance.post('/mgr/store/updateById', params)

// 获取商品类别信息
export const getGdtypeInfo = params => instance.get('/mgr/goodsType/query', {params})

// 删除商品类别信息
export const delGdtypeRecord = params => instance.get('/mgr/goodsType/deleteById', {params})

// 获取商品类别一级分类
export const getFirGdtypeInfo = () => instance.get('/mgr/goodsType/getFirstType')

// 保存商品分类信息
export const saveGdtypeInfo = params => instance.post('/mgr/goodsType/add', params)

// 根据ID获取商品分类信息
export const getGdtypeRecord = params => instance.get('/mgr/goodsType/showById', {params})

// 更新商品分类信息
export const updateGdtypeRecord = params => instance.post('/mgr/goodsType/updateById', params)

// 更新商品分类排序
export const updateGdtypeSort = params => instance.post('/mgr/goodsType/sort', params)

// 获取原材料类别信息
export const getStuffTypeInfo = params => instance.get('/mgr/materialType/query', {params})

// 删除原材料类别信息
export const delStuffTypeRecord = params => instance.get('/mgr/materialType/deleteById', {params})

// 更新原材料分类排序
export const updateStuffTypeSort = params => instance.post('/mgr/materialType/sort', params)

// 获取原材料类别一级分类
export const getFirStuffTypeInfo = () => instance.get('/mgr/materialType/getFirstType')

// 保存原材料分类信息
export const saveStuffTypeInfo = params => instance.post('/mgr/materialType/add', params)

// 根据ID获取原材料分类信息
export const getStuffTypeRecord = params => instance.get('/mgr/materialType/showById', {params})

// 更新原材料分类信息
export const updateStuffTypeRecord = params => instance.post('/mgr/materialType/updateById', params)

// 获取单位类别信息
export const getUnitTypeInfo = params => instance.get('/mgr/goodsUnit/query', {params})

// 删除单位类别信息
export const delUnitTypeRecord = params => instance.get('/mgr/goodsUnit/deleteById', {params})

// 更新单位分类排序
export const updateUnitTypeSort = params => instance.post('/mgr/goodsUnit/sort', params)

// 保存单位分类信息
export const saveUnitTypeInfo = params => instance.post('/mgr/goodsUnit/add', params)

// 根据ID获取单位分类信息
export const getUnitTypeRecord = params => instance.get('/mgr/goodsUnit/showById', {params})

// 更新单位分类信息
export const updateUnitTypeRecord = params => instance.post('/mgr/goodsUnit/updateById', params)

// 获取商品分类树形结构
export const getGdtypeTree = () => instance.get('/mgr/goods/showGoodsTypeTree')

// 获取商品列表信息
export const getGoodsInfo = params => instance.get('/mgr/goods/query', {params})

// 删除商品记录
export const delGoodsRecord = params => instance.get('/mgr/goods/stop', {params})

// 批量删除商品记录
export const batchDelGoodsRecord = params => instance.get('/mgr/goods/deleteByIds', {params})

// 保存商品信息
export const saveGoodsInfo = params => instance.post('/mgr/goods/add', params)

// 获取商品库存类型列表
export const getInventoryList = () => instance.get('/mgr/goodsInitForm/showWmTypeList')

// 获取商品单位列表
export const getUnitList = () => instance.get('/mgr/goodsInitForm/showUnitList')

// 根据ID获取商品信息
export const getGoodsRecord = params => instance.get('/mgr/goods/showById', {params})

// 更新商品信息
export const updateGoodsRecord = params => instance.post('/mgr/goods/updateById', params)

// 获取原材料信息
export const getMaterialInfo = params => instance.get('/mgr/material/query', {params})

// 获取原材料分类树
export const getMaterialTree = () => instance.get('/mgr/material/showMaterialTypeTree')

// 批量删除原材料记录
export const batchDelMaterialRecord = params => instance.get('/mgr/material/deleteByIds', {params})

// 获取原材料库存类型列表
export const getStuffToryList = params => instance.get('/mgr/goodsInitForm/showMaterialWmTypeList', {params})

// 删除原材料记录
export const delMaterialRecord = params => instance.get('/mgr/material/stop', {params})

// 获取原材料分类(下拉菜单)
export const getMaterialSelTree = params => instance.get('/mgr/material/showMaterialTypeTreeForm', {params})

// 保存原材料信息
export const saveMaterialInfo = params => instance.post('/mgr/material/add', params)

// 根据ID获取原材料信息
export const getMaterialRecord = params => instance.get('/mgr/material/showById', {params})

// 更新原材料记录
export const updateMaterialRecord = params => instance.post('/mgr/material/updateById', params)

// 获取商品分类树结构(关联)
export const getGoodsTypeTree = () => instance.get('/mgr/bomMgr/showGoodsTypeTree')

// 获取商品列表(关联)
export const getGoodsList = params => instance.get('/mgr/bomMgr/queryGoodsList', {params})

// 获取商品库存类型(关联)
export const getGdToryList = params => instance.get('/mgr/goodsInitForm/showWmTypeList', {params})

// 获取配方状态(关联)
export const getFormulaList = () => instance.get('/mgr/goodsInitForm/showBomStatusList')

// 获取配方(原材料)信息
export const getFormulaInfo = params => instance.get('/mgr/bomMgr/queryMaterialList', {params})

// 根据ID，获取商品配方(原材料)列表
export const getGoodsFormulaInfo = params => instance.get('/mgr/bomMgr/queryBomByGoodsId', {params})

// 保存商品配方(原材料)关联
export const saveGdRelation = params => instance.post('/mgr/bomMgr/save', params)







