<template>
    <div class="out-order-panel">
        <div style="padding-bottom: 20px;">
            <el-table class="out-order-table" ref="table" :data="list" border v-loading="loading">
                <el-table-column prop="code" label="编号" sortable></el-table-column>
                <el-table-column prop="name" label="名称" min-width="150"></el-table-column>
                <el-table-column prop="want_num" label="采购数"></el-table-column>
                <el-table-column prop="unit" label="采购单位"></el-table-column>
                <el-table-column prop="stock_num" label="当前库存"></el-table-column>
                <el-table-column label="规格" label-class-name="split-column-th" class-name="split-column">
                    <template slot-scope="scope">
                        <div v-for="(item, key) in scope.row.orderInfo" :key="key">{{ item.attribute_2_text }}</div>
                    </template>
                </el-table-column>
                <el-table-column label="单位" label-class-name="split-column-th" class-name="split-column">
                    <template slot-scope="scope">
                        <div v-for="(item, key) in scope.row.orderInfo" :key="key">{{ item.out_unit }}</div>
                    </template>
                </el-table-column>
                <el-table-column label="入库数量" label-class-name="split-column-th" class-name="split-column">
                    <template slot-scope="scope">
                        <div v-for="(item, key) in scope.row.orderInfo" :key="key">{{ item.send_number }}</div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="app-form-item tr">
            <el-button @click.stop="closePanelHandle">退出</el-button>
            <el-button type="primary" @click.stop="submitHandle" :loading="btnLoading">接收入库</el-button>
        </div>
    </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'

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
            referData: [], // 用于对比的数据
            loading: false
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
        async getReceiveOrderInfo(){
            try {
                this.loading = !0
                const response = await getReceiveOrderDetail({ id: this.params.id })
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
                const response = await saveReceiveOrder({
                    id: this.params.id,
                    list: this.list.map(item => ({
                        id: item.id,
                        material_id: item.material_id,
                        receive_num: item.send_number
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
                this.$emit('reloadEvent', 'reload')
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
                const inputNumberArr = Array.from(this.$refs.table.$el.querySelectorAll('.el-table__body-wrapper .el-input__inner'))
                let index = inputNumberArr.findIndex(item => item === event.target)
                if (index === -1){
                    return
                }
                index = (++index) % inputNumberArr.length
                // console.log(index)
                inputNumberArr[index].focus()
                inputNumberArr[index].select()
            }
            return false
        }
    },
    created(){
        this.getReceiveOrderInfo()
    },
    mounted(){
        this.$refs.table.$el.addEventListener('keyup', this.keyUpHandle, false)
    },
    beforeDestroy(){
        this.$refs.table.$el.removeEventListener('keyup', this.keyUpHandle)
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
    max-width: 100%;
}
.out-order-table .split-column .cell > div:not(:last-child) {
    border-bottom: 1px solid #ebeef5;
}
.out-order-table .split-column-th .cell {
    padding-left: 10px;
}
</style>