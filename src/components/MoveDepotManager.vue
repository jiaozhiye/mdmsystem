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
            <el-button type="primary" @click.stop="addMaterialHandle">添加物品</el-button>
        </ul>
    </div>
    <div class="appManager-list">
        <el-table :data="list" border @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="50" fixed></el-table-column>
            <el-table-column prop="warehouse_text" label="所属分类"></el-table-column>
            <el-table-column prop="code" label="编码"></el-table-column>
            <el-table-column prop="attribute_2_text" label="规格"></el-table-column>
            <el-table-column prop="unit_text" label="单位"></el-table-column>
            <el-table-column prop="batch_code" label="价格"></el-table-column>
            <el-table-column prop="number" label="移库数量"></el-table-column>
            <el-table-column prop="number" label="合计金额"></el-table-column>
            <el-table-column prop="number" label="库存"></el-table-column>
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
import ExtractPanel from './ExtractPanel.vue'
import ShiftMaterialPanel from './ShiftMaterialPanel.vue'

import { getDepotInfoSelect } from 'api'

export default {
    name: 'MoveDepotManager',
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
            multipleSelection: [], // 选中记录的数组
            addMaterialExtract: {
                isPlay: false
            }
        }
    },
    methods: {
        addMaterialHandle(_id){
            this.addMaterialExtract.isPlay = !0
            this.addMaterialExtract.out_id = this.depot.out
        },
        async getDepotList(){
            try {
                const response = await getDepotInfoSelect()
                if (response.data.code == 1){
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
                this.list = arr
            }
        },
        handleSelectionChange(val){
            this.multipleSelection = val
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
            if (val != '' && val != '-1'){
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
        }
    },
    created(){
        this.getDepotList()
    },
    components: {
        ExtractPanel,
        ShiftMaterialPanel
    }
}
</script>

<style>
</style>