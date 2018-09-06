<template>
    <el-menu router unique-opened class="app-sidebar-menu" 
        :default-active="getNavActive.hash" 
        background-color="#273240" 
        text-color="#fff" 
        active-text-color="#ffd04b">
        <el-submenu v-for="val in getNavInfo" :key="val.title" :index="val.title">
            <template slot="title">
                <i :class="'el-icon-' + val.iconName"></i>
                <span>{{ val.title }}</span>
            </template>
            <el-menu-item v-for="item in val.list" :key="item.link" :index="item.link">
                {{ item.title }}
            </el-menu-item>
        </el-submenu>
    </el-menu>
</template>

<script>
import {mapActions, mapGetters} from 'vuex'
import {getUrlHash} from 'assets/js/tools'

export default {
    name: 'Sidebar',
    data(){
        return {
            menuItemList: []
        }
    },
    computed: {
        ...mapGetters([
            'getNavInfo',
            'getNavActive'
        ])
    },
    watch: {
        getNavActive (newVal, oldVal){
            if (getUrlHash().split('/').length < 3){
                this.$nextTick(() => {
                    this.getDomList()
                    this.bindEvent(this.menuItemList)
                    this.toggleNavStyle(this.menuItemList, 0)
                })
            }
        }
    },
    methods: {
        getDomList(){
            this.menuItemList = this.$el.getElementsByClassName('el-menu-item')
        },
        toggleNavStyle(arr, index){
            for (let i = 0; i < arr.length; i++){
                arr[i].classList.remove('is-active')
                arr[i].style.color = 'rgb(255, 255, 255)'
            }
            arr[index].classList.add('is-active')
            arr[index].style.color = 'rgb(255, 208, 75)'
        },
        bindEvent(arr){
            const _this = this
            for (let i = 0; i < arr.length; i++){
                arr[i].index = i
                arr[i].onclick = function(ev){
                    // ev.stopPropagation()
                    _this.toggleNavStyle(arr, this.index)
                }
            }
        }
    }
}
</script>

<style>
.app-sidebar-menu {
    border-right: none;
}
</style>