<template>
<div class="appManager-wrapper">
    <div class="appManager-top">
        <el-select 
            class="fr" 
            v-model="depot" 
            clearable 
            @change="searchHandle" 
            placeholder="选择仓库">
            <el-option
                v-for="(item, key) in depotList"
                :key="key"
                :label="item.name"
                :value="item.id">
            </el-option>
        </el-select>
    </div>
    <div class="appManager-list">
        <el-table :data="list" border v-loading="loading">
            <el-table-column prop="warehouse_text" label="仓库名称"></el-table-column>
            <el-table-column prop="code" label="编码"></el-table-column>
            <el-table-column prop="name" label="商品名称"></el-table-column>
            <el-table-column prop="attribute_2_text" label="规格"></el-table-column>
            <el-table-column prop="unit_text" label="单位"></el-table-column>
            <el-table-column prop="batch_code" label="批号"></el-table-column>
            <el-table-column prop="number" label="结存数量"></el-table-column>
        </el-table>
    </div>
</div>
</template>

<script>
import { getDepotInfoSelect, getStockBalanceList } from 'api'

export default {
    name: 'StockBalanceManager',
    data(){
        return {
            depot: '',
            depotList: [],
            list: [],
            loading: false
        }
    },
    methods: {
        async getDepotList(){
            try {
                const response = await getDepotInfoSelect()
                if (response.data.code == 1){
                    this.depotList = response.data.list
                } else {
                    this.$message.error(response.data.message)
                }
            } catch (error){
                console.error(error)
            }
        },
        async getStockBalanceList(callback){
            try {
                this.loading = !0
                const response = await getStockBalanceList({ warehouseId: this.depot })
                // console.log(response.data)
                if (response.data.code == 1){
                    this.list = response.data.list
                }
                callback && callback()
            } catch (error){
                console.error(error)
            }
            this.loading = !1
        },
        searchHandle(){
            this.getStockBalanceList()
        }
    },
    created(){
        this.getDepotList()
        this.getStockBalanceList()
    }
}
</script>

<style>
</style>