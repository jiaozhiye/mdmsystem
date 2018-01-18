<template>
    <el-menu router :default-active="getNavActive" :default-openeds="openeds" 
        class="el-menu-vertical-demo" 
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
            openeds: []
        }
    },
    watch: {
        getNavActive(){
            this.openeds.splice(0, 1, this.getOpenedsKey())
        }
    },
    methods: {
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