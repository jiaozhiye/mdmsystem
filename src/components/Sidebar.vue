<template>
    <el-menu router unique-opened class="app-sidebar-menu" 
        :default-active="$route.path" 
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
        return {}
    },
    computed: {
        ...mapGetters(['getNavInfo'])
    }
}
</script>

<style>
.app-sidebar-menu {
    border-right: none;
}
</style>