import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

// 动态加载路由组件
const Home = () => import('components/Home.vue')
const DeptManager = () => import('components/DeptManager.vue')
const EmployManager = () => import('components/EmployManager.vue')
const PowerManager = () => import('components/PowerManager.vue')
const StoreManager = () => import('components/StoreManager.vue')
const GoodsTypeManager = () => import('components/GoodsTypeManager.vue')
const StuffTypeManager = () => import('components/StuffTypeManager.vue')
const UnitManager = () => import('components/UnitManager.vue')
const GoodsManager = () => import('components/GoodsManager.vue')
const MaterialManager = () => import('components/MaterialManager.vue')
const RelationManager = () => import('components/RelationManager.vue')
const PersonalSetting = () => import('components/PersonalSetting.vue')
// const ImportSaleManager = () => import('components/ImportSaleManager.vue')
const StockManager = () => import('components/StockManager.vue')
const DayOrderManager = () => import('components/DayOrderManager.vue')
const MaterialOrderManager = () => import('components/MaterialOrderManager.vue')
const LogisticsManager = () => import('components/LogisticsManager.vue')
const DepotManager = () => import('components/DepotManager.vue')
const OutDepotManager = () => import('components/OutDepotManager.vue')
const ReturnOrderManager = () => import('components/ReturnOrderManager.vue')
const StoreOrderManager = () => import('components/StoreOrderManager.vue')
const InventoryManager = () => import('components/InventoryManager.vue')
const ReceivePutManager = () => import('components/ReceivePutManager.vue')
const LogisticsRetOrdManager =() => import('components/LogisticsRetOrdManager.vue')
const StockBalanceManager = () => import('components/StockBalanceManager.vue')
const MoveDepotManager = () => import('components/MoveDepotManager.vue')
const CreateMoveDepot = () => import('components/CreateMoveDepot.vue')
const ScrapOrderManager = () => import('components/ScrapOrderManager.vue')
const ScrapMaterialManager = () => import('components/ScrapMaterialManager.vue')
const ScrapOrderListManager = () => import('components/ScrapOrderListManager.vue')
const StoreAccountManager = () => import('components/StoreAccountManager.vue')
const StoreStockManager = () => import('components/StoreStockManager.vue')
const PrintHistoryManager = () => import('components/PrintHistoryManager.vue')
const OutOrderManager = () => import('components/OutOrderManager.vue')

// 路由列表
const routes = {
    routes: [
        // 系统管理
        {
            path: '/sys_setting',
            name: 'DeptManager', // 组织结构 -> 部门管理
            component: DeptManager
        },
        {
            path: '/sys_setting/dept_manger',
            name: 'DeptManager', // 组织结构 -> 部门管理
            component: DeptManager
        },
        {
            path: '/sys_setting/store_manager',
            name: 'StoreManager', // 组织结构 -> 门店管理
            component: StoreManager
        },
        {
            path: '/sys_setting/staff_manager',
            name: 'EmployManager', // 组织结构 -> 员工管理
            component: EmployManager
        },
        {
            path: '/sys_setting/job_manager',
            name: 'PowerManager', // 组织结构 -> 职务管理
            component: PowerManager
        },  
        {
            path: '/sys_setting/gdtype_manager',
            name: 'GoodsTypeManager', // 商品设置 -> 商品类别管理
            component: GoodsTypeManager
        },
        {
            path: '/sys_setting/mtype_manager',
            name: 'StuffTypeManager', // 商品设置 -> 商品原材料管理
            component: StuffTypeManager
        },
        {
            path: '/sys_setting/unit_manager',
            name: 'UnitManager', // 商品设置 -> 单位管理
            component: UnitManager
        },
        {
            path: '/sys_setting/goods_manager',
            name: 'GoodsManager', // 商品设置 -> 商品管理
            component: GoodsManager
        },
        {
            path: '/sys_setting/material_manager',
            name: 'MaterialManager', // 商品设置 -> 原料管理
            component: MaterialManager
        },
        {
            path: '/sys_setting/bom_manager',
            name: 'RelationManager', // 商品设置 -> 配方管理
            component: RelationManager
        },
        // 店长管理
        {
            path: '/storer_manager',
            name: 'DayOrderManager', // 订单管理 -> 日订单
            component: DayOrderManager
        },
        // {
        //     path: '/storer_manager/imp_sale',
        //     name: 'ImportSaleManager', // 订单管理 -> 导入
        //     component: ImportSaleManager
        // },
        {
            path: '/storer_manager/day_order',
            name: 'DayOrderManager', // 订单管理 -> 日订单
            component: DayOrderManager
        },
        {
            path: '/storer_manager/day_material_order/:id',
            name: 'MaterialOrderManager', // 订单管理 -> 日订单的下一步
            component: MaterialOrderManager
        },
        {
            path: '/storer_manager/refund_order',
            name: 'ReturnOrderManager', // 订单管理 -> 退货单
            component: ReturnOrderManager
        },
        {
            path: '/storer_manager/store_order_list',
            name: 'StoreOrderManager', // 订单管理 -> 订单列表
            component: StoreOrderManager
        },
        {
            path: '/storer_manager/store_receive_material',
            name: 'ReceivePutManager', // 库存管理 -> 接收入库
            component: ReceivePutManager
        },
        {
            path: '/storer_manager/store_task_inventory',
            name: 'InventoryManager', // 库存管理 -> 盘点
            component: InventoryManager
        },
        {
            path: '/storer_manager/store_stock_balance',
            name: 'StoreStockManager', // 库存管理 -> 门店库存
            component: StoreStockManager
        },
        { 
            path: '/storer_manager/scrap_order',
            name: 'ScrapOrderManager', // 废弃管理 -> 废弃单
            component: ScrapOrderManager
        },
        {
            path: '/storer_manager/scrap_material_order/:id',
            name: 'ScrapMaterialManager', // 废弃管理 -> 废弃单的下一步
            component: ScrapMaterialManager
        },
        { 
            path: '/storer_manager/scrap_order_list',
            name: 'ScrapOrderListManager', // 废弃管理 -> 废弃单列表
            component: ScrapOrderListManager,
            props: { menuType: 'store' }
        },
        // 安全存量
        {
            path: '/sstock_manager',
            name: 'StockManager', // 安全存量 -> 预估
            component: StockManager
        },
        {
            path: '/sstock_manager/budget_manager',
            name: 'StockManager', // 安全存量 -> 预估
            component: StockManager
        },
        // 物流管理
        {
            path: '/logistics_manager',
            name: 'LogisticsManager', // 订单管理 -> 门店订单
            component: LogisticsManager
        },
        {
            path: '/logistics_manager/logistics_store_order',
            name: 'LogisticsManager', // 订单管理 -> 门店订单
            component: LogisticsManager
        },
        {
            path: '/logistics_manager/logistics_store_reconciliation',
            name: 'StoreAccountManager', // 订单管理 -> 门店对账
            component: StoreAccountManager
        },
        {
            path: '/logistics_manager/logistics_mgr_out_order_3',
            name: 'OutDepotManager', // 出入库管理 -> 出库单
            component: OutDepotManager
        },
        {
            path: '/logistics_manager/logistics_mgr_out_order_list',
            name: 'OutOrderManager', // 出入库管理 -> 出库单查询
            component: OutOrderManager
        },
        {
            path: '/logistics_manager/logistics_return_order',
            name: 'LogisticsRetOrdManager', // 退货单 -> 物流退货单
            component: LogisticsRetOrdManager
        },
        {
            path: '/logistics_manager/logistica_scrap_order',
            name: 'ScrapOrderListManager', // 废弃管理 -> 废弃单列表
            component: ScrapOrderListManager,
            props: { menuType: 'logistic' }
        },
        {
            path: '/logistics_manager/print_history',
            name: 'PrintHistoryManager', // 打印管理 -> 打印历史
            component: PrintHistoryManager
        },
        // 库存管理
        {
            path: '/stock_manager_1',
            name: 'DepotManager', // 基础管理 -> 仓库管理
            component: DepotManager
        },
        {
            path: '/stock_manager_1/Warehouse_manager_3',
            name: 'DepotManager', // 基础管理 -> 仓库管理
            component: DepotManager
        },
        {
            path: '/stock_manager_1/warehouse_balance',
            name: 'StockBalanceManager', // 基础管理 -> 库存余额
            component: StockBalanceManager
        },
        {
            path: '/stock_manager_1/warehouse_movement',
            name: 'MoveDepotManager', // 基础管理 -> 移库
            component: MoveDepotManager
        },
        {
            path: '/stock_manager_1/create_movement',
            name: 'CreateMoveDepot', // 基础管理 -> 新建移库
            component: CreateMoveDepot
        },
        // 个人设置
        {
            path: '/sys_setting/per_setting',
            name: 'PersonalSetting', // 个人设置
            component: PersonalSetting
        },
        // {
        //     path: '*',
        //     redirect: '/sys_setting'
        // }
    ]
}

export default new VueRouter(routes)
