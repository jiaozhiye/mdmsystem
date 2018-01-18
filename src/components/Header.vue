<template>
<div class="app-header clearFix">
    <div class="app-head-logo fl">
        <router-link to="/">长春市吉软教育培训学校</router-link>
    </div>
    <div class="fl">
        <HeadNav></HeadNav>
    </div>
</div>
</template>

<script>
import HeadNav from './HeadNav.vue'

export default {
    name: 'Header',
    data(){
        return {
            
        }
    },
    components: {
        HeadNav
    }
}
</script>

<style>
.app-header .app-head-logo {
    width: 180px;
    color: #fff;
    font-size: 16px;
}
.app-head-logo a {
    color: #fff;
}
</style>