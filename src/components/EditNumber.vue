<template>
<el-tooltip :content="promptMsg" placement="top">
    <div class="input-number-wrapper">
        <el-input-number 
            size="mini"
            :value="value"
            :min="minVal"
            :max="maxVal"
            :step="stepVal"
            :controls-position="ctrlPos"
            :disabled="disabled"
            @input.native="handleInput($event, $event.target.value)"
            @change="handleChange"
            @click.native.stop="">
        </el-input-number>
    </div>
</el-tooltip>
</template>

<script>
// 要让组件的 v-model 生效，组件需要接受一个 value props，并触发 input 事件，
// 并将新值作为实参，同时在 input 事件处理函数中触发传入组件的自定义事件

export default {
    name: 'EditNumber',
    props: {
        value: {
            type: Number,
            default: 1
        },
        ctrlPos: {
            type: String,
            default: ''
        },
        tooltip: {
            type: Boolean,
            default: true
        },
        minVal: {
            type: Number,
            default: 0
        },
        maxVal: {
            type: Number,
            default: 9999
        },
        stepVal: {
            type: Number,
            default: 1
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },
    data (){
        return {
            dataVal: this.value
        }
    },
    computed: {
        promptMsg(){
            if (this.value < 0){
                return '请输入数字'
            }
            return this.formatNumber(this.value)
        }
    },
    methods: {
        formatNumber(val){
            val += ''
            const list = val.split('.')
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
        },
        handleInput(event, val){
            const reg = /^(0|[1-9][0-9]*)(\.[0-9]*)?$/
            if ((!isNaN(val) && reg.test(val)) || val === ''){
                this.dataVal = Number(val)
                // 触发传入组件 change 自定义事件，带出数值
                this.$emit('change', this.dataVal)
                // 触发传入组件 input 自定义事件，带出数值
                this.$emit('input', this.dataVal)
            } else {
                this.$nextTick(() => event.target.value = this.dataVal)
            }
        },
        handleChange(val){
            this.$emit('change', val)
            this.$emit('input', val)
        }
    }
}
</script>

<style>
.input-number-wrapper {
    display: inline-block;
    max-width: 120px;
}
.input-number-wrapper .el-input-number {
    width: 100%;
}
</style>