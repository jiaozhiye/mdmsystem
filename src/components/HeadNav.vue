<template>
<nav class="head-nav">
   <ul class="clearFix">
        <li v-for="(item, key) in list" :key="key" :class="{active: routerPath.indexOf(item.link) != -1}">
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
import {getUrlHash} from 'assets/js/tools'
import {getMenuInfo} from 'api'

export default {
    name: 'HeadNav',
    data(){
        return {
            defaultDir: '/sys_setting', // 默认跳转的一级分类
            list: []
        }
    },
    created(){
        this.getMenuList(() => this.setNavInfo())
    },
    computed: {
        routerPath(){
            return this.$route.path
        }
    },
    watch: {
        $route(to, from){
            this.setNavInfo()
        }
    },
    methods: {
        ...mapActions([
            'createNavInfo',
            'changeNavtActive'
        ]),
        async getMenuList(callback){
            try {
                const response = await getMenuInfo()
                // console.log(response.data.list)
                if (response.data.code == 1){
                    this.list = response.data.list
                    let defaultDir = response.data.defaultLink || this.defaultDir
                    // 生成可访问的路由表
                    this.$router.addRoutes([{ path: '*', redirect: defaultDir }])
                    callback && callback()
                } else {
                    console.error(response.data.message)
                }
            } catch (err){
                console.error(err)
            }
        },
        setNavInfo(){
            let curNavObj = this.list.find(item => item.link === '/' + this.routerPath.split('/')[1])
            if (!curNavObj){
                curNavObj = this.list[0] || []
            }
            // vuex 设置导航菜单信息
            this.createNavInfo(curNavObj.list)
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

.icon {
    background-image: url(../assets/img/icons.png);
    background-repeat: no-repeat;
    display: inline-block;
    vertical-align: middle;
}

/* 一级分类图标 */
.head-nav ul li a i.graph-sys_setting {
    background-position: 0 0;
}
.head-nav ul li a i.graph-storer_manager {
    background-position: -144px 0;
}
.head-nav ul li a i.graph-sstock_manager {
    background-position: -336px 0;
}
.head-nav ul li a i.graph-logistics_manager {
    background-position: -80px 0;
}
.head-nav ul li a i.graph-stock_manager_1 {
    background-position: -176px 0;
}
</style>