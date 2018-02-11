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
const ImportSaleManager = () => import('components/ImportSaleManager.vue')
const StockManager = () => import('components/StockManager.vue')

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
            component: ImportSaleManager
        },
        {
            path: '/storer_manager/imp_sale',
            component: ImportSaleManager
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
        // {
        //     path: '*',
        //     redirect: '/sys_setting'
        // }
    ]
}

export default routes