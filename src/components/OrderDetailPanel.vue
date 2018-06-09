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
        <div style="padding-bottom: 20px">
            <el-table :data="order.list" border v-loading="loading">
                <el-table-column prop="code" label="原料编号" sortable></el-table-column>
                <el-table-column prop="name" label="名称"></el-table-column>
                <el-table-column prop="attribute_2_text" label="规格"></el-table-column>
                <el-table-column prop="out_unit" label="单位"></el-table-column>
                <el-table-column prop="want_num" label="数量"></el-table-column>
                <el-table-column prop="real_send_num" label="已出数量"></el-table-column>
            </el-table>
        </div>
        <div class="app-form-item tr">
            <el-button @click.stop="closePanelHandle">退出</el-button>
            <el-button type="danger" @click.stop="submitHandle(params.type)" :disabled="buttonState">
                {{ params.type === 'store' ? '撤销' : '退回' }}
            </el-button>
        </div>
        <el-dialog title="退回订单原因" @click.stop width="35%" append-to-body :visible.sync="dialogVisible">
            <el-input
                type="textarea"
                :rows="4"
                placeholder="请输入退回订单的理由..."
                v-model="remark">
            </el-input>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click.stop="backOrderHandle">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { getStoreOrderDetail, getLogisticOrderDetail, returnLogisticOrder, cancelStoreOrder } from 'api'

export default {
    name: 'OrderDetailPanel',
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
            remark: '', // 退回订单的理由
            loading: false,
            buttonState: false,
            dialogVisible: false
        }
    },
    methods: {
        async getOrderInfo(){
            try {
                this.loading = !0
                let response = null
                if (this.params.type === 'store'){
                    response = await getStoreOrderDetail({ id: this.params.id })
                } else if (this.params.type === 'logistic'){
                    response = await getLogisticOrderDetail({ id: this.params.id })
                }
                // console.log(response.data)
                if (response && response.data.code == 1){
                    this.order.code = response.data.order.order_number
                    this.order.date = response.data.order.create_time_short
                    this.order.arrivalDate = response.data.order.arrive_date
                    this.order.store = response.data.order.store_text
                    this.order.list = response.data.orderDetailsList
                    this.buttonState = !response.data.showCancelButton
                    this.order.returnReason = response.data.order.return_reason
                }
            } catch (error){
                console.error(error)
            }
            this.loading = !1
        },
        async backOrderHandle(){
            try {
                const response = await returnLogisticOrder({ id: this.params.id, content: this.remark })
                if (response.data.code == 1){
                    this.$message.success(response.data.message)
                    //
                    this.dialogVisible = !1
                    this.$emit('reloadEvent', 'reload')
                    this.closePanelHandle()
                } else {
                    this.$message.error(response.data.message)
                }
            } catch (error){
                console.error(error)
            }
        },
        execuOrderHandler(type, callback){
            this.$confirm(`确认${ type == 'store' ? '撤销' : '退回' }此订单吗?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                if (type === 'store'){
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
                } else if (type === 'logistic'){
                    setTimeout(() => {
                        this.dialogVisible = !0
                    }, 400)
                }
            }).catch(() => {})
        },
        submitHandle(type){  
            this.execuOrderHandler(type, () => {
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