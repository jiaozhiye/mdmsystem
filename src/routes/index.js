const Home = () => import('components/Home.vue')
const DeptManager = () => import('components/DeptManager.vue')
const EmployManager = () => import('components/EmployManager.vue')
const PowerManager = () => import('components/PowerManager.vue')
const StoreManager = () => import('components/StoreManager.vue')

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
            path: '*',
            redirect: '/sys_setting'
        }
    ]
}

 export default routes