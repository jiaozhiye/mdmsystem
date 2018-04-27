<template>
<div class="app-form-panel">
    <div class="appManager-top tr">
        <el-button @click.stop="outDepotFunc">出库</el-button>
        <el-button>打印</el-button>
        <el-button>打印历史</el-button>
        <el-button type="primary" @click.stop="saveOutOrder">保存</el-button>
    </div>
    <div>
        <el-table class="out-order-table" :data="list" border v-loading="loading">
            <el-table-column prop="code" label="物料编号" sortable></el-table-column>
            <el-table-column prop="name" label="名称"></el-table-column>
            <el-table-column prop="attribute_2" label="规格"></el-table-column>
            <el-table-column prop="unit_text" label="单位"></el-table-column>
            <el-table-column prop="want_num" label="批号"></el-table-column>
            <el-table-column label="订货数量" width="140">
                <template slot-scope="scope">
                    <EditNumber
                        v-if="scope.row.isEdit"
                        v-model.number="scope.row.number"
                        :stepVal="1">
                    </EditNumber>
                    <span v-else>{{ scope.row.number }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="send_num" label="出货数量"></el-table-column>
            <el-table-column prop="send_num" label="库存数量"></el-table-column>
            <el-table-column prop="send_num" label="安存数量"></el-table-column>
        </el-table>
    </div>
    <div class="app-form-item tr">
        <el-button @click.stop="closePanelHandle">取消</el-button>
    </div>
</div>
</template>

<script>
import { getOrderDetail, closeOrder } from 'api'

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
                const response = await getOrderDetail({ id: this.params.id })
                // console.log(response.data)
                this.order.list = response.data.list
            } catch (error){
                console.error(error)
            }
            this.loading = !1
        },
        outDepotFunc(){

        },
        async saveOutOrder(callback){
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
    }
}
</script>

<style>
</style>