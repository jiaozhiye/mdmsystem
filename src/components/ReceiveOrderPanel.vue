<template>
    <div class="out-order-panel">
        <div style="padding-bottom: 20px">
            <el-table class="receive-order-panel" :data="list" border v-loading="loading">
                <el-table-column prop="code" label="编号" sortable></el-table-column>
                <el-table-column prop="name" label="名称"></el-table-column>
                <el-table-column prop="attribute_2_text" label="规格"></el-table-column>
                <el-table-column prop="unit_text" label="单位"></el-table-column>
                <el-table-column prop="send_num" label="采购数"></el-table-column>
                <el-table-column label="应入库数" width="140">
                    <template slot-scope="scope">
                        <EditNumber
                            v-model.number="scope.row.receive_num"
                            :stepVal="1">
                        </EditNumber>
                    </template>
                </el-table-column>
                <el-table-column prop="stock_num" label="当前库存"></el-table-column>
            </el-table>
        </div>
        <div class="app-form-item tr">
            <el-button @click.stop="closePanelHandle">退出</el-button>
            <el-button type="primary" @click.stop="submitHandle">保存</el-button>
        </div>
    </div>
</template>

<script>
import EditNumber from './EditNumber.vue'
import { getReceiveOrderDetail, saveReceiveOrder } from 'api'

export default {
    name: 'ReceiveOrderPanel',
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
        async getReceiveOrderInfo(){
            try {
                this.loading = !0
                const response = await getReceiveOrderDetail({ id: this.params.id })
                // console.log(response.data)
                if (response.data.code == 1){
                    this.list = response.data.list
                }
            } catch (error){
                console.error(error)
            }
            this.loading = !1
        },
        async saveReceiveOrder(callback){
            try {
                const response = await saveReceiveOrder({
                    id: this.params.id,
                    list: this.list.map(item => ({
                        id: item.id,
                        receive_num: item.receive_num,
                        material_id: item.material_id
                    }))
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
        submitHandle(){  
            this.saveReceiveOrder(() => {
                this.closePanelHandle()
            })
        },
        closePanelHandle(){
            this.params.isPlay = false
        },
        keyUpHandle(event){
            event.stopPropagation()
            if (event.keyCode === 13 && event.target.classList.value.search('el-input__inner') !== -1){
                const inputNumberArr = Array.from(document.querySelectorAll('.receive-order-panel > .el-table__body-wrapper .el-input__inner'))
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
        this.getReceiveOrderInfo()
    },
    mounted(){
        document.querySelector('.receive-order-panel').addEventListener('keyup', this.keyUpHandle, false)
    },
    destroyed(){
        document.querySelector('.receive-order-panel').removeEventListener('keyup', this.keyUpHandle)
    },
    components: {
        EditNumber
    }
}
</script>

<style>
.out-order-panel {
    padding: 20px;
    overflow: hidden;
}
</style>