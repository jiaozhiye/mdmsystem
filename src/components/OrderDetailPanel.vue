<template>
    <div class="order-detail-wrapper">
        <div class="order-detail-top">
            <ul class="clearFix">
                <li>出库单号：{{ order.order_number }}</li>
                <li>门店：{{ order.store_name }}</li>
                <li>出库日期：{{ order.out_time }}</li>
                <li>仓库：{{ order.warehouse_name }}</li>
            </ul>
            <dl style="line-height: 26px;" v-if="!!order.returnReason">
                退回理由：{{ order.returnReason }}
            </dl>
        </div>
        <div style="padding-bottom: 20px;">
            <el-table :data="order.list" border v-loading="loading">
                <el-table-column prop="code" label="原料编号" sortable></el-table-column>
                <el-table-column prop="name" label="名称"></el-table-column>
                <el-table-column prop="send_num" label="发货数量" sortable></el-table-column>
                <el-table-column prop="attribute_2_text" label="规格"></el-table-column>
                <el-table-column prop="out_unit" label="单位"></el-table-column>
                <el-table-column prop="batch_code" label="批号"></el-table-column>
            </el-table>
        </div>
        <div class="app-form-item tr">
            <el-button @click.stop="closePanelHandle">退出</el-button>
        </div>
    </div>
</template>

<script>
import { getOutDepotOrderInfo } from 'api'
import { mapState } from 'vuex'

export default {
    name: 'OrderDetailPanel',
    props: {
        params: Object
    },
    data(){
        return {
            order: {
                order_number: '',
                store_name: '',
                out_time: '',
                warehouse_name: '',
                returnReason: '',
                list: []
            },
            loading: false
        }
    },
    computed: {
        ...mapState(['btnLoading'])
    },
    methods: {
        async getOrderInfo(){
            try {
                this.loading = !0
                const response = await getOutDepotOrderInfo({ id: this.params.id })
                // console.log(response.data)
                if (response && response.data.code == 1){
                    this.order.order_number = response.data.order.order_number
                    this.order.store_name = response.data.order.store_name
                    this.order.out_time = response.data.order.out_time
                    this.order.warehouse_name = response.data.order.warehouse_name
                    this.order.list = response.data.list
                    this.order.returnReason = response.data.order.return_reason || ''
                }
            } catch (error){
                console.error(error)
            }
            this.loading = !1
        },
        closePanelHandle(){
            this.params.isPlay = false
        }
    },
    created(){
        this.getOrderInfo()
    }
}
</script>

<style>
.order-detail-wrapper {
    padding: 0 20px;
}
.order-detail-top {
    padding: 10px 0;
    overflow: hidden;
}
.order-detail-top ul li {
    float: left;
    width: 50%;
    line-height: 26px;
}
</style>