<template>
<div class="appManager-wrapper" style="padding: 20px;">
    <div class="appManager-top">
        <strong class="promptText fl">{{ msgText }}</strong>
        <ul class="fr">
            <el-button @click.stop="removeItemHandle" v-if="!disabled">批量移除</el-button>
            <el-button @click.stop="addMaterialHandle" v-if="!disabled">添加物品</el-button>
            <el-button @click.stop="saveMaterialHandle('save')" :loading="btnLoading" :disabled="disabled">保存</el-button>
            <el-button type="primary" @click.stop="saveMaterialHandle('submit')" :loading="btnLoading" :disabled="disabled">提交</el-button>
        </ul>
    </div>
    <div class="appManager-list">
        <el-table class="move-depot-table" :data="list" border v-loading="loading" @selection-change="handleSelectionChange">
            <el-table-column :type="!disabled ? 'selection' : 'index'" width="50"></el-table-column>
            <el-table-column prop="type_2_text" label="分类"></el-table-column>
            <el-table-column prop="name" label="名称"></el-table-column>
            <el-table-column prop="code" label="物料编码"></el-table-column>
            <el-table-column prop="attribute_2_text" label="规格"></el-table-column>
            <el-table-column prop="unit_text" label="单位"></el-table-column>
            <el-table-column prop="batch_code" label="批号"></el-table-column>
            <el-table-column prop="warehouse_stock_num" label="当前库存"></el-table-column>
            <el-table-column label="移库数量" width="140">
                <template slot-scope="scope">
                    <EditNumber
                        v-if="!disabled"
                        v-model.number="scope.row.movement_num"
                        :stepVal="1"
                        :maxVal="scope.row.warehouse_stock_num">
                    </EditNumber>
                    <span v-else>{{ scope.row.movement_num }}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="100" fixed="right">
                <template slot-scope="scope">
                    <el-button @click.stop="removeItemHandle([scope.row.id])" type="text" :disabled="disabled">
                        <i class="el-icon-delete"></i> 移除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
    <ExtractPanel :params="addMaterialExtract" top="0px">
        <span slot="title">选择原材料</span>
        <ShiftMaterialPanel slot="panel" :params="addMaterialExtract" @reloadEvent="reloadGetData"></ShiftMaterialPanel>
    </ExtractPanel>
</div>
</template>

<script>
import EditNumber from './EditNumber.vue'
import ExtractPanel from './ExtractPanel.vue'
import ShiftMaterialPanel from './ShiftMaterialPanel.vue'

import { mapActions, mapState } from 'vuex'

import { getMoveDepotList, saveMoveDepotInfo, submitMoveDepotInfo } from 'api'

export default {
    name: 'ModMoveDepotPanel',
    props: {
        params: Object
    },
    data(){
        return {
            outDepot: {
                id: '',
                name: '',
            },
            inDepot: {
                id: '',
                name: '',
            },
            list: [],
            referData: [], // 用于对比的数据
            loading: false,
            disabled: !this.params.isEdit,
            msgText: '',
            multipleSelection: [], // 选中记录的数组
            addMaterialExtract: {
                isPlay: false
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
        addMaterialHandle(_id){
            this.addMaterialExtract.isPlay = !0
            this.addMaterialExtract.out_id = this.outDepot.id
            this.addMaterialExtract.ids = this.list.map(item => item.id).join(',')
        },
        reloadGetData(arr){
            if (arr.length > 0){
                this.list = this.list.concat(arr)
            }
        },
        handleSelectionChange(val){
            this.multipleSelection = val
        },
        async getMoveDepotList(){
            try {
                this.loading = !0
                const response = await getMoveDepotList({ id: this.params.id })
                // console.log(response.data)
                if (response.data.code == 1){
                    this.list = response.data.list
                    this.msgText = response.data.info
                    this.outDepot.id = response.data.warehouse_movement_order.out_warehouse_id
                    this.outDepot.name = response.data.warehouse_movement_order.out_warehouse_name
                    this.inDepot.id = response.data.warehouse_movement_order.in_warehouse_id
                    this.inDepot.name = response.data.warehouse_movement_order.in_warehouse_name
                    // 
                    this.referData = _.cloneDeep(this.list)
                } else {
                    this.$message.error(response.data.message)
                }
            } catch (error){
                console.error(error)
            }
            this.loading = !1
        },
        async saveMaterialHandle(dir){
            if (this.outDepot.id === this.inDepot.id){
                return this.$message.warning('移出库不能和移入库是同一个！')
            }
            try {
                const _data = {
                    id: this.params.id,
                    list: this.list.map(item => ({
                        id: item.id,
                        movement_num: item.movement_num
                    })),
                    reason: ''
                }
                let response = null
                if (dir == 'save'){ // 保存
                    response = await saveMoveDepotInfo(_data)
                } else { // 提交
                    response = await submitMoveDepotInfo(_data)
                }
                // console.log(response.data)
                if (response && response.data.code == 1){
                    this.$message.success(response.data.message)
                    this.$emit('reloadEvent', 'reload')
                    this.closePanelHandle()
                } else {
                    this.$message.error(response.data.message)
                }
            } catch (error){
                console.error(error)
            }
        },
        removeItemHandle(ids){
            if (!Array.isArray(ids)){
                ids = this.multipleSelection.map(item => item.id)
                if (ids.length == 0){
                    return this.$message.warning('请勾选原材料名称！')
                }
            }
            ids.forEach(item => this.removeItemById(item))
        },
        removeItemById(_id){
            for (let i = 0; i < this.list.length; i++){
                if (this.list[i].id == _id){
                    this.list.splice(i, 1)
                    break
                }
            }
        },
        closePanelHandle(){
            this.setLeaveRemind(!1)
            this.params.isPlay = false
        },
        keyUpHandle(event){
            event.stopPropagation()
            if (event.keyCode === 13 && event.target.classList.value.search('el-input__inner') !== -1){
                const inputNumberArr = Array.from(document.querySelectorAll('.move-depot-table > .el-table__body-wrapper .el-input__inner'))
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
        this.getMoveDepotList()
    },
    mounted(){
        document.querySelector('.move-depot-table').addEventListener('keyup', this.keyUpHandle, false)
    },
    destroyed(){
        document.querySelector('.move-depot-table').removeEventListener('keyup', this.keyUpHandle)
    },
    components: {
        EditNumber,
        ExtractPanel,
        ShiftMaterialPanel
    }
}
</script>

<style>
</style>