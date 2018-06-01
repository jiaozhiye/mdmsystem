<template>
    <div class="out-order-panel">
        <div class="tr">
            <el-button 
                type="primary" 
                v-if=" params.menuType === 'store' " 
                @click.stop="submitHandle('save')" 
                :disabled="!params.isEdit">保存</el-button>
            <el-button 
                type="primary" 
                v-if=" params.menuType === 'logistic' " 
                @click.stop="submitHandle('receive')" 
                :disabled="!params.isEdit">接收</el-button>
            <el-button type="primary" @click.stop="submitHandle('close')" :disabled="!params.isEdit">关闭订单</el-button>
        </div>
        <div style="padding: 20px 0;">
            <el-table class="scrap-order-panel" :data="list" border v-loading="loading">
                <el-table-column prop="name" label="原材料名称"></el-table-column>
                <el-table-column prop="code" label="原材料编码"></el-table-column>
                <el-table-column prop="unit_text" label="单位"></el-table-column>
                <el-table-column prop="stock" label="库存数量"></el-table-column>
                <el-table-column label="废弃数量" width="140">
                    <template slot-scope="scope">
                        <EditNumber
                            v-model.number="scope.row.number"
                            :maxVal="scope.row.stock"
                            :stepVal="1"
                            :disabled="!params.isEdit">
                        </EditNumber>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="app-form-item tr">
            <el-button @click.stop="closePanelHandle">退出</el-button>
        </div>
    </div>
</template>

<script>
import EditNumber from './EditNumber.vue'

import { mapActions } from 'vuex'

import { getEditedScrapMaterial, saveEditedScrapMaterial, changeScrapOrderState, getLogisticScrapMaterial, receiveEditedScrapMaterial, changeLogisticScrapOrderState } from 'api'

export default {
    name: 'ShowScrapOrderPanel',
    props: {
        params: Object
    },
    data(){
        return {
            list: [],
            referData: [], // 用于对比的数据
            loading: false
        }
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
        async getReceiveOrderInfo(){
            try {
                this.loading = !0
                let response = null
                if (this.params.menuType === 'store'){
                    response = await getEditedScrapMaterial({ id: this.params.id })
                } else if (this.params.menuType === 'logistic'){
                    response = await getLogisticScrapMaterial({ id: this.params.id })
                }
                // console.log(response.data)
                if (response && response.data.code == 1){
                    this.list = response.data.list
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
                let response = null
                // 保存 或 接收 订单
                if (type === 'save'){
                    response = await saveEditedScrapMaterial({
                        id: this.params.id,
                        list: this.list.map(item => ({
                            id: item.id,
                            store_scrap_material_id: item.store_scrap_material_id,
                            number: item.number
                        }))
                    })
                } else if (type === 'receive'){
                    response = await receiveEditedScrapMaterial({ id: this.params.id })
                }
                // 关闭订单
                if (this.params.menuType === 'store' && type === 'close'){
                    response = await changeScrapOrderState({ id: this.params.id })
                } else if (this.params.menuType === 'logistic' && type === 'close'){
                    response = await changeLogisticScrapOrderState({ id: this.params.id })
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
        submitHandle(type){  
            this.orderHandler(type, () => {
                this.closePanelHandle()
            })
        },
        closePanelHandle(){
            this.setLeaveRemind(!1)
            this.params.isPlay = false
        },
        keyUpHandle(event){
            event.stopPropagation()
            if (event.keyCode === 13 && event.target.classList.value.search('el-input__inner') !== -1){
                const inputNumberArr = Array.from(document.querySelectorAll('.scrap-order-panel > .el-table__body-wrapper .el-input__inner'))
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
        document.querySelector('.scrap-order-panel').addEventListener('keyup', this.keyUpHandle, false)
    },
    destroyed(){
        document.querySelector('.scrap-order-panel').removeEventListener('keyup', this.keyUpHandle)
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