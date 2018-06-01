<template>
<div class="appManager-wrapper">
    <div class="appManager-top">
        <el-select 
            class="fl" 
            v-model="depot.out" 
            clearable 
            placeholder="移出仓库"
            @change="changeHandle">
            <el-option
                v-for="(item, key) in depotOutList"
                :key="key"
                :label="item.name"
                :value="item.id">
            </el-option>
        </el-select>
        <el-select 
            class="fl" 
            style="margin-left: 10px;"
            v-model="depot.in" 
            clearable 
            placeholder="移入仓库"
            :disabled="depot.disabled">
            <el-option
                v-for="(item, key) in depotInList"
                :key="key"
                :label="item.name"
                :value="item.id"
                :disabled="item.disabled">
            </el-option>
        </el-select>
        <ul class="fr">
            <el-button @click.stop="removeItemHandle">批量移除</el-button>
            <el-button @click.stop="addMaterialHandle">添加物品</el-button>
            <el-button @click.stop="saveMaterialHandle('save')">保存</el-button>
            <el-button type="primary" @click.stop="saveMaterialHandle('submit')">提交</el-button>
        </ul>
    </div>
    <div class="appManager-list">
        <el-table class="move-depot-table" :data="list" border @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="50"></el-table-column>
            <el-table-column prop="type_2_text" label="分类"></el-table-column>
            <el-table-column prop="name" label="名称"></el-table-column>
            <el-table-column prop="code" label="物料编码"></el-table-column>
            <el-table-column prop="attribute_2_text" label="规格"></el-table-column>
            <el-table-column prop="unit_text" label="单位"></el-table-column>
            <el-table-column prop="batch_code" label="批号"></el-table-column>
            <el-table-column prop="warehouse_stock_num" label="当前库存"></el-table-column>
            <el-table-column label="移库数量">
                <template slot-scope="scope">
                    <EditNumber
                        v-model.number="scope.row.movement_num"
                        :stepVal="1"
                        :maxVal="scope.row.warehouse_stock_num">
                    </EditNumber>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="100" fixed="right">
                <template slot-scope="scope">
                    <el-button @click.stop="removeItemHandle([scope.row.id])" type="text">
                        <i class="el-icon-delete"></i> 移除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
    <ExtractPanel :params="addMaterialExtract">
        <span slot="title">选择原材料</span>
        <ShiftMaterialPanel slot="panel" :params="addMaterialExtract" @reloadEvent="reloadGetData"></ShiftMaterialPanel>
    </ExtractPanel>
</div>
</template>

<script>
import EditNumber from './EditNumber.vue'
import ExtractPanel from './ExtractPanel.vue'
import ShiftMaterialPanel from './ShiftMaterialPanel.vue'

import { mapActions } from 'vuex'

import { getDepotInfoSelect, saveMoveDepotInfo, submitMoveDepotInfo } from 'api'

export default {
    name: 'CreateMoveDepot',
    data(){
        return {
            depot: {
                in: '',
                out: '',
                disabled: true // 移入仓库的下拉框是否禁用
            },
            depotInList: [],
            depotOutList: [],
            list: [],
            orderId: '', // 新增的移库单ID
            multipleSelection: [], // 选中记录的数组
            addMaterialExtract: {
                isPlay: false
            }
        }
    },
    watch: {
        list(newVal, oldval){
            if (newVal.length){ // 数据有变化
                this.setLeaveRemind(!0)
            } else {
                this.setLeaveRemind(!1)
            }
        }
    },
    methods: {
        ...mapActions(['setLeaveRemind']),
        addMaterialHandle(_id){
            this.addMaterialExtract.isPlay = !0
            this.addMaterialExtract.out_id = this.depot.out
            this.addMaterialExtract.ids = this.list.map(item => item.id).join(',')
        },
        async getDepotList(){
            try {
                const response = await getDepotInfoSelect()
                if (response.data.code == 1){
                    response.data.list.splice(0, 1) // 删除 全部 的记录
                    this.depotOutList = response.data.list
                    this.depotInList  = _.cloneDeep(response.data.list)
                    this.depotInList.forEach(item => item.disabled = !1)
                } else {
                    this.$message.error(response.data.message)
                }
            } catch (error){
                console.error(error)
            }
        },
        reloadGetData(arr){
            if (arr.length > 0){
                this.list = this.list.concat(arr)
            }
        },
        handleSelectionChange(val){
            this.multipleSelection = val
        },
        async saveMaterialHandle(dir){
            if (this.depot.out === this.depot.in){
                return this.$message.warning('移出库不能和移入库是同一个！')
            }
            try {
                const _data = {
                    id: this.orderId,
                    outWarehouseId: this.depot.out,
                    inWarehouseId: this.depot.in,
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
                    this.orderId = response.data.id || ''
                    this.$message.success(response.data.message)
                    if (dir == 'submit'){
                        this.setLeaveRemind(!1)
                        // 跳转
                        this.$router.push('/stock_manager_1/warehouse_movement')
                    }
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
        changeHandle(val){
            if (val != ''){
                this.depot.disabled = !1
                this.depotInList.forEach(item => {
                    if (item.id == val){
                        item.disabled = !0
                    } else {
                        item.disabled = !1
                    }
                })
            } else {
                this.depot.disabled = !0
            }
        },
        removeItemById(_id){
            for (let i = 0; i < this.list.length; i++){
                if (this.list[i].id == _id){
                    this.list.splice(i, 1)
                    break
                }
            }
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
            }
            return false
        }
    },
    created(){
        this.getDepotList()
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