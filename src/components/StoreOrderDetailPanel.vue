<template>
    <div class="order-detail-wrapper">
        <div class="order-detail-top">
            <ul class="clearFix">
                <li>订单号：{{ order.code }}</li>
                <li>订单日期：{{ order.date }}</li>
                <li>到货日期：{{ order.arrivalDate }}</li>
                <li>门店名称：{{ order.store }}</li>
            </ul>
            <dl style="line-height: 26px;" v-if="!!order.returnReason">
                退回理由：{{ order.returnReason }}
            </dl>
        </div>
        <div style="padding-bottom: 20px;">
            <el-table :data="order.list" border v-loading="loading">
                <el-table-column prop="code" label="原料编号" sortable></el-table-column>
                <el-table-column prop="name" label="名称" min-width="150"></el-table-column>
                <el-table-column prop="want_num" label="采购数量"></el-table-column>
                <el-table-column prop="unit" label="采购单位"></el-table-column>
                <el-table-column prop="real_send_num" label="已出数量"></el-table-column>
                <el-table-column prop="out_unit" label="提货单位"></el-table-column>
            </el-table>
        </div>
        <div class="app-form-item tr">
            <el-button @click.stop="closePanelHandle">退出</el-button>
            <el-button type="danger" @click.stop="submitHandle" :disabled="buttonState" :loading="btnLoading">撤销</el-button>
        </div>
    </div>
</template>

<script>
import { getStoreOrderDetail, cancelStoreOrder } from 'api'
import { mapState } from 'vuex'

export default {
    name: 'StoreOrderDetailPanel',
    props: {
        params: Object
    },
    data(){
        return {
            order: {
                code: '', // 订单号
                date: '', // 订单日期
                arrivalDate: '', // 到货日期
                store: '', // 门店
                list: [], // 数组
                returnReason: '' // 退货理由
            },
            loading: false,
            buttonState: false
        }
    },
    computed: {
        ...mapState(['btnLoading'])
    },
    methods: {
        async getOrderInfo(){
            try {
                this.loading = !0
                const response = await getStoreOrderDetail({ id: this.params.id })
                // console.log(response.data)
                if (response && response.data.code == 1){
                    this.order.code = response.data.order.order_number
                    this.order.date = response.data.order.create_time_short
                    this.order.arrivalDate = response.data.order.arrive_date
                    this.order.store = response.data.order.store_text
                    this.order.list = response.data.orderDetailsList
                    this.buttonState = !response.data.showCancelButton
                    this.order.returnReason = response.data.order.return_reason || ''
                }
            } catch (error){
                console.error(error)
            }
            this.loading = !1
        },
        execuOrderHandler(callback){
            this.$confirm(`确认撤销此订单吗?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                try {
                    const response = await cancelStoreOrder({ id: this.params.id })
                    if (response.data.code == 1){
                        this.$message.success(response.data.message)
                        callback && callback()
                    } else {
                        this.$message.error(response.data.message)
                    }
                } catch (error){
                    console.error(error)
                }
            }).catch(() => {})
        },
        submitHandle(){  
            this.execuOrderHandler(() => {
                this.$emit('reloadEvent', 'reload')
                this.closePanelHandle()
            })
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