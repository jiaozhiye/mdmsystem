<template>
<div class="input-number-panel">
    <el-tooltip :content="title" placement="top-start">
        <input type="text" :value="value" class="el-input__inner" style="height: 32px">
    </el-tooltip>
</div>
</template>

<script>
export default {
    name: 'InputNumPanel',
    props: ['value'],
    data(){
        return {}
    },
    computed: {
        title(){
            if (this.value.toString() === ''){
                return '请输入数字'
            }
            return this.formatNumber(this.value)
        }
    },
    methods: {
        formatNumber(value){
            value += ''
            const list = value.split('.')
            const prefix = list[0].charAt(0) === '-' ? '-' : ''
            let num = prefix ? list[0].slice(1) : list[0]
            let result = ''
            while (num.length > 3){
                result = `,${num.slice(-3)}${result}`
                num = num.slice(0, num.length - 3)
            }
            if (num){
                result = num + result
            }
            return `${prefix}${result}${list[1] ? `.${list[1]}` : ''}`
        }
    },
    mounted(){
        const _this = this
        let val = ''
		this.$el.getElementsByTagName('input')[0].addEventListener('input', function(){
			const reg = /^(0|[1-9][0-9]*)(\.[0-9]*)?$/
			const value = this.value
			if ((!isNaN(value) && reg.test(value)) || value === ''){
				val = value
                // 触发 change 事件
                _this.$emit('change', value)
                // 通过 input 事件带出数值
                _this.$emit('input', value)
			} else {
				this.value = val
			}
		}, false)
    }
}
</script>

<style>
.input-number-panel {
    display: inline-block;
    max-width: 100px;
}
</style>