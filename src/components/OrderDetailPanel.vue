<template>
    <div class="order-detail-wrapper">
        <div class="order-detail-top">
            <ul class="clearFix">
                <li>订单号：{{ order.code }}</li>
                <li>订单日期：{{ order.date }}</li>
                <li>到货日期：{{ order.arrivalDate }}</li>
                <li>门店名称：{{ order.store }}</li>
            </ul>
        </div>
        <div style="padding-bottom: 20px">
            <el-table :data="order.list" border v-loading="loading">
                <el-table-column prop="code" label="原料编号" sortable></el-table-column>
                <el-table-column prop="name" label="名称"></el-table-column>
                <el-table-column prop="attribute_2" label="规格"></el-table-column>
                <el-table-column prop="unit_text" label="单位"></el-table-column>
                <el-table-column prop="want_num" label="数量"></el-table-column>
                <el-table-column prop="send_num" label="已出数量"></el-table-column>
            </el-table>
        </div>
        <div class="app-form-item tr">
            <el-button @click.stop="closePanelHandle">退出</el-button>
            <el-button type="primary" @click.stop="submitHandle" :disabled="buttonState">关闭订单</el-button>
        </div>
    </div>
</template>

<script>
import { getOrderDetail, closeOrder } from 'api'

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
                list: [] // 数组
            },
            loading: false,
            buttonState: false
        }
    },
    methods: {
        async getOrderInfo(){
            try {
                this.loading = !0
                const response = await getOrderDetail({ id: this.params.id })
                // console.log(response.data)
                this.order.code = response.data.order.order_number
                this.order.date = response.data.order.create_time_short
                this.order.arrivalDate = response.data.order.arrive_date
                this.order.store = response.data.order.store_text
                this.order.list = response.data.orderDetailsList
                if (response.data.order.status == '100'){
                    this.buttonState = !0
                }
            } catch (error){
                console.error(error)
            }
            this.loading = !1
        },
        async closeOrderFn(callback){
            try {
                const response = await closeOrder({ id: this.params.id })
                if (response.data.code == 1){
                    this.$message.success(response.data.message)
                    callback && callback()
                } else {
                    this.$message.error(response.data.message)
                }
            } catch (error){
                console.error(error)
            }
        },
        submitHandle(){  
            this.closeOrderFn(() => {
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