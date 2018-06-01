<template>
<div class="appManager-wrapper" style="padding-top: 0;">
    <div class="appManager-list">
        <el-table class="el-origin-table" :data="list" border v-loading="loading">
            <el-table-column prop="code" label="编码"></el-table-column>
            <el-table-column prop="name" label="名称"></el-table-column>
            <el-table-column prop="attribute_2_text" label="规格"></el-table-column>
            <el-table-column prop="unit_text" label="单位"></el-table-column>
            <el-table-column prop="number" label="结存数量"></el-table-column>
        </el-table>
    </div>
</div>
</template>

<script>
import { getstoreStockInfo } from 'api'

export default {
    name: 'StoreStockManager',
    data(){
        return {
            list: [],
            loading: false
        }
    },
    methods: {
        async getStockList(callback){
            try {
                this.loading = !0
                const response = await getstoreStockInfo()
                // console.log(response.data)
                if (response.data.code == 1){
                    this.list = response.data.list
                }
                callback && callback()
            } catch (error){
                console.error(error)
            }
            this.loading = !1
        }
    },
    created(){
        this.getStockList()
    }
}
</script>

<style>
</style>