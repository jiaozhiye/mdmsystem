<template>
    <h3 class="welcome-title">{{ msg }}</h3>
</template>

<script>
export default {
    name: 'Home',
    data (){
        return {
            msg: '欢迎使用面对面供应链管理系统'
        }
    }
}
</script>

<style>
.welcome-title {
    margin-top: 30vh;
    text-align: center;
    font-size: 26px;
}
</style>