<template>
    <el-menu router class="app-sidebar-menu" 
        :default-active="getNavActive.hash" 
        :default-openeds="[getNavActive.depth]" 
        background-color="#273240" 
        text-color="#fff" 
        active-text-color="#ffd04b">
        <el-submenu v-for="(val, key) in getNavInfo" :index="val.depth">
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
        return {}
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
.app-sidebar-menu {
    border-right: none;
}
</style>