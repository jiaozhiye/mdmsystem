import router from './index'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css'  // Progress 进度条样式

import store from '../store'
import { MessageBox  } from 'element-ui'

const messageConfirm = next => {
    MessageBox.confirm('您有未保存的数据，确认离开此页面吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
    }).then(() => {
        next()
    }).catch(() => {
        NProgress.done()
        next(false)
    })
}

router.beforeEach((to, from, next) => {
    // 开启 Progress
    NProgress.start()
    if (!store.state.isLeaveRemind){
        next()
    } else {
        messageConfirm(next)
    }
})

router.afterEach(() => {
    store.dispatch('setLeaveRemind', !1)
    // 结束 Progress
    NProgress.done() 
})
