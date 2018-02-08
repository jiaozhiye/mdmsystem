<template>
<div class="appManager-wrapper">
    <div class="appManager-top">
        <el-button class="fl" @click.stop="importSaleHandle">导入数据</el-button>
    </div>
    <div style="margin-top: 20px">
        <el-table :data="list" border style="width: 100%" v-loading="loading">
            <el-table-column prop="code" label="代码"></el-table-column>
            <el-table-column prop="name" label="名称" sortable></el-table-column>
            <el-table-column prop="price" label="单价" sortable></el-table-column>
            <el-table-column prop="sale_num" label="出品数量"></el-table-column>
            <el-table-column prop="sale_price" label="出品金额"></el-table-column>
            <el-table-column prop="refund_num" label="退单数量"></el-table-column>
            <el-table-column prop="refund_price" label="退单金额"></el-table-column>
            <el-table-column prop="manager_meal_num" label="经理餐数量"></el-table-column>
            <el-table-column prop="manager_meal_price" label="经理餐金额"></el-table-column>
        </el-table>
    </div>
    <el-dialog title="数据导入提示" :visible.sync="dialogVisible" width="30%">
        <ImportSalePanel @reloadEvent="reloadData"></ImportSalePanel>
    </el-dialog>
</div>
</template>

<script>
import ImportSalePanel from './ImportSalePanel.vue'
import moment from 'moment'
import {getScaleImportedInfo} from 'api'

export default {
    name: 'ImportSaleManager',
    data(){
        return {
            list: [],
            loading: false,
            dialogVisible: false
        }
    },
    methods: {
        importSaleHandle(){
            this.dialogVisible = !0
        },
        reloadData(res, _bool){
            this.list.splice(0)
            this.list = res
            this.dialogVisible = _bool
        },
        async getSaleList(){
            this.loading = !0
            try {
                const response = await getScaleImportedInfo({
                    impTime: moment().format('YYYY-MM-DD')
                })
                if (response.data.code == 1){
                    this.list = response.data.imp_data
                } else {
                    this.$message({
                        type: 'error',
                        message: response.data.message
                    })
                }
                this.loading = !1
            } catch (err){
                console.error(err)
            }
        }
    },
    created(){
        this.getSaleList()
    },
    components: {
        ImportSalePanel
    }
}
</script>

<style>
</style>