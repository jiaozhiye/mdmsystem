import axios from 'axios'
import qs from 'qs'
import common from 'assets/js/common'
import store from '../store'
import { Message } from 'element-ui'

console.info(common.env)

const instance = axios.create({
    baseURL: common.serverUrl,
    timeout: 5000,
    // withCredentials: true, // 跨域请求时是否需要使用凭证
    paramsSerializer: params => {
        // 序列化 GET 请求参数 -> a: [1, 2] => a=1&a=2
        return qs.stringify(params, { arrayFormat: 'repeat' })
    },
    // transformRequest: [data => {
    //     // 在向服务器发送前修改请求数据，只适用于 POST
    //     return qs.stringify(data, { arrayFormat: 'repeat' })
    // }],
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
})

// http 请求拦截器
instance.interceptors.request.use(config => {
    store.dispatch('setBtnLoading', !0)
    return config
}, error => {
    store.dispatch('setBtnLoading', !1)
    Message.error('数据加载超时！')
    return Promise.reject(error)
})

// http 响应拦截器
instance.interceptors.response.use(response => {
    store.dispatch('setBtnLoading', !1)
    return response
}, error => {
    store.dispatch('setBtnLoading', !1)
    Message.error('数据加载失败！')
    return Promise.reject(error)
})

/**
 * 向后台请求数据的 API 接口
 */
// 登录接口
export const loginSystem = params => instance.post('/login', params)

// 退出接口
export const logoutSystem = () => instance.get('/mgr/user/loginout')

// 获取登录用户信息
export const getUserInfo = () => instance.get('/mgr/user/getUserInfo')

// 个人设置接口(获取个人详细信息)
export const getUserAllInfo = () => instance.get('/mgr/user/showMyDetail')

// 修改个人信息
export const updateUserInfo = params => instance.post('/mgr/user/modifyMyPwd', params)

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
export const savePowerRecord = params => instance.post('/mgr/job/add', params)

// 获取职务权限列表
export const getPowerList = () => instance.get('/mgr/job/showResource')

// 根据ID获取职务信息
export const getPowerRecord = params => instance.get('/mgr/job/showById', {params})

// 更新职务信息
export const updatePowerRecord = params => instance.post('/mgr/job/updateById', params)

// 获取门店信息
export const getStoreInfo = params => instance.get('/mgr/store/query', {params})

// 停用门店
export const stopStoreRecord = params => instance.get('/mgr/store/stop', {params})

// 删除门店记录
export const delStoreRecord = params => instance.get('mgr/store/deleteById', {params})

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
export const getUnitInfo = params => instance.get('/mgr/goodsUnit/query', {params})

// 删除单位类别信息
export const delUnitRecord = params => instance.get('/mgr/goodsUnit/deleteById', {params})

// 更新单位分类排序
export const updateUnitSort = params => instance.post('/mgr/goodsUnit/sort', params)

// 保存单位分类信息
export const saveUnitInfo = params => instance.post('/mgr/goodsUnit/add', params)

// 根据ID获取单位分类信息
export const getUnitRecord = params => instance.get('/mgr/goodsUnit/showById', {params})

// 更新单位分类信息
export const updateUnitRecord = params => instance.post('/mgr/goodsUnit/updateById', params)

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

// 获取安全存储数据列表
export const getSecurityStockInfo = params => instance.get('mgr/dailySummary/getSecurityStock', {params})

// 判断是否已导入销售数据
export const getHasDailySummary = params => instance.get('mgr/dailySummary/hasDailySummary', {params})

// 获取导入的销售数据列表
export const getScaleImportedInfo = params => instance.get('mgr/dailySummary/getDailySummary', {params})

// 获取商品类别树
export const getGoodsTree = () => instance.get('/mgr/goodsAndGoodsTypeTree')

// 保存商品分类
export const saveGoodsClassify = params => instance.post('/mgr/storeOrderManager/createOrder', params)

// 获取原材料树
export const getMaterialsTree = params => instance.get('mgr/materialAndMaterialTypeTreeCtrl', {params})

// 获取编辑的商品原材料列表
export const getEditedMaterial = params => instance.get('mgr/storeOrderManager/goodsToMaterial', {params})

// 保存编辑的商品原材料数据
export const saveEditedMaterial = params => instance.post('mgr/storeOrderManager/addStoreOrderMaterial', params)

// 获取订单列表
export const getOrderInfo = params => instance.get('/mgr/logistics/storeOrder/queryOrders', {params})

// 获取订单类型列表
export const getOrderTypeList = () => instance.get('/mgr/dict/showList?dict=store_order_type')

// 获取门店列表
export const getStoreList = () => instance.get('/mgr/common/store/showList')

// 获取订单状态列表
export const getOrderStateList = params => instance.get('/mgr/dict/showList2', {params})

// 新增仓库记录
export const saveDepotRecord = params => instance.post('/mgr/warehouse/warehouseManager/add', params)

// 获取仓库信息列表
export const getDepotInfo = params => instance.get('/mgr/warehouse/warehouseManager/list', {params})

// 修改仓库状态
export const stopDepotRecord = params => instance.get('/mgr/warehouse/warehouseManager/enabel', {params})

// 删除仓库记录
export const delDepotRecord = params => instance.get('/mgr/warehouse/warehouseManager/deleteById', {params})

// 根据ID获取仓库记录
export const getDepotRecord = params => instance.get('/mgr/warehouse/warehouseManager/showById', {params})

// 更新仓库记录
export const updateDepotRecord = params => instance.post('/mgr/warehouse/warehouseManager/updateById', params)

// 获取门店订单详情
export const getStoreOrderDetail = params => instance.get('/mgr/storeOrderCtrl/showOrderDetailsById', {params})

// 获取物流订单详情
export const getLogisticOrderDetail = params => instance.get('/mgr/logistics/storeOrder/showOrderDetailsById', {params})

// 退回物流订单
export const returnLogisticOrder = params => instance.get('/mgr/logistics/storeOrder/closeOrder', {params})

// 接收订单
export const receiveOrder = params => instance.get('/mgr/logistics/storeOrder/accept', {params})

// 生成出库订单
export const createOutOrder = params => instance.get('/mgr/logistics/storeOrder/buildOutOrder', {params})

// 选择仓库
export const getDepotList = () => instance.get('/mgr/common/selectDataBuilder/showWarehourseList')

// 获取出库单列表
export const getOutOrderInfo = params => instance.get('/mgr/logistics/outWarehouseOrder/queryList', {params})

// 获取出库单详情
export const getOutOrderDetail = params => instance.get('/mgr/logistics/outWarehouseOrder/showDetailsById', {params})

// 关闭(保存)出库单
export const closeOutOrder = params => instance.post('/mgr/logistics/outWarehouseOrder/save', params)

// 获取出库单原材料树结构
export const getMaterialTreeForOutDepot = params => instance.get('/mgr/warehouse/warehouseStockMaterialTree', {params})

// 获取盘点原材料树
export const getMaterialInventoryTree = params => instance('mgr/storeStock/getMaterialAll', {params})

// 保存盘点原材料信息
export const saveInventoryMaterial = params => instance.post('mgr/storeStock/editStock', params)

// 出库 + 保存出库单
export const outDepotSaveOrder = params => instance.post('/mgr/logistics/outWarehouseOrder/out', params)

// 获取门店出库单
export const getReceiveOrder = () => instance.get('/mgr/store/storeOrderReceiver/query')

// 获取接收订单详情
export const getReceiveOrderDetail = params => instance.get('/mgr/store/storeOrderReceiver/showDetailById', {params})

// 保存接收订单信息
export const saveReceiveOrder = params => instance.post('/mgr/store/storeOrderReceiver/accept', params)

// 获取退货单状态
export const getRetOrdStateList = () => instance.get('mgr/dict/showList3?dict=500')

// 获取退货单列表
export const getReturnOrderInfo = params => instance.get('/mgr/store/returnGoods/queryOrderListByStore', {params})

// 获取退货单原材料树结构
export const getReturnOrderTree = () => instance.get('/mgr/store/returnGoods/getMaterialTree')

// 保存退货单
export const saveReturnOrder = params => instance.post('/mgr/store/returnGoods/createOrder', params)

// 获取退货单详细信息
export const getReturnOrderDetail = params => instance.get('/mgr/store/returnGoods/showDetailByOrderIdAndStore', {params})

// 更新退货单
export const updateReturnOrder = params => instance.post('/mgr/store/returnGoods/createOrder', params)

// 获取物流退货单列表
export const getLogisticsRetOrdInfo = params => instance.get('/mgr/store/returnGoods/queryOrderListByLogistics', {params})

// 获取物流退货单详情
export const getLogisticsRetOrdDetail = params => instance.get('/mgr/store/returnGoods/showDetailByOrderIdAndLogistics', {params})

// 接收物流退货单
export const receiveLogisticsRetOrd = params => instance.post('/mgr/store/returnGoods/doReturn', params)

// 完成物流退货单
export const completeLogisticsRetOrd = params => instance.post('/mgr/store/returnGoods/finishOrder', params)

// 获取仓库列表
export const getDepotInfoSelect = () => instance.get('/mgr/common/selectDataBuilder/showWarehourseList')

// 获取库存余额列表
export const getStockBalanceList = params => instance.get('/mgr/warehouse/warehouseStock/queryBalanceList', {params})

// 获取仓库下原材料
export const getDepotMaterialInfo = params => instance.get('mgr/warehouse/warehouseMovement/queryBalanceList', {params})

// 获取原材料分类
export const getMaterialClassify = () => instance.get('/mgr/common/selectDataBuilder/showMaterialType')

// 创建废弃原材料订单
export const createScrapMaterialOrder = params => instance.post('mgr/store/storeScrapManager/createOrder', params)

// 获取废弃单原材料树
export const getScrapMaterialsTree = params => instance.get('mgr/store/storeScrapManager/getTree', {params})

// 获取编辑过的废弃单原料列表
export const getEditedScrapMaterial = params => instance.get('mgr/store/storeScrapManager/showDetailList', {params})

// 保存废弃单原料数据
export const saveEditedScrapMaterial = params =>instance.post('mgr/store/storeScrapManager/addStoreScrapMaterial', params)

// 获取废弃单状态
export const getScrapOrderStateList = () => instance.get('mgr/dict/showList3?dict=600')

// 获取废弃单订单列表
export const getScrapOrderInfo = params => instance.get('mgr/store/storeScrapManager/queryListByStore', {params})

// 改变废弃单状态
export const changeScrapOrderState = params => instance.get('mgr/store/storeScrapManager/cancelOrder', {params})

// 保存移库单
export const saveMoveDepotInfo = params => instance.post('/mgr/warehouse/warehouseMovement/save', params)

// 提交移库单
export const submitMoveDepotInfo = params => instance.post('/mgr/warehouse/warehouseMovement/submit', params)

// 获取移库单列表
export const getMoveDepotInfo = params => instance.get('/mgr/warehouse/warehouseMovement/queryList', {params})

// 获取移库单物品列表
export const getMoveDepotList = params => instance.get('/mgr/warehouse/warehouseMovement/showDetailById', {params})

// 获取对账单信息列表
export const getReconciliationInfo = params => instance.get('/mgr/logistics/reconciliation', {params})

// 获取对账下的仓库列表
export const getStoreListForAccount = () => instance.get('/mgr/common/store/showList2')

// 获取门店库存信息
export const getstoreStockInfo = () => instance.get('/mgr/store/storeStockManager/showBalance')

// 关闭物流退货单
export const cancleReturnOrder = params => instance.get('mgr/store/returnGoods/cancleOrder', {params})

// 获取物流废弃单列表
export const getLogisticScrapOrderInfo = params => instance.get('/mgr/logistics/storeScrap/queryListByLogistics', {params})

// 取消物流废弃单 - 关闭物流废弃单
export const changeLogisticScrapOrderState = params => instance.get('/mgr/logistics/storeScrap/closeOrder', {params})

// 获取物流废弃单原材料详情
export const getLogisticScrapMaterial = params => instance.get('/mgr/logistics/storeScrap/showDetailList', {params})

// 接收物流废弃单
export const receiveEditedScrapMaterial = params => instance.get('/mgr/logistics/storeScrap/accept', {params})

// 打印出库单
export const printOutOrder = params => instance.get('mgr/print/print/printOutgoingGoodsOrder', {params})

// 打印商品送货单
export const printGoodsOrder = params => instance.get('mgr/print/print/printSendGoodsOrder', {params})

// 获取打印订单类型
export const printOrderType = () => instance.get('mgr/dict/showList3?dict=700')

// 获取打印单历史列表
export const getPrintOrderInfo = params => instance.get('mgr/print/print/getPrintDetail', {params})

// 日订单的订单类型
export const getDayOrderType = () => instance.get('/mgr/dict/showList2?dict=store_order_type')

// 获取门店订单列表
export const getStoreOrderInfo = params => instance.get('/mgr/storeOrderCtrl/queryOrders', {params})

// 撤销门店订单
export const cancelStoreOrder = params => instance.get('/mgr/storeOrderCtrl/cancelOrder', {params})

// 获取城市的列表
export const getCitysInfo = () => instance.get('mgr/dict/showList3?dict=70')

// 出库单查询列表
export const getLogisticsOutOrder = params => instance.get('/mgr/logistics/outWarehouseOrderStatistics/statisticsList', {params})

// 获取出库单状态
export const getOutDepotStateList = () => instance.get('/mgr/dict/showList2?dict=logistics_view_order_type')

// 获取出库单详情信息
export const getOutDepotOrderInfo = params => instance.get('/mgr/logistics/outWarehouseOrderStatistics/showDetailById', {params})

// 添加原材料的订单类型
export const getOrderTypeInfo = () => instance.get('mgr/dict/showList3?dict=1100')

// 添加原材料的存储条件
export const getStoreConditionInfo = () => instance.get('mgr/dict/showList3?dict=1000')

// 添加原材料的单位数组
export const getMaterialUnitInfo = () => instance.get('mgr/dict/getUnit?dict=material')

// 盘点前时候否需要接收入库
export const checkReceiveDepot = () => instance.get('mgr/storeStock/isAllow')
// 157







