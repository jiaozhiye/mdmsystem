const DeptManager = () => import('components/DeptManager.vue')
const EmployManager = () => import('components/EmployManager.vue')
const PowerManager = () => import('components/PowerManager.vue')
const StoreManager = () => import('components/StoreManager.vue')
const GoodsTypeManager = () => import('components/GoodsTypeManager.vue')
const StuffTypeManager = () => import('components/StuffTypeManager.vue')
const UnitTypeManager = () => import('components/UnitTypeManager.vue')
const GoodsManager = () => import('components/GoodsManager.vue')
const MaterialManager = () => import('components/MaterialManager.vue')
const RelationManager = () => import('components/RelationManager.vue')

const routes = {
    routes: [
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
            component: UnitTypeManager
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
            path: '*',
            redirect: '/sys_setting'
        }
    ]
}

 export default routes