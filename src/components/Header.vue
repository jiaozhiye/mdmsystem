<template>
<div class="app-header clearFix">
    <div class="app-head-logo fl">
        <router-link to="/">长春市面对面管理系统</router-link>
    </div>
    <div class="app-top-nav fl">
        <HeadNav></HeadNav>
    </div>
    <div class="user-setting fr">
        <DropdownMenu placement="right">
            <span slot="title">管理员</span>
            <div slot="list" class="user-setting-list">
                <ul>
                    <li @click.stop.native="">
                        个人设置
                    </li>
                    <li @click.stop.native="">
                        安全退出
                    </li>
                </ul>
            </div>
        </DropdownMenu>
    </div>
</div>
</template>

<script>
import HeadNav from './HeadNav.vue'
import DropdownMenu from './DropdownMenu.vue'

export default {
    name: 'Header',
    data(){
        return {}
    },
    components: {
        HeadNav,
        DropdownMenu
    }
}
</script>

<style>
.app-header .app-head-logo {
    width: 180px;
    color: #fff;
    font-size: 16px;
}
.app-header .app-head-logo a {
    color: #fff;
}

.user-setting {
    height: 50px;
}
.user-setting-list {
    padding: 6px 0;
}
.user-setting-list ul li {
    line-height: 32px;
    padding: 0 15px;
    cursor: pointer;
}
.user-setting-list ul li:hover {
    background: #2dc3e8;
    color: #fff;
}
</style>