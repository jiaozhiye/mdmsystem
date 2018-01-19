<template>
<nav class="head-nav">
   <ul class="clearFix">
        <li v-for="(item, key) in list" :key="key" :class="{active: key == curIndex}">
            <router-link :to="item.link">
                <i class="icon" :class="'graph-' + item.iconName"></i>
                <span>{{ item.title }}</span>
            </router-link>
        </li>
    </ul> 
</nav>
</template>

<script>
import {mapActions, mapGetters} from 'vuex'
import {getUrlHash} from 'common/js/tools'

export default {
    name: 'HeadNav',
    data(){
        return {
            curIndex: 0,
            list: [
                { // 一级
                    title: '首页',
                    link: '/home',
                    iconName: 'home',
                    list: [
                        { // 二级
                            title: '系统门户',
                            link: '',
                            iconName: 'location',
                            list: [
                                { // 三级
                                    title: '部门管理',
                                    link: '/home/dept',
                                    iconName: ''
                                },
                                {
                                    title: '员工管理',
                                    link: '/home/employ',
                                    iconName: ''
                                }
                            ]
                        }
                    ]
                },
                {
                    title: '任务',
                    link: '/tasks',
                    iconName: 'task',
                    list: [
                        {
                            title: '任务社区',
                            link: '',
                            iconName: 'menu',
                            list: [
                                {
                                    title: '我的任务',
                                    link: '/tasks/my',
                                    iconName: ''
                                },
                                {
                                    title: '关注任务',
                                    link: '/tasks/follow',
                                    iconName: ''
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    },
    created(){
        this.iterFunc(this.list, '')
        this.setNavInfo()
    },
    watch: {
        $route(to, from){
            if (to.path.split('/').length < 3){
                this.setNavInfo()
            }
        }
    },
    methods: {
        ...mapActions([
            'createNavInfo',
            'changeNavtActive'
        ]),
        setNavInfo(){
            let _hash = getUrlHash()
            this.curIndex = this.list.findIndex(item => {
                return item.link === '/' + _hash.split('/')[1]
            })
            // vuex 设置导航菜单信息
            this.createNavInfo(this.list[this.curIndex].list)
            if (!(_hash.split('/').length >= 3 && _hash.split('/')[2] != '')){
                _hash = this.list[this.curIndex].list[0].list[0].link
            }
            // vuex 切换导航菜单选中状态
            this.changeNavtActive(_hash)
        },
        iterFunc(arr, str){
            for (var i = 0; i < arr.length; i++){
                arr[i].index = str + i
                if (_.isArray(arr[i].list)){
                    this.iterFunc(arr[i].list, arr[i].index + '-')
                }
            }
        }
    }
}
</script>

<style>
.head-nav ul li {
    float: left;
}
.head-nav ul li a {
    display: block;
    padding: 0 20px;
    height: 50px;
    line-height: 50px;
    -webkit-transition: all .3s ease;
    transition: all .3s ease;
}
.head-nav ul li a:hover,
.head-nav ul li.active a {
    background-color: #02aed9;
}
.head-nav ul li a i.icon {
    height: 16px;
    width: 16px;
    margin-top: -3px;
}
.head-nav ul li a span {
    margin-left: 6px;
    font-size: 16px;
    color: #fff;
}

.head-nav ul li a i.graph-home {
    background-position: 0 0;
}
.head-nav ul li a i.graph-task {
    background-position: -96px 0;
}
</style>