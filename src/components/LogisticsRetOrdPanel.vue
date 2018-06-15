<template>
    <div class="order-detail-wrapper">
        <div class="order-detail-top tr">
            <el-button 
                @click.stop="returnOrderHandle('receive')" 
                :loading="btnLoading"
                :disabled="btnState.receive">
                接收
            </el-button>
            <el-button 
                type="primary" 
                @click.stop="returnOrderHandle('complete')" 
                :loading="btnLoading"
                :disabled="btnState.complete">
                完成
            </el-button>
            <el-button
                type="danger" 
                @click.stop="closeOrderHandle('l')"
                :loading="btnLoading" 
                :disabled="btnState.close">
                关闭订单
            </el-button>
        </div>
        <div style="padding-bottom: 20px">
            <el-table 
                class="returnOrderTable"
                ref="returnOrderTable" 
                :data="list" 
                border 
                v-loading="loading" 
                highlight-current-row
                @row-click="rowClickHandle">
                <el-table-column prop="order_number" label="订单编号" fixed></el-table-column>
                <el-table-column prop="store_name" label="门店名称" min-width="150"></el-table-column>
                <el-table-column prop="name" label="原料名称"></el-table-column>
                <el-table-column prop="attribute2_text" label="规格"></el-table-column>
                <el-table-column prop="number" label="数量"></el-table-column>
                <el-table-column prop="unit_text" label="单位"></el-table-column>
                <el-table-column label="批号" width="130">
                    <template slot-scope="scope">
                        <el-select 
                            v-model="scope.row.batch_code_text" 
                            placeholder="选择批号"
                            size="small">
                            <el-option
                                v-for="(item, key) in scope.row.batch_code"
                                :key="key"
                                :label="item.name"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column prop="remark" label="原因"></el-table-column>
            </el-table>
        </div>
        <div class="app-form-item tr">
            <el-button @click.stop="closePanelHandle">退出</el-button>
        </div>
    </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'

import { getLogisticsRetOrdDetail, receiveLogisticsRetOrd, completeLogisticsRetOrd, cancleReturnOrder } from 'api'

export default {
    name: 'LogisticsRetOrdPanel',
    props: {
        params: Object
    },
    data(){
        return {
            list: [], // 数组
            referData: [], // 用于对比的数据
            loading: false,
            btnState: { // 按钮状态
                receive: false,
                complete: false,
                close: false
            }
        }
    },
    computed: {
        ...mapState(['btnLoading'])
    },
    watch: {
        list: {
            handler(newVal, oldVal){
                if (!_.isEqual(newVal, this.referData)){ // 数据改变了
                    this.setLeaveRemind(!0)
                } else {
                    this.setLeaveRemind(!1)
                }
            },
            deep: true
        }
    },
    methods: {
        ...mapActions(['setLeaveRemind']),
        setTableCurrent(row){
            this.$refs.returnOrderTable.setCurrentRow(row)
        },
        rowClickHandle(){
            this.setTableCurrent()
        },
        checkBatchCodes(){
            const noBatchCodes = this.list.filter(item => {
                if (item.batch_code_text === '') return item
            })
            if (noBatchCodes.length > 0){
                noBatchCodes.forEach(item => this.setTableCurrent(item))
                return false
            } else {
                return true
            }
        },
        async getOrderInfo(){
            try {
                this.loading = !0
                const response = await getLogisticsRetOrdDetail({ orderId: this.params.id })
                // console.log(response.data)
                if (response.data.code == 1){
                    this.list = response.data.materialOrderList
                    // 初始化按钮的状态
                    this.btnState.receive  = !response.data.isRecive
                    this.btnState.complete = !response.data.isFinish
                    this.btnState.close    = !response.data.isClose
                    // 
                    this.referData = _.cloneDeep(this.list)
                }
            } catch (error){
                console.error(error)
            }
            this.loading = !1
        },
        async orderHandler(type, callback){
            try {
                if (!this.checkBatchCodes()){
                    return this.$message.warning('请选择原料批号！')
                }
                const _list = this.list.map(item => ({
                    material_id: item.material_id,
                    batch_code_text: item.batch_code_text
                }))
                let response = null
                if (type === 'receive'){
                    response = await receiveLogisticsRetOrd({
                        id: this.params.id,
                        list: _list
                    })
                } else if (type === 'complete'){
                    response = await completeLogisticsRetOrd({
                        id: this.params.id,
                        list: _list
                    })
                }
                if (response && response.data.code == 1){
                    this.$message.success(response.data.message)
                    callback && callback()
                } else {
                    this.$message.error(response.data.message)
                }
            } catch (error){
                console.error(error)
            }
        },
        async cancleHandler(type, callback){
            try {
                const response = await cancleReturnOrder({
                    id: this.params.id,
                    type: type
                })
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
        returnOrderHandle(type){
            this.orderHandler(type, () => {
                this.$emit('reloadEvent', 'reload')
                this.closePanelHandle()
            })
        },
        closeOrderHandle(type){
            this.cancleHandler(type, () => {
                this.$emit('reloadEvent', 'reload')
                this.closePanelHandle()
            })
        },
        closePanelHandle(){
            this.setLeaveRemind(!1)
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
.returnOrderTable tr.current-row > td {
    background-color: #fef0f0;
}
</style>