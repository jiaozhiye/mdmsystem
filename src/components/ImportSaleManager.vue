<template>
<div class="appManager-wrapper">
    <div class="appManager-top">
        <el-button class="fl" @click.stop="importDataHandle">导入数据</el-button>
    </div>
    <div class="appManager-list">
        <el-table :data="list" border style="width: 100%" v-loading="loading">
            <el-table-column v-for="(val, key) in thead" :key="key" 
                :prop="key" :label="val">
            </el-table-column>
        </el-table>
    </div>
</div>
</template>

<script>
import {getSaleInfo} from 'api'

export default {
    name: 'ImportSaleManager',
    data(){
        return {
            list: [],
            thead: {},
            loading: false
        }
    },
    methods: {
        importDataHandle(){
            setTimeout(() => {
                this.thead = {name: '姓名', age: '年龄', school: '大学'}
                this.list = [{
                    id: 1,
                    name: 'xdd',
                    age: 50,
                    school: '清华大学'
                }]
            }, 500)
        },
        async getDataList(){
            this.loading = !0
            try {
                const response = await getSaleInfo()
                // console.log(response.data)
                

            } catch (error){
                console.error(error)
            }
             this.loading = !1
        }
    },
    created(){
        // this.getDataList()
    }
}
</script>

<style>
</style>