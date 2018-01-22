const Home = () => import('components/Home.vue')
const DeptManager = () => import('components/DeptManager.vue')
const EmployManager = () => import('components/EmployManager.vue')

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
            path: '*',
            redirect: '/sys_setting'
        }
    ]
}

 export default routes