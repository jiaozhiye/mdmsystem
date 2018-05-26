<template>
    <div class="out-order-panel">
        <div style="padding-bottom: 20px">
            <el-table class="scrap-order-panel" :data="list" border v-loading="loading">
                <el-table-column prop="name" label="原材料名称"></el-table-column>
                <el-table-column prop="code" label="原材料编码"></el-table-column>
                <el-table-column prop="unit_text" label="单位"></el-table-column>
                <el-table-column prop="stock" label="库存数量"></el-table-column>
                <el-table-column label="废弃数量" width="140">
                    <template slot-scope="scope">
                        <EditNumber
                            v-model.number="scope.row.number"
                            :stepVal="1">
                        </EditNumber>
                    </template>
                </el-table-column>
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

import { mapActions } from 'vuex'

import { getEditedScrapMaterial, saveEditedScrapMaterial } from 'api'

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
                const response = await getEditedScrapMaterial({ id: this.params.id })
                // console.log(response.data)
                if (response.data.code == 1){
                    this.list = response.data.list
                    // 
                    this.referData = _.cloneDeep(this.list)
                }
            } catch (error){
                console.error(error)
            }
            this.loading = !1
        },
        async saveReceiveOrder(callback){
            try {
                const response = await saveEditedScrapMaterial({
                    id: this.params.id,
                    list: this.list.map(item => ({
                        id: item.id,
                        store_scrap_material_id: item.store_scrap_material_id,
                        number: item.number
                    }))
                })
                if (response.data.code == 1){
                    this.$message.success(response.data.message)
                    this.setLeaveRemind(!1)
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