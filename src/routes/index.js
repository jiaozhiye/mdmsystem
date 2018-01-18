const Home = () => import('components/Home.vue')

const routes = {
    routes: [
        {
            path: '/home',
            component: Home,
            children: [
                {
                    path: '/home/dept',
                    component: Home
                },
                {
                    path: '/home/employ',
                    component: Home
                }
            ]
        },
        {
            path: '/tasks',
            component: Home,
            children: [
                {
                    path: '/tasks/my',
                    component: Home
                },
                {
                    path: '/tasks/follow',
                    component: Home
                }
            ]
        },
        {
            path: '*',
            redirect: '/home'
        }
    ]
}

 export default routes