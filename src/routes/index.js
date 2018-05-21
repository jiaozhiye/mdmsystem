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

const routes = {
    routes: [
        // 系统管理
        {
            path: '/sys_setting',
            component: DeptManager
        },
        {
            path: '/sys_setting/dept_manger',
            component: DeptManager
        },
        {
            path: '/sys_setting/staff_manager',
            component: EmployManager
        },
        {
            path: '/sys_setting/job_manager',
            component: PowerManager
        },
        {
            path: '/sys_setting/store_manager',
            component: StoreManager
        },
        {
            path: '/sys_setting/gdtype_manager',
            component: GoodsTypeManager
        },
        {
            path: '/sys_setting/mtype_manager',
            component: StuffTypeManager
        },
        {
            path: '/sys_setting/unit_manager',
            component: UnitManager
        },
        {
            path: '/sys_setting/goods_manager',
            component: GoodsManager
        },
        {
            path: '/sys_setting/material_manager',
            component: MaterialManager
        },
        {
            path: '/sys_setting/bom_manager',
            component: RelationManager
        },
        {
            path: '/sys_setting/per_setting',
            component: PersonalSetting
        },
        // 店长管理
        {
            path: '/storer_manager',
            component: DayOrderManager
        },
        // {
        //     path: '/storer_manager/imp_sale',
        //     component: ImportSaleManager
        // },
        {
            path: '/storer_manager/day_order',
            component: DayOrderManager
        },
        {
            path: '/storer_manager/material_order/:id',
            component: MaterialOrderManager
        },
        {
            path: '/storer_manager/refund_order',
            component: ReturnOrderManager
        },
        {
            path: '/storer_manager/store_order_list',
            component: StoreOrderManager
        },
        {
            path: '/storer_manager/store_receive_material',
            component: ReceivePutManager
        },
        {
            path: '/storer_manager/store_task_inventory',
            component: InventoryManager
        },
        // 安全存量
        {
            path: '/sstock_manager',
            component: StockManager
        },
        {
            path: '/sstock_manager/budget_manager',
            component: StockManager
        },
        // 物流管理
        {
            path: '/logistics_manager',
            component: LogisticsManager
        },
        {
            path: '/logistics_manager/logistics_store_order',
            component: LogisticsManager
        },
        {
            path: '/logistics_manager/logistics_mgr_out_order_3',
            component: OutDepotManager
        },
        {
            path: '/logistics_manager/logistics_return_order',
            component: LogisticsRetOrdManager
        },
        // 库存管理
        {
            path: '/stock_manager_1',
            component: DepotManager
        },
        {
            path: '/stock_manager_1/Warehouse_manager_3',
            component: DepotManager
        },
        {
            path: '/stock_manager_1/warehouse_balance',
            component: StockBalanceManager
        },
        {
            path: '/stock_manager_1/warehouse_movement',
            component: MoveDepotManager
        }
        // {
        //     path: '*',
        //     redirect: '/sys_setting'
        // }
    ]
}

export default routes