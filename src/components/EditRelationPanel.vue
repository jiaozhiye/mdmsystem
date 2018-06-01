<template>
<div class="appManager-wrapper relation-wrapper">
    <div class="appManager-top">
        <el-button class="fl" @click.stop="addMaterialHandle">添加原材料</el-button>
        <el-button class="fl" @click.stop="batchDeleteHandle">批量删除</el-button>
        <span class="fl relation-top-tit">
            <i class="el-icon-question"></i> 配方估算成本：{{ totalPrice }} 元/份
        </span>
        <el-button class="fr" type="primary" :loading="btnLoading" @click.stop="saveHandle"> 保 存 </el-button>
    </div>
    <div class="appManager-list fixedTable-list">
        <el-table 
            :data="list" 
            border 
            v-loading="loading" 
            @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="50" fixed></el-table-column>
            <el-table-column prop="name" label="原材料名称" min-width="200" fixed sortable></el-table-column>
            <el-table-column prop="type_2_text" label="原材料中类" width="120"></el-table-column>
            <el-table-column prop="code" label="原材料编号" width="120"></el-table-column>
            <el-table-column prop="wm_type_text" label="库存类型" width="120"></el-table-column>
            <el-table-column prop="goods_unit_text" label="单位(标准)" width="100"></el-table-column>
            <el-table-column prop="purchase_price" label="估算单价" width="100"></el-table-column>
            <el-table-column label="净料数量" width="120">
                <template slot-scope="scope">
                    <span v-if="!scope.row.isEdit">{{ scope.row.net_num }}</span>
                    <EditNumber
                        v-if="scope.row.isEdit"
                        v-model.number="scope.row.net_num"
                        :stepVal="1"
                        @change="computeJlPrice(scope.row)">
                    </EditNumber>
                </template>
            </el-table-column>
            <el-table-column label="出成率" width="100">
                <template slot-scope="scope">{{ scope.row.yield_rate * 100 + '%' }}</template>
            </el-table-column>
            <el-table-column label="毛料数量" width="120">
                <template slot-scope="scope">
                    <span v-if="!scope.row.isEdit">{{ scope.row.gross_num }}</span>
                    <EditNumber
                        v-if="scope.row.isEdit"
                        v-model.number="scope.row.gross_num"
                        :stepVal="1"
                        @change="computeMlPrice(scope.row)">
                    </EditNumber>
                </template>
            </el-table-column>
            <el-table-column prop="total_price" label="估算金额"></el-table-column>
            <el-table-column label="操作" width="150" fixed="right">
                <template slot-scope="scope">
                    <el-button @click.stop="editItemHandle(scope.row)" type="text">
                        <i class="el-icon-edit"></i> {{ scope.row.isEdit ? '完成' : '编辑' }}
                    </el-button>
                    <el-button @click.stop="delItemHandle(scope.row.id)" type="text">
                        <i class="el-icon-delete"></i> 删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
    <ExtractPanel :params="addFormulaExtract" width="60%" top="0px">
        <span slot="title">添加配方(原材料)</span>
        <AddFormulaPanel slot="panel" 
            :params="addFormulaExtract" 
            @reloadEvent="addMaterialList">
        </AddFormulaPanel>
    </ExtractPanel>
</div>
</template>

<script>
import ExtractPanel from './ExtractPanel.vue'
import AddFormulaPanel from './AddFormulaPanel'
import EditNumber from './EditNumber.vue'

import { mapActions } from 'vuex'

import {getGoodsFormulaInfo, saveGdRelation} from 'api'

export default {
    name: 'EditRelationPanel',
    props: {
        params: Object
    },
    data(){
        return {
            goodsId: this.params.itemId, // 当前商品ID
            list: [],
            referData: [], // 用于对比的数据
            loading: false,
            btnLoading: false,
            multipleSelection: [], // 选中记录的数组
            addFormulaExtract: {
                formulaIds: [], // 配方(原材料)记录的ID数组
                isPlay: false
            }
        }
    },
    computed: {
        totalPrice(){ // 配方估算成本求和
            let sum = 0
            this.list.forEach(item => sum += item.total_price)
            return parseFloat(sum.toFixed(5))
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
        handleSelectionChange(val){
            this.multipleSelection = val
        },
        editItemHandle(item){
            item.isEdit = !item.isEdit
        },
        delItemHandle(_id){
            this.$confirm('确认删除此原材料吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.removeItemById(_id)
                // 从 formulaIds 数组中移除当前删除元素的ID
                this.addFormulaExtract.formulaIds.splice(this.addFormulaExtract.formulaIds.findIndex(item => item.id == _id), 1)
                this.$message({
                    type: 'success',
                    message: '操作成功!'
                })
            }).catch(() => {})
        },
        batchDeleteHandle(){
            if (this.multipleSelection.length == 0){
                return this.$message({
                    type: 'warning',
                    message: '请勾选原材料记录再进行批量删除!'
                })
            }
            this.$confirm(`确认要删除选中的${this.multipleSelection.length}条记录吗？`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.multipleSelection.forEach(item => {
                    this.removeItemById(item.id)
                    // 从 formulaIds 数组中移除批量选中元素的ID
                    this.addFormulaExtract.formulaIds.splice(this.addFormulaExtract.formulaIds.findIndex(val => val.id == item.id), 1)
                })
                // 清空 multipleSelection
                this.multipleSelection.splice(0)
                this.$message({
                    type: 'success',
                    message: '操作成功!'
                })
            }).catch(() => {})
        },
        computeJlPrice(item){ // 净料数量 和 毛料数量 的计算
            this.$nextTick(() => {
                let val = item.net_num / item.yield_rate
                item.gross_num = parseFloat(val.toFixed(5))
                this.computePrice(item)
            })
        },
        computeMlPrice(item){ // 净料数量 和 毛料数量 的计算
            this.$nextTick(() => {
                let val = item.gross_num * item.yield_rate
                item.net_num = parseFloat(val.toFixed(5))
                this.computePrice(item)
            })
        },
        computePrice(item){
            // 计算估算价格
            let val = item.purchase_price * item.gross_num
            item.total_price = parseFloat(val.toFixed(5))
        },
        addMaterialHandle(){
            this.addFormulaExtract.isPlay = !0
            this.addFormulaExtract.itemId = this.goodsId
        },
        addMaterialList(res){
            // console.log(res)
            setTimeout(() => {
                this.list = res
                // 原材料联动 重设 formulaIds 数组
                this.addFormulaExtract.formulaIds = res.map(item => ({id: item.id, data: item}))
            }, 0)
        },
        async getGoodsFormulaList(callback){
            try {
                const response = await getGoodsFormulaInfo({
                    id: this.goodsId
                })
                // console.log(response.data)
                if (response.data.code == 1){
                    response.data.list.map(item => {
                        item.isEdit = false
                        // 初始化 formulaIds 数组，同步原材料默认选中
                        this.addFormulaExtract.formulaIds.push({
                            id: item.id,
                            data: item
                        })
                    })
                    // console.log(response.data.list)
                    this.list = response.data.list
                    // 
                    this.referData = _.cloneDeep(this.list)
                }
                callback && callback()
            } catch (error){
                console.error(error)
            }
        },
        saveHandle(){
            this.insertRelationInfo(() => {
                this.$emit('reloadEvent', 'reload')
                this.closePanelHandle()
            })
        },
        async insertRelationInfo(callback){
            try {
                this.btnLoading = !0
                const response = await saveGdRelation({
                    id: this.goodsId,
                    list: this.list,
                    totalPrice: this.totalPrice
                })
                if (response.data.code == 1){
                    this.$message({
                        type: 'success',
                        message: '商品配方设置成功!'
                    })
                    this.btnLoading = !1
                    callback && callback()
                } else {
                    this.$message({
                        type: 'error',
                        message: response.data.message
                    })
                }
            } catch (err){
                console.error(err)
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
        closePanelHandle(){
            this.setLeaveRemind(!1)
            this.params.isPlay = false
        }
    },
    created(){
        this.getGoodsFormulaList()
    },
    components: {
        ExtractPanel,
        AddFormulaPanel,
        EditNumber
    }
}
</script>

<style>
.relation-wrapper {
    padding: 20px;
}
.relation-top-tit {
    line-height: 40px;
    margin-left: 10px;
    color: #909399;
}
.relation-top-tit i {
    font-size: 20px;
    vertical-align: middle;
    margin-top: -2px;
}
.relation-wrapper .relation-input-number {
    width: 100%;
}
</style>