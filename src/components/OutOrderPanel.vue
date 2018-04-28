<template>
<div class="out-order-panel">
    <div class="appManager-top tr">
        <el-button @click.stop="outDepotFunc">出库</el-button>
        <el-button>打印</el-button>
        <el-button>打印历史</el-button>
        <el-button type="primary" @click.stop="saveOutOrder">保存</el-button>
    </div>
    <div style="margin: 20px 0;">
        <el-table class="out-order-table" :data="list" border v-loading="loading">
            <el-table-column prop="code" label="物料编号" sortable></el-table-column>
            <el-table-column prop="name" label="名称"></el-table-column>
            <el-table-column prop="attribute_2" label="规格"></el-table-column>
            <el-table-column prop="unit_text" label="单位"></el-table-column>
            <el-table-column prop="want_num" label="订货数量"></el-table-column>
            <el-table-column prop="security_stock" label="安存数量"></el-table-column>
            <el-table-column label="批号" label-class-name="split-column-th" class-name="split-column">
                <template slot-scope="scope">
                    <div v-for="(item, key) in scope.row.warehouseStockInfo" :key="key">{{ item.batch_code }}</div>
                </template>
            </el-table-column>
            <el-table-column label="出货数量" width="140" label-class-name="split-column-th" class-name="split-column">
                <template slot-scope="scope">
                    <div v-for="(item, key) in scope.row.warehouseStockInfo" :key="key">
                        <EditNumber
                            v-if="item.isEdit"
                            v-model.number="item.send_number"
                            :stepVal="1"
                            :maxVal="item.warehouseStockNumber"
                            @change="inputNumberHandle(item)">
                        </EditNumber>
                        <span v-else>{{ item.send_number }}</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="库存数量" label-class-name="split-column-th" class-name="split-column">
                <template slot-scope="scope">
                    <div v-for="(item, key) in scope.row.warehouseStockInfo" :key="key">{{ item.warehouseStockNumber }}</div>
                </template>
            </el-table-column>
        </el-table>
    </div>
    <div class="app-form-item tr">
        <el-button @click.stop="closePanelHandle">取消</el-button>
    </div>
</div>
</template>

<script>
import EditNumber from './EditNumber.vue'

import { getOutOrderDetail, closeOutOrder } from 'api'

export default {
    name: 'OutOrderPanel',
    props: {
        params: Object
    },
    data(){
        return {
            list: [],
            loading: false
        }
    },
    methods: {
        async getOutOrderInfo(){
            try {
                this.loading = !0
                const response = await getOutOrderDetail({ id: this.params.id })
                // console.log(response.data)
                response.data.list.forEach(item => {
                    item.warehouseStockInfo.forEach(val => val.isEdit = !0)
                })
                this.list = response.data.list
            } catch (error){
                console.error(error)
            }
            this.loading = !1
        },
        outDepotFunc(){

        },
        async saveOutOrder(callback){
            try {
                const response = await closeOutOrder({ id: this.params.id })
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
        inputNumberHandle(item){
            this.$nextTick(() => {
                if (item.send_number >= item.warehouseStockNumber){
                    this.$message.warning('发货数量不能大于库存数量！')
                }
            })
        },
        submitHandle(){  
            this.saveOutOrder(() => {
                this.closePanelHandle()
            })
        },
        closePanelHandle(){
            this.params.isPlay = false
        },
        keyUpHandle(event){
            event.stopPropagation()
            if (event.keyCode === 13 && event.target.classList.value.search('el-input__inner') !== -1){
                const inputNumberArr = Array.from(document.querySelectorAll('.out-order-table > .el-table__body-wrapper .el-input__inner'))
                let index = inputNumberArr.findIndex(item => item === event.target)
                if (index === -1){
                    return
                }
                index = (++index) % inputNumberArr.length
                // console.log(index)
                inputNumberArr[index].focus()
            }
            return false
        }
    },
    created(){
        this.getOutOrderInfo()
    },
    mounted(){
        document.querySelector('.out-order-table').addEventListener('keyup', this.keyUpHandle, false)
    },
    destroyed(){
        document.querySelector('.out-order-table').removeEventListener('keyup', this.keyUpHandle)
    },
    components: {
        EditNumber
    }
}
</script>

<style>
.out-order-panel {
    padding: 20px 20px 0;
}
.out-order-table .split-column {
    padding-top: 0;
    padding-bottom: 0;
}
.out-order-table .split-column .cell {
    padding: 0;
    outline: none;
}
.out-order-table .split-column .cell > div {
    height: 48px;
    line-height: 48px;
    padding: 0 10px;
    outline: none;
}
.out-order-table .split-column .cell > div:not(:last-child) {
    border-bottom: 1px solid #ebeef5;
}
.out-order-table .split-column-th .cell {
    padding-left: 10px;
}
</style>