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
            curIndex: 0, // 当前一级分类索引
            parentDepth: '', // 父级元素的深度
            list: []
        }
    },
    created(){
        this.getMenuList(() => {
            this.iterFunc(this.list, '')
            this.setNavInfo()
        })
    },
    watch: {
        $route(to, from){
            if (this.list.length > 0 && to.path.split('/').length < 3){
                this.setNavInfo()
            }
        }
    },
    methods: {
        ...mapActions([
            'createNavInfo',
            'changeNavtActive'
        ]),
        getMenuList(callback){
            this.$http.get('/mgr/menu', {
                params: {}
            })
            .then(response => {
                if (response.data.code == 1){
                    this.list = response.data.list
                    callback && callback()
                } else {
                    console.error(response.data.message)
                }
            })
        },
        setNavInfo(){
            let _hash = getUrlHash() == '/' ? '/sys_setting' : getUrlHash()
            // 获取一级分类索引
            this.curIndex = this.list.findIndex(item => {
                return item.link === '/' + _hash.split('/')[1]
            })
            // vuex 设置导航菜单信息
            this.createNavInfo(this.list[this.curIndex].list)
            if (_hash.split('/').length < 3 || _hash.split('/')[2] == ''){
                _hash = this.list[this.curIndex].list[0].list[0].link
            }
            // 获取父元素的深度
            this.findParDepth(this.list, _hash)
            // vuex 切换导航菜单选中状态
            this.changeNavtActive({
                hash: _hash,
                depth: this.parentDepth
            })
        },
        iterFunc(arr, str){
            for (let i = 0; i < arr.length; i++){
                arr[i].depth = str + i
                if (_.isArray(arr[i].list)){
                    this.iterFunc(arr[i].list, arr[i].depth + '-')
                }
            }
        },
        findParDepth(arr, str){
            for (let i = 0; i < arr.length; i++){
                if (arr[i].link === str){
                    this.parentDepth = arr[i].depth.slice(0, -2)
                } else {
                    if (_.isArray(arr[i].list)){
                        this.findParDepth(arr[i].list, str)
                    }
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

.head-nav ul li a i.graph-sys_setting {
    background-position: 0 0;
}
</style>