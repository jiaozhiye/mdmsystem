<template>
<div class="appManager-wrapper">
    <div class="appManager-list" style="margin-top: 0;">
        <el-table :data="list" border v-loading="loading">
            <el-table-column prop="warehouse_out_order_number" label="出库单号"></el-table-column>
            <el-table-column prop="out_time" label="出库日期" sortable></el-table-column>
            <el-table-column prop="store_order_number" label="订货单号"></el-table-column>
            <el-table-column prop="create_time_short" label="订单日期" sortable></el-table-column>
            <el-table-column prop="arrive_date" label="预计到货日期" sortable></el-table-column>
            <el-table-column label="操作" width="100">
                <template slot-scope="scope">
                    <el-button @click.stop="viewItemHandle(scope.row.store_order_id)" type="text">
                        <i class="el-icon-edit"></i> 详情
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
    <ExtractPanel :params="receiveOrderExtract">
        <span slot="title">入库单详情</span>
        <ReceiveOrderPanel slot="panel" :params="receiveOrderExtract" @reloadEvent="reloadGetData"></ReceiveOrderPanel>
    </ExtractPanel>
</div>
</template>

<script>
import ExtractPanel from './ExtractPanel.vue'
import ReceiveOrderPanel from './ReceiveOrderPanel.vue'

import { getReceiveOrder } from 'api'

export default {
    name: 'ReceivePutManager',
    data(){
        return {
            list: [],
            loading: false,
            receiveOrderExtract: {
                isPlay: false
            }
        }
    },
    methods: {
        viewItemHandle(_id){
            this.receiveOrderExtract.isPlay = !0
            this.receiveOrderExtract.id = _id
        },
        async getReceiveOrderList(callback){
            try {
                this.loading = !0
                const response = await getReceiveOrder()
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
        reloadGetData(res){
            if (res == 'reload'){
                this.getReceiveOrderList()
            }
        }
    },
    created(){
        this.getReceiveOrderList()
    },
    components: {
        ExtractPanel,
        ReceiveOrderPanel
    }
}
</script>

<style>
</style>