<template>
    <el-menu router class="el-menu-vertical-demo" 
        :default-active="getNavActive" 
        :default-openeds="openeds" 
        background-color="#273240" 
        text-color="#fff" 
        active-text-color="#ffd04b">
      <el-submenu v-for="(val, key) in getNavInfo" :index="val.index">
        <template slot="title">
          <i :class="'el-icon-' + val.iconName"></i>
          <span>{{ val.title }}</span>
        </template>
        <el-menu-item v-for="(item, index) in val.list" :index="item.link">
          {{ item.title }}
        </el-menu-item>
      </el-submenu>
    </el-menu>
</template>

<script>
import {mapActions, mapGetters} from 'vuex'

export default {
    name: 'Sidebar',
    data(){
        return {
            menuItemList: [],
            openeds: []
        }
    },
    watch: {
        getNavActive(){
            this.openeds.splice(0, 1, this.getOpenedsKey())
        }
    },
    methods: {
        toggleNavStyle(index){
            for (let i = 0; i < this.menuItemList.length; i++){
                this.menuItemList[i].classList.remove('is-active')
                this.menuItemList[i].style.color = 'rgb(255, 255, 255)'
            }
            this.menuItemList[index].classList.add('is-active')
            this.menuItemList[index].style.color = 'rgb(255, 208, 75)'
        },
        getOpenedsKey(){
            for (let i = 0; i < this.getNavInfo.length; i++){
                for (let k = 0; k < this.getNavInfo[i].list.length; k++){
                    if (this.getNavInfo[i].list[k].link === this.getNavActive){
                        return this.getNavInfo[i].index
                    }
                }
            }
        }
    },
    mounted(){
        this.menuItemList = this.$el.getElementsByClassName('el-menu-item')
        const _this = this
        for (let i = 0; i < this.menuItemList.length; i++){
            this.menuItemList[i].index = i
            this.menuItemList[i].onclick = function(ev){
                ev.stopPropagation()
                _this.toggleNavStyle(this.index)
            }
        }
    },
    updated(){
        this.toggleNavStyle(0)
    },
    computed: {
        ...mapGetters([
            'getNavInfo',
            'getNavActive'
        ])
    }
}
</script>

<style>
.el-menu-vertical-demo {
    border-right: none;
}
</style>