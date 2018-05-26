<template>
    <input type="text" :value="value" @input="handle">
</template>

<script>
export default {
    name: 'Home',
    props: ['value'],
    methods: {
        handle(event){
            this.$emit('input', event.target.value)
            // 组件的自定义事件
            this.$emit('fn', event.target.value)
        }
    }
}
</script>

<style>
</style>